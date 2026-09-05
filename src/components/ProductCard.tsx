import React from 'react';
import { Star, ShieldCheck, Check, ShoppingCart, Zap } from 'lucide-react';
import { Product, Currency } from '../types.ts';
import { formatPrice } from '../utils/currency.ts';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  exchangeRate: number;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  exchangeRate,
  onSelectProduct,
  onAddToCart
}) => {
  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="bg-white rounded-xs p-3.5 border border-gray-200 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer group relative"
    >
      {/* Badge Top Left */}
      {product.badge && (
        <div className="absolute top-2 left-2 z-10">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-tight shadow-xs ${
              product.badge === 'Best Seller'
                ? 'bg-[#e67a00] text-white'
                : product.badge === "Spinel's Choice"
                ? 'bg-[#232f3e] text-white'
                : 'bg-emerald-700 text-white'
            }`}
          >
            {product.badge}
          </span>
        </div>
      )}

      <div>
        {/* Product Image */}
        <div className="w-full h-44 sm:h-48 bg-gray-50 rounded-xs overflow-hidden flex items-center justify-center p-2 mb-3">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Brand & Subcategory */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
          <span className="font-semibold text-gray-700 truncate">{product.brand}</span>
          <span className="text-gray-400 truncate max-w-[120px]">{product.subCategory}</span>
        </div>

        {/* Title */}
        <h4 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 leading-snug group-hover:text-[#c45500] transition-colors">
          {product.name}
        </h4>

        {/* Ratings */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-blue-700 hover:underline">
            {product.reviewsCount}
          </span>
        </div>

        {/* Price display in active currency (USD / NGN) */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            {formatPrice(product.priceUSD, currency, exchangeRate)}
          </span>

          {product.originalPriceUSD && (
            <span className="text-xs text-gray-500 line-through">
              {formatPrice(product.originalPriceUSD, currency, exchangeRate)}
            </span>
          )}
        </div>

        {/* Delivery / Prime indicator */}
        <div className="mt-1 text-[11px] text-gray-600 space-y-0.5">
          <div className="flex items-center gap-1 text-blue-900 font-semibold">
            <span className="bg-[#00a8e1] text-white text-[9px] font-black italic px-1 rounded-xs">prime</span>
            <span>Two-Day Enterprise Freight</span>
          </div>
          <p className="text-gray-500">
            {product.freeDelivery ? 'FREE International Delivery' : '+ Commercial Shipping'}
          </p>
        </div>
      </div>

      {/* Stock status & Action */}
      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
        <span className={`text-[11px] font-semibold ${product.inStock ? 'text-green-700' : 'text-red-600'}`}>
          {product.inStock ? 'In Stock' : 'Temporarily Out'}
        </span>

        <button
          type="button"
          onClick={(e) => onAddToCart(product, e)}
          disabled={!product.inStock}
          className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] text-xs font-semibold py-1.5 px-3 rounded-full shadow-xs transition-colors flex items-center gap-1 disabled:opacity-50"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};
