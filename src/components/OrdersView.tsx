import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  ExternalLink,
  Calendar,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Order, Currency, User } from '../types.ts';
import { formatPrice } from '../utils/currency.ts';
import { generateInvoicePDF } from '../utils/pdfInvoice.ts';

interface OrdersViewProps {
  user: User | null;
  currency: Currency;
  exchangeRate: number;
  onNavigateHome: () => void;
  onSelectProductById: (productId: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  user,
  currency,
  exchangeRate,
  onNavigateHome,
  onSelectProductById
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const email = user?.email || '';
      const userId = user?.id || '';
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'pending' && o.orderStatus !== 'Pending') return false;
    if (activeFilter === 'processing' && o.orderStatus !== 'Processing') return false;
    if (activeFilter === 'shipped' && o.orderStatus !== 'Shipped') return false;
    if (activeFilter === 'completed' && o.orderStatus !== 'Completed') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.items.some((it) => it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q)) ||
        (o.paystackReference && o.paystackReference.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-gray-800">
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Orders & Invoices</h1>
          <p className="text-xs text-gray-500 mt-1">
            Track current deliveries, view historic shipments, and download official PDF tax invoices.
          </p>
        </div>

        {/* Search Orders */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search orders, SKU, item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-[#f08804] focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mb-6 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${activeFilter === 'all' ? 'bg-[#131921] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          All Orders ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('pending')}
          className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${activeFilter === 'pending' ? 'bg-[#131921] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Pending
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('processing')}
          className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${activeFilter === 'processing' ? 'bg-[#131921] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Processing
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('shipped')}
          className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${activeFilter === 'shipped' ? 'bg-[#131921] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Shipped & In Transit
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('completed')}
          className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${activeFilter === 'completed' ? 'bg-[#131921] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Completed
        </button>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="py-12 text-center text-gray-500 text-xs">
          Loading order history and invoices...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-500 space-y-3">
          <Package className="w-12 h-12 mx-auto text-gray-300" />
          <h3 className="font-bold text-gray-800 text-base">No orders found</h3>
          <p className="text-xs max-w-sm mx-auto">
            You have not placed any orders matching this criteria yet.
          </p>
          <button
            onClick={onNavigateHome}
            className="mt-2 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-semibold text-xs py-2 px-6 rounded-full shadow-xs"
          >
            Start Browsing Store
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-xs"
            >
              {/* Amazon Order Header Card */}
              <div className="bg-[#f0f2f2] px-4 py-3 border-b border-gray-200 text-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-gray-500 block uppercase text-[10px] font-semibold">Order Placed</span>
                    <span className="text-gray-800 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 block uppercase text-[10px] font-semibold">Total</span>
                    <span className="text-gray-800 font-bold">
                      {formatPrice(order.totalUSD, currency, exchangeRate)}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 block uppercase text-[10px] font-semibold">Ship To</span>
                    <span className="text-blue-700 font-medium hover:underline cursor-pointer">
                      {order.customerName}
                    </span>
                  </div>

                  {order.paystackReference && (
                    <div>
                      <span className="text-gray-500 block uppercase text-[10px] font-semibold">Paystack Ref</span>
                      <span className="font-mono text-gray-700">{order.paystackReference}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-gray-500 block uppercase text-[10px] font-semibold">Order #</span>
                    <span className="font-mono font-bold text-gray-900">{order.orderNumber}</span>
                  </div>

                  {/* Download PDF Invoice Button */}
                  <button
                    type="button"
                    onClick={() => generateInvoicePDF(order)}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold px-3 py-1.5 rounded-md shadow-xs transition-colors flex items-center gap-1.5 text-xs text-[#007185] hover:text-[#c45500]"
                    title="Download Official PDF Invoice"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF Invoice</span>
                  </button>
                </div>
              </div>

              {/* Order Status Bar */}
              <div className="px-6 py-4 border-b border-gray-100 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        order.orderStatus === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : order.orderStatus === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      Estimated Delivery:{' '}
                      {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <span className="text-xs text-gray-500 font-mono">
                    Tracking: {order.trackingNumber || 'Processing in warehouse'}
                  </span>
                </div>

                {/* Progress tracker */}
                <div className="relative flex items-center justify-between text-[11px] text-gray-500 font-medium">
                  <div className="flex items-center gap-1 text-green-700 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Ordered
                  </div>
                  <div className={`flex items-center gap-1 ${['Processing', 'Shipped', 'Completed'].includes(order.orderStatus) ? 'text-green-700 font-bold' : 'text-gray-400'}`}>
                    <CheckCircle2 className="w-4 h-4" /> Processing
                  </div>
                  <div className={`flex items-center gap-1 ${['Shipped', 'Completed'].includes(order.orderStatus) ? 'text-green-700 font-bold' : 'text-gray-400'}`}>
                    <Truck className="w-4 h-4" /> Dispatched / Air Freight
                  </div>
                  <div className={`flex items-center gap-1 ${order.orderStatus === 'Completed' ? 'text-green-700 font-bold' : 'text-gray-400'}`}>
                    <CheckCircle2 className="w-4 h-4" /> Delivered
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="p-6 space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded p-1 flex items-center justify-center shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <h4
                          onClick={() => onSelectProductById(item.productId)}
                          className="text-xs sm:text-sm font-semibold text-blue-700 hover:underline cursor-pointer line-clamp-2"
                        >
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span>SKU: {item.sku}</span>
                          <span>•</span>
                          <span className="font-semibold text-gray-800">
                            {formatPrice(item.priceUSD, currency, exchangeRate)} each
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectProductById(item.productId)}
                      className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-semibold text-xs py-1.5 px-3 rounded-full shadow-xs shrink-0 whitespace-nowrap"
                    >
                      Buy Again
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
