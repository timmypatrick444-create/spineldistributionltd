import React, { useState } from 'react';
import {
  Shield,
  Lock,
  CreditCard,
  Building2,
  FileText,
  Truck,
  CheckCircle,
  AlertCircle,
  Download,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { CartItem, Currency, User, Order } from '../types.ts';
import { formatPrice } from '../utils/currency.ts';
import { generateInvoicePDF } from '../utils/pdfInvoice.ts';

interface CheckoutPageProps {
  cartItems: CartItem[];
  currency: Currency;
  exchangeRate: number;
  user: User | null;
  deliveryLocation: string;
  onOrderSuccess: (order: Order) => void;
  onNavigateHome: () => void;
  onNavigateCart: () => void;
}

const COMPANY_LOGO_URL = 'https://res.cloudinary.com/bmv4hvtk/image/upload/v1788619290/Spinel_Distribution.jpg';

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  currency,
  exchangeRate,
  user,
  deliveryLocation,
  onOrderSuccess,
  onNavigateHome,
  onNavigateCart
}) => {
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'po'>('paystack');

  // Customer & Shipping fields
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 382-9901');
  const [companyName, setCompanyName] = useState(user?.company || '');
  const [streetAddress, setStreetAddress] = useState('142 Enterprise Logistics Way');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [country, setCountry] = useState(deliveryLocation || 'United States');
  const [postalCode, setPostalCode] = useState('10001');

  // PO Number
  const [poNumber, setPoNumber] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotalUSD = cartItems.reduce((acc, it) => acc + it.product.priceUSD * it.quantity, 0);
  const taxUSD = subtotalUSD * 0.075; // 7.5% VAT
  const shippingFeeUSD = shippingMethod === 'express' ? 120 : (subtotalUSD > 1000 ? 0 : 50);
  const grandTotalUSD = subtotalUSD + taxUSD + shippingFeeUSD;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      if (!customerName || !customerEmail || !streetAddress) {
        throw new Error('Please fill in all required delivery and contact details.');
      }

      const orderItems = cartItems.map((it) => ({
        product: it.product,
        quantity: it.quantity,
        unitPriceUSD: it.product.priceUSD,
        totalUSD: it.product.priceUSD * it.quantity
      }));

      // Initialize Paystack payment or commercial PO order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          customerName,
          customerEmail,
          customerPhone,
          companyName,
          shippingAddress: {
            street: streetAddress,
            city,
            state,
            postalCode,
            country
          },
          items: orderItems,
          subtotalUSD,
          taxUSD,
          shippingFeeUSD,
          totalUSD: grandTotalUSD,
          currency,
          exchangeRate,
          paymentMethod: paymentMethod === 'paystack' ? 'Paystack Live' : 'Corporate Purchase Order',
          paymentReference: paymentMethod === 'paystack' ? `PSTK_${Date.now()}_${Math.floor(Math.random() * 1000)}` : `PO-${poNumber || Date.now()}`
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to complete order');
      }

      const createdOrder: Order = await response.json();
      setCompletedOrder(createdOrder);
      onOrderSuccess(createdOrder);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during checkout processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  // If order was successfully completed
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-xs text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Thank you for your order!</h1>
            <p className="text-xs text-gray-500">
              Order Confirmation #{completedOrder.id} has been dispatched to your email ({completedOrder.customerEmail}).
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 text-left text-xs space-y-2 max-w-lg mx-auto">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Reference:</span>
              <span className="font-bold text-gray-900">{completedOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method:</span>
              <span className="font-semibold text-gray-900">{completedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Reference:</span>
              <span className="font-mono text-gray-700">{completedOrder.paymentReference}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-700">Total Charged:</span>
              <span className="font-bold text-base text-[#b12704]">
                {formatPrice(completedOrder.totalUSD, currency, exchangeRate)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => generateInvoicePDF(completedOrder, currency, exchangeRate)}
              className="w-full sm:w-auto bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-2.5 px-6 rounded-full text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Commercial Tax Invoice (PDF)</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-6 rounded-full text-xs border border-gray-300 transition-colors"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaeded] py-6 text-gray-900">
      {/* Top Simple Checkout Header */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between shadow-xs">
          <div
            onClick={onNavigateHome}
            className="flex items-center cursor-pointer"
            title="Spinel Distribution Ltd"
          >
            <img
              src={COMPANY_LOGO_URL}
              alt="Spinel Distribution Ltd"
              className="h-9 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="text-center hidden sm:block">
            <h1 className="text-lg font-bold text-gray-900">
              Checkout ({cartItems.reduce((acc, it) => acc + it.quantity, 0)} items)
            </h1>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={onNavigateCart}
          className="text-xs font-semibold text-[#007185] hover:text-[#c45500] hover:underline flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Cart
        </button>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Checkout Steps (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Shipping Address */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
                <span className="w-6 h-6 rounded-full bg-[#f08804] text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base font-bold text-gray-900">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Recipient or Procurement Lead"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="procurement@organization.com"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Organization Name"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="Suite, building number, street name"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Postal / ZIP Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
                <span className="w-6 h-6 rounded-full bg-[#f08804] text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="text-base font-bold text-gray-900">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {/* Paystack Option */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    paymentMethod === 'paystack'
                      ? 'border-[#f08804] bg-amber-50/40 ring-1 ring-[#f08804]'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_choice"
                    checked={paymentMethod === 'paystack'}
                    onChange={() => setPaymentMethod('paystack')}
                    className="mt-1 text-[#f08804] focus:ring-0"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900">
                        Paystack Live Payment Gateway
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        USD & NGN Instant Settlement
                      </span>
                    </div>
                    <p className="text-gray-500 mt-1">
                      Pay securely with International Credit/Debit Cards (Visa, Mastercard, Verve), Bank Transfer, or USSD.
                    </p>
                  </div>
                </label>

                {/* Corporate PO Option */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    paymentMethod === 'po'
                      ? 'border-[#f08804] bg-amber-50/40 ring-1 ring-[#f08804]'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_choice"
                    checked={paymentMethod === 'po'}
                    onChange={() => setPaymentMethod('po')}
                    className="mt-1 text-[#f08804] focus:ring-0"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900">
                        Corporate Purchase Order (Net 30)
                      </span>
                      <Building2 className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="text-gray-500 mt-1">
                      Generates an official Pro-Forma Tax Invoice immediately for corporate wire settlement.
                    </p>

                    {paymentMethod === 'po' && (
                      <div className="mt-3">
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Purchase Order Number (PO #):
                        </label>
                        <input
                          type="text"
                          value={poNumber}
                          onChange={(e) => setPoNumber(e.target.value)}
                          placeholder="e.g. PO-SPINEL-2026-88"
                          className="w-full sm:w-64 border border-gray-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#f08804]"
                        />
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Step 3: Items Review */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
                <span className="w-6 h-6 rounded-full bg-[#f08804] text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h2 className="text-base font-bold text-gray-900">Review Items</h2>
              </div>

              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-12 h-12 object-contain bg-gray-50 rounded border p-1"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 line-clamp-1">{item.product.name}</h4>
                        <span className="text-gray-500">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">
                      {formatPrice(item.product.priceUSD * item.quantity, currency, exchangeRate)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-5 sticky top-24">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-3 px-4 rounded-full text-xs shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Securing order...</span>
                ) : (
                  <>
                    <span>Place Your Order</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-[11px] text-gray-500 text-center">
                By placing your order, you agree to Spinel Distribution Ltd's privacy notice and commercial terms.
              </div>

              <div className="border-t border-b border-gray-200 py-4 space-y-2 text-xs">
                <h3 className="font-bold text-gray-900 mb-2">Order Summary</h3>
                <div className="flex justify-between text-gray-600">
                  <span>Items:</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(subtotalUSD, currency, exchangeRate)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping & Freight:</span>
                  <span className="font-semibold text-gray-900">
                    {shippingFeeUSD === 0 ? 'FREE' : formatPrice(shippingFeeUSD, currency, exchangeRate)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated VAT (7.5%):</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(taxUSD, currency, exchangeRate)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Order Total:</span>
                  <span className="text-[#b12704]">
                    {formatPrice(grandTotalUSD, currency, exchangeRate)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded border border-gray-200 text-[11px] text-gray-600 space-y-1">
                <p className="font-bold text-gray-800">Spinel Commercial Protection</p>
                <p>
                  Official tax invoice automatically generated upon order completion.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
