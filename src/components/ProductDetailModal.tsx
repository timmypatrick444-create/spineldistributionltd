import React, { useState } from 'react';
import {
  Star,
  Shield,
  Truck,
  RotateCcw,
  Lock,
  Check,
  X,
  Share2,
  Heart,
  ChevronRight,
  Info,
  ShoppingCart
} from 'lucide-react';
import { Product, Currency } from '../types.ts';
import { formatPrice } from '../utils/currency.ts';

interface ProductDetailModalProps {
  product: Product;
  currency: Currency;
  exchangeRate: number;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onSelectCategory: (category: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  exchangeRate,
  onClose,
  onAddToCart,
  onBuyNow,
  onSelectCategory
}) => {
  const [selectedQty, setSelectedQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center items-start p-2 sm:p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full my-6 overflow-hidden border border-gray-200 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 p-1.5 rounded-full hover:bg-gray-100 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Top Breadcrumb */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs text-gray-600 flex items-center gap-1.5 overflow-x-auto">
          <span
            onClick={() => {
              onSelectCategory(product.category);
              onClose();
            }}
            className="hover:underline text-blue-700 cursor-pointer font-medium"
          >
            {product.category}
          </span>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">{product.subCategory}</span>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-400 truncate max-w-[200px]">{product.sku}</span>
        </div>

        {/* Main Product Layout */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full h-80 sm:h-96 bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-center relative overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-300"
              />

              {product.badge && (
                <span className="absolute top-3 left-3 bg-[#e67a00] text-white text-xs font-bold px-2 py-0.5 rounded shadow-xs uppercase">
                  {product.badge}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between w-full mt-3 text-xs text-gray-500 px-2">
              <span className="text-gray-600 font-mono">SKU: {product.sku}</span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-blue-700 hover:underline"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Middle Column: Details & Specs (4 cols) */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <div className="text-xs text-blue-700 font-semibold uppercase tracking-wider mb-1">
                Brand: {product.brand}
              </div>

              <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                {product.name}
              </h2>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2 pb-3 border-b border-gray-100">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
                <span className="text-xs text-blue-700 hover:underline cursor-pointer">
                  ({product.reviewsCount} customer ratings)
                </span>
              </div>

              {/* Price & Currency breakdown */}
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-gray-500 uppercase">Price:</span>
                  <span className="text-2xl font-bold text-[#b12704]">
                    {formatPrice(product.priceUSD, currency, exchangeRate)}
                  </span>
                  {product.originalPriceUSD && (
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(product.originalPriceUSD, currency, exchangeRate)}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {currency === 'NGN'
                      ? `Calculated from USD $${product.priceUSD.toFixed(2)} at 1 USD = ₦${exchangeRate.toLocaleString()}`
                      : `Converted to ₦${Math.round(product.priceUSD * exchangeRate).toLocaleString()} NGN via Paystack`}
                  </span>
                </div>
              </div>

              {/* Bullet Points: About this item */}
              <div className="mt-3">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  About this item
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications snippet */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="bg-gray-50 p-2 rounded border border-gray-100">
                      <span className="font-semibold text-gray-600 block text-[10px] uppercase">{key}</span>
                      <span className="text-gray-800 font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Amazon Buy Box (3 cols) */}
          <div className="md:col-span-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xl font-bold text-[#b12704] mb-1">
                  {formatPrice(product.priceUSD, currency, exchangeRate)}
                </div>

                <div className="text-xs text-gray-600 space-y-1 mt-2">
                  <div className="flex items-center gap-1.5 text-blue-900 font-semibold">
                    <span className="bg-[#00a8e1] text-white text-[9px] font-black italic px-1 rounded-xs">prime</span>
                    <span>FREE Delivery</span>
                  </div>
                  <p className="text-[11px]">
                    Fast international freight delivery guaranteed for enterprise clients.
                  </p>
                </div>

                {/* Stock Status */}
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <span className={`text-sm font-bold block ${product.inStock ? 'text-green-700' : 'text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Currently Out of Stock'}
                  </span>
                  {product.inStock && (
                    <span className="text-[11px] text-gray-500">
                      Order soon. Available in enterprise distribution hubs.
                    </span>
                  )}
                </div>

                {/* Quantity selector */}
                {product.inStock && (
                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Quantity:
                    </label>
                    <select
                      value={selectedQty}
                      onChange={(e) => setSelectedQty(Number(e.target.value))}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#f08804]"
                    >
                      {[1, 2, 3, 4, 5, 10, 20, 50].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'unit' : 'units'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Add to Cart & Buy Now Buttons */}
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(product, selectedQty);
                      onClose();
                    }}
                    disabled={!product.inStock}
                    className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-semibold py-2 px-4 rounded-full text-xs shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onBuyNow(product, selectedQty);
                      onClose();
                    }}
                    disabled={!product.inStock}
                    className="w-full bg-[#ffa41c] hover:bg-[#fa8900] text-[#0f1111] font-semibold py-2 px-4 rounded-full text-xs shadow-xs transition-colors disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-4 pt-3 border-t border-gray-200 text-[11px] text-gray-500 space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Secure transaction with Paystack</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
                  <span>Returnable within 30 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-gray-400" />
                  <span>{product.warrantyYears || 3}-Year Enterprise Hardware Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
