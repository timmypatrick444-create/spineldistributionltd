import React from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Star,
  CheckCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { CartItem, Product, Currency } from '../types.ts';
import { formatPrice } from '../utils/currency.ts';

interface CartPageProps {
  cartItems?: CartItem[];
  currency: Currency;
  exchangeRate: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onNavigateHome?: () => void;
  onNavigateCatalog?: () => void;
  onContinueShopping?: () => void;
  recommendedProducts?: Product[];
  onAddToCart?: (product: Product, e?: React.MouseEvent) => void;
  onSelectProduct?: (product: Product) => void;
  onRequestQuote?: (product: Product) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cartItems = [],
  currency,
  exchangeRate,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onNavigateHome,
  onNavigateCatalog,
  onContinueShopping,
  recommendedProducts = [],
  onAddToCart,
  onSelectProduct,
  onRequestQuote
}) => {
  const safeItems = Array.isArray(cartItems) ? cartItems : [];
  const safeRecs = Array.isArray(recommendedProducts) ? recommendedProducts : [];
  const totalCount = safeItems.reduce((acc, it) => acc + (it.quantity || 1), 0);
  const subtotalUSD = safeItems.reduce((acc, it) => {
    const unitPrice = it.product?.priceUSD || 0;
    return acc + unitPrice * (it.quantity || 1);
  }, 0);

  const handleContinueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping();
    } else if (onNavigateCatalog) {
      onNavigateCatalog();
    } else if (onNavigateHome) {
      onNavigateHome();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-gray-900">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-xs text-gray-500 mt-1">
            Certified enterprise security equipment supplied by Spinel Distribution Ltd.
          </p>
        </div>
        <button
          onClick={handleContinueShopping}
          className="text-xs font-semibold text-[#007185] hover:text-[#c45500] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
        </button>
      </div>

      {safeItems.length === 0 ? (
        /* Empty Cart State */
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-[#f08804] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Your Spinel Cart is empty</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Explore our enterprise surveillance, CCTV, biometric access control, industrial PoE, and renewable energy catalog.
          </p>
          <div className="pt-2">
            <button
              onClick={handleContinueShopping}
              className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-2.5 px-8 rounded-full text-xs shadow-xs transition-colors cursor-pointer"
            >
              Shop All Products
            </button>
          </div>
        </div>
      ) : (
        /* Active Cart Layout (Items on Left, Checkout Box on Right) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Cart Items List (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-xs font-bold text-gray-500">Items ({totalCount})</span>
              <span className="text-xs font-bold text-gray-500">Price</span>
            </div>

            <div className="divide-y divide-gray-200">
              {safeItems.map((item) => (
                <div key={item.product.id} className="py-6 flex flex-col sm:flex-row gap-5">
                  {/* Thumbnail */}
                  <div
                    onClick={() => onSelectProduct && onSelectProduct(item.product)}
                    className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded border border-gray-200 p-2 shrink-0 flex items-center justify-center cursor-pointer overflow-hidden"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-1.5">
                    <h3
                      onClick={() => onSelectProduct && onSelectProduct(item.product)}
                      className="font-bold text-sm sm:text-base text-gray-900 hover:text-[#c45500] cursor-pointer line-clamp-2"
                    >
                      {item.product.name}
                    </h3>

                    <div className="text-[11px] text-gray-500 flex items-center gap-2">
                      <span>Brand: <span className="font-semibold text-gray-700">{item.product.brand}</span></span>
                      <span>•</span>
                      <span>SKU: <span className="font-mono">{item.product.sku}</span></span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>In Stock - Ready for Dispatch</span>
                    </div>

                    <p className="text-[11px] text-gray-500">
                      Sold by: <span className="font-semibold text-gray-700">Spinel Distribution Ltd</span>
                    </p>

                    {/* Quantity & Actions */}
                    <div className="flex items-center gap-4 pt-3 flex-wrap">
                      <div className="flex items-center border border-gray-300 rounded bg-gray-50">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity > 1) {
                              onUpdateQuantity(item.product.id, item.quantity - 1);
                            } else {
                              onRemoveItem(item.product.id);
                            }
                          }}
                          className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-gray-900 min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-gray-300">|</span>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-xs text-[#007185] hover:text-[#c45500] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right sm:text-right shrink-0">
                    {item.product.pricingType === 'quote' || item.product.hasPrice === false || !item.product.priceUSD ? (
                      <div className="flex flex-col items-end">
                        <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-2.5 py-1 rounded">
                          Quote Required
                        </span>
                        <span className="text-[11px] text-gray-500 mt-1">Price upon request</span>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold text-base text-gray-900">
                          {formatPrice((item.product.priceUSD || 0) * item.quantity, currency, exchangeRate)}
                        </span>
                        {item.quantity > 1 && (
                          <div className="text-[11px] text-gray-500">
                            {formatPrice(item.product.priceUSD, currency, exchangeRate)} / each
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-red-600 hover:underline font-medium cursor-pointer"
              >
                Clear entire cart
              </button>
              <div className="text-right">
                <span className="text-xs text-gray-600">Subtotal ({totalCount} items): </span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(subtotalUSD, currency, exchangeRate)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Order Summary (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-5 sticky top-24">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Your order qualifies for Insured Air Cargo</span>
                </div>
                <div className="text-xs text-gray-500">
                  Select international freight or standard commercial delivery at checkout.
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Items total ({totalCount}):</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(subtotalUSD, currency, exchangeRate)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Estimated Tax (VAT 7.5%):</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(subtotalUSD * 0.075, currency, exchangeRate)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Order Total:</span>
                  <span className="text-[#b12704]">
                    {formatPrice(subtotalUSD * 1.075, currency, exchangeRate)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                type="button"
                id="cart-proceed-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-3 px-4 rounded-full text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 bg-gray-50 rounded border border-gray-200 text-[11px] text-gray-600 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-gray-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Spinel Secure Payment Protection</span>
                </div>
                <p>
                  Transactions processed via live Paystack payment gateway with 256-bit SSL encryption.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Products for people to buy */}
      {safeRecs.length > 0 && (
        <div className="mt-14 bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Recommended Products for Your Security System</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Popular equipment frequently bundled with products in your category.
              </p>
            </div>
            <button
              onClick={handleContinueShopping}
              className="text-xs font-semibold text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer"
            >
              See more recommendations →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {safeRecs.slice(0, 12).map((prod) => {
              const isQuoteOnly = prod.pricingType === 'quote' || prod.hasPrice === false || !prod.priceUSD;
              return (
                <div
                  key={prod.id}
                  className="bg-gray-50/70 hover:bg-white rounded border border-gray-200 hover:border-[#f08804] p-3 transition-all flex flex-col justify-between group shadow-2xs"
                >
                  <div
                    onClick={() => onSelectProduct && onSelectProduct(prod)}
                    className="cursor-pointer space-y-2"
                  >
                    <div className="aspect-square bg-white rounded p-2 overflow-hidden flex items-center justify-center">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-200"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <span className="text-[10px] uppercase font-bold text-gray-500 block truncate">
                      {prod.brand}
                    </span>

                    <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 group-hover:text-[#c45500]">
                      {prod.name}
                    </h4>

                    <div className="flex items-center text-amber-500 text-[10px]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(prod.rating || 5)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-gray-500">({prod.reviewsCount || 0})</span>
                    </div>

                    <div className="font-bold text-xs text-[#b12704]">
                      {isQuoteOnly ? (
                        <span className="text-amber-800 text-[11px] font-semibold">Quote Required</span>
                      ) : (
                        formatPrice(prod.priceUSD, currency, exchangeRate)
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-gray-100">
                    {isQuoteOnly ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onRequestQuote) {
                            onRequestQuote(prod);
                          } else if (onSelectProduct) {
                            onSelectProduct(prod);
                          }
                        }}
                        className="w-full bg-[#f08804] hover:bg-[#d97706] text-white font-bold py-1.5 px-2 rounded-full text-[11px] transition-colors shadow-2xs cursor-pointer"
                      >
                        Request Quote
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onAddToCart) onAddToCart(prod, e);
                        }}
                        className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-1.5 px-2 rounded-full text-[11px] transition-colors shadow-2xs cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
