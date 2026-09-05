import React from 'react';
import { X, Trash2, ShoppingCart, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem, Currency } from '../types.ts';
import { formatPrice } from '../utils/currency.ts';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: Currency;
  exchangeRate: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  exchangeRate,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const totalItemsCount = safeCartItems.reduce((acc, it) => acc + (it.quantity || 1), 0);
  const subtotalUSD = safeCartItems.reduce(
    (acc, it) => acc + (it.product?.priceUSD || 0) * (it.quantity || 1),
    0
  );
  const freeFreightThresholdUSD = 1000;
  const freeFreightUnlocked = subtotalUSD >= freeFreightThresholdUSD;
  const progressPercent = Math.min(100, Math.round((subtotalUSD / freeFreightThresholdUSD) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#f08804]" />
              <h3 className="font-bold text-gray-900 text-base">
                Shopping Cart ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-4 py-2.5 bg-amber-50/60 border-b border-amber-200/60">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-800 mb-1">
              <span>
                {freeFreightUnlocked
                  ? '🎉 Qualified for FREE International Enterprise Freight!'
                  : `Add ${formatPrice(freeFreightThresholdUSD - subtotalUSD, currency, exchangeRate)} more for FREE Freight`}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#007600] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <ShoppingCart className="w-16 h-16 text-gray-300 mb-3" />
                <p className="font-bold text-gray-700 text-base">Your Amazon Cart is empty</p>
                <p className="text-xs text-gray-500 mt-1">
                  Explore thousands of enterprise video surveillance, access control, and networking products.
                </p>
              </div>
            ) : (
              cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="py-3 flex gap-3">
                  <div className="w-20 h-20 bg-gray-50 rounded-xs p-1 border border-gray-200 shrink-0 flex items-center justify-center">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">SKU: {product.sku}</p>

                    <div className="mt-1 font-bold text-xs text-[#b12704]">
                      {product.pricingType === 'quote' || product.hasPrice === false || !product.priceUSD ? (
                        <span className="text-amber-800 text-[11px] font-semibold">Quote Required</span>
                      ) : (
                        formatPrice(product.priceUSD, currency, exchangeRate)
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-gray-300 rounded bg-white text-xs">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
                          className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 font-semibold text-gray-800">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-xs text-gray-600 font-medium">Subtotal ({totalItemsCount} items):</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(subtotalUSD, currency, exchangeRate)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-2.5 px-4 rounded-full text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-[11px] text-gray-500 hover:text-red-600 hover:underline"
                >
                  Clear all items
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
