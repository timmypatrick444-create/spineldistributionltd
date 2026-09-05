import React, { useState } from 'react';
import {
  X,
  Lock,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building,
  ArrowRight,
  Download,
  Loader2
} from 'lucide-react';
import { CartItem, Currency, User, Order, ShippingAddress } from '../types.ts';
import { formatPrice } from '../utils/currency.ts';
import { generateInvoicePDF } from '../utils/pdfInvoice.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: Currency;
  exchangeRate: number;
  user: User | null;
  deliveryLocation: string;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  exchangeRate,
  user,
  deliveryLocation,
  onOrderSuccess
}) => {
  const [step, setStep] = useState<'address' | 'payment' | 'processing' | 'confirmed'>('address');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user ? user.name : 'Chief Security Officer',
    street: '450 Surveillance Parkway, Floor 5',
    city: 'Houston',
    state: 'TX',
    country: deliveryLocation || 'United States',
    postalCode: '77001',
    phone: '+1 (555) 892-0192'
  });

  const [customerEmail, setCustomerEmail] = useState(user ? user.email : 'security@organization.gov');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'card' | 'bank_transfer'>('paystack');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotalUSD = cartItems.reduce((acc, it) => acc + it.product.priceUSD * it.quantity, 0);
  const shippingFeeUSD = subtotalUSD > 1000 ? 0 : 49.00;
  const taxUSD = Math.round(subtotalUSD * 0.075 * 100) / 100;
  const totalUSD = Math.round((subtotalUSD + shippingFeeUSD + taxUSD) * 100) / 100;
  const totalNGN = Math.round(totalUSD * exchangeRate);

  const handlePlaceOrderWithPaystack = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Initialize Paystack Transaction via backend
      const paystackInitRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerEmail,
          amountUSD: totalUSD
        })
      });

      const paystackData = await paystackInitRes.json();
      if (!paystackInitRes.ok || !paystackData.status) {
        throw new Error(paystackData.error || 'Paystack initialization failed');
      }

      const reference = paystackData.reference;

      // 2. Submit Order to database
      const orderPayload = {
        customerName: shippingAddress.fullName,
        customerEmail,
        shippingAddress,
        items: cartItems.map(it => ({
          productId: it.product.id,
          name: it.product.name,
          sku: it.product.sku,
          priceUSD: it.product.priceUSD,
          quantity: it.quantity,
          imageUrl: it.product.imageUrl
        })),
        currency,
        paymentMethod,
        paystackReference: reference
      };

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const savedOrder: Order = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error((savedOrder as any).error || 'Failed to record order');
      }

      // 3. Verify Payment
      await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          orderId: savedOrder.id
        })
      });

      setCreatedOrder(savedOrder);
      setStep('confirmed');
      onOrderSuccess(savedOrder);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Payment processing error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200 text-gray-800">
        {/* Header */}
        <div className="bg-[#131921] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white font-sans">amazon</span>
            <span className="text-xs font-bold text-[#febd69]">.secstore</span>
            <span className="text-xs text-gray-400 ml-2 border-l border-gray-700 pl-2">
              Enterprise Secure Checkout
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Lock className="w-3.5 h-3.5 text-[#febd69]" />
            <span>256-bit SSL</span>
            <button onClick={onClose} className="ml-3 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'address' && (
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#f08804]" /> 1. Shipping & Delivery Address
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enter physical commercial premises or freight forwarder address.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Attention / Full Name</label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                    placeholder="e.g. John Doe, Head of Security"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Corporate Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                    placeholder="email@enterprise.com"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">Street Address / Facility</label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                    placeholder="Suite, building, warehouse bay"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-2 px-6 rounded-full text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#f08804]" /> 2. Select Payment Method
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Integrated with Paystack for live payments in Naira and Dollars.
                </p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 text-xs">
                {/* Paystack Option (Primary live gateway) */}
                <label className={`block p-3.5 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'paystack' ? 'border-[#f08804] bg-amber-50/50 ring-1 ring-[#f08804]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'paystack'}
                      onChange={() => setPaymentMethod('paystack')}
                      className="mt-0.5 text-[#f08804] focus:ring-[#f08804]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 flex items-center gap-2">
                          <span>Paystack Live Payment</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Recommended
                          </span>
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <span className="font-semibold text-gray-700">Cards • Bank Transfer • USSD • Apple Pay</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-1 text-[11px]">
                        Pay safely in Naira or USD. Real-time bank transfer, Visa, MasterCard, Verve, and instant verification.
                      </p>
                      <div className="mt-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded inline-block">
                        Payable: ₦{totalNGN.toLocaleString()} NGN (or ${totalUSD.toFixed(2)} USD)
                      </div>
                    </div>
                  </div>
                </label>

                {/* Credit Card Direct */}
                <label className={`block p-3.5 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-[#f08804] bg-amber-50/50 ring-1 ring-[#f08804]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-0.5 text-[#f08804] focus:ring-[#f08804]"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-gray-900">Corporate Purchasing Card</span>
                      <p className="text-gray-500 text-[11px] mt-0.5">
                        Enterprise procurement card processing via secure server.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Bank Transfer / PO */}
                <label className={`block p-3.5 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'bank_transfer' ? 'border-[#f08804] bg-amber-50/50 ring-1 ring-[#f08804]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-0.5 text-[#f08804] focus:ring-[#f08804]"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-gray-900">Wire Transfer / Purchase Order (Net 30)</span>
                      <p className="text-gray-500 text-[11px] mt-0.5">
                        Official commercial invoice generated with banking routing details.
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Order Cost Breakdown */}
              <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 text-xs space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span>Items Subtotal:</span>
                  <span>{formatPrice(subtotalUSD, currency, exchangeRate)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping & Freight:</span>
                  <span>{shippingFeeUSD === 0 ? 'FREE Enterprise Freight' : formatPrice(shippingFeeUSD, currency, exchangeRate)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Commercial VAT / Tax (7.5%):</span>
                  <span>{formatPrice(taxUSD, currency, exchangeRate)}</span>
                </div>
                <div className="h-px bg-gray-200 my-1" />
                <div className="flex justify-between font-bold text-sm text-gray-900">
                  <span>Order Total:</span>
                  <span className="text-[#b12704]">
                    {currency === 'NGN'
                      ? `₦${totalNGN.toLocaleString()} NGN`
                      : `$${totalUSD.toFixed(2)} USD`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  className="text-xs text-gray-600 hover:underline"
                >
                  ← Back to Address
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrderWithPaystack}
                  disabled={isSubmitting}
                  className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-2.5 px-8 rounded-full text-xs shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing with Paystack...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Authorize & Place Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'confirmed' && createdOrder && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900">Thank you, your order has been placed!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  We have dispatched confirmation and invoice details to{' '}
                  <span className="font-semibold text-gray-700">{createdOrder.customerEmail}</span>.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-left text-xs max-w-md mx-auto space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order Number:</span>
                  <span className="font-bold text-gray-900 font-mono">{createdOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-bold text-green-700">{createdOrder.orderStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Gateway:</span>
                  <span className="font-semibold text-gray-800">Paystack Verified</span>
                </div>
                {createdOrder.paystackReference && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transaction Ref:</span>
                    <span className="font-mono text-gray-700">{createdOrder.paystackReference}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-1 border-t">
                  <span>Grand Total:</span>
                  <span>{formatPrice(createdOrder.totalUSD, createdOrder.currency, createdOrder.exchangeRate)}</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => generateInvoicePDF(createdOrder)}
                  className="bg-[#232f3e] hover:bg-[#131921] text-white font-semibold py-2 px-5 rounded-full text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Official PDF Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-5 rounded-full text-xs shadow-xs transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
