import React from 'react';
import { Star, ShoppingCart, FileText } from 'lucide-react';
import { Product, Currency } from '../types.ts';
import { formatPrice } from '../utils/currency.ts';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  exchangeRate: number;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onRequestQuote?: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  exchangeRate,
  onSelectProduct,
  onAddToCart,
  onRequestQuote
}) => {
  const hasFixedPrice =
    product.hasPrice !== false &&
    product.pricingType !== 'quote' &&
    product.priceUSD !== null &&
    product.priceUSD !== undefined &&
    product.priceUSD > 0;

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRequestQuote) {
      onRequestQuote(product, e);
    } else {
      onSelectProduct(product);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="bg-white rounded-lg p-4 border border-gray-200 hover:border-[#f08804] hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group relative"
    >
      {/* Badge Top Left */}
      {product.badge && (
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-tight shadow-xs ${
              product.badge === 'Best Seller'
                ? 'bg-[#e67a00] text-white'
                : product.badge === "Spinel's Choice"
                ? 'bg-[#232f3e] text-white'
                : 'bg-blue-700 text-white'
            }`}
          >
            {product.badge}
          </span>
        </div>
      )}

      <div>
        {/* Product Image */}
        <div className="w-full h-44 sm:h-52 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center p-3 mb-3 border border-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Brand & Subcategory */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span className="font-bold text-gray-700 uppercase tracking-wider truncate max-w-[130px]">
            {product.brand}
          </span>
          <span className="text-gray-400 truncate max-w-[120px]">{product.subCategory}</span>
        </div>

        {/* Title */}
        <h4 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#c45500] transition-colors min-h-[40px]">
          {product.name}
        </h4>

        {/* Ratings */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating || 5)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-[#007185] font-semibold hover:underline">
            {product.reviewsCount || 42}
          </span>
        </div>

        {/* Price or Quote Badge */}
        <div className="mt-3">
          {hasFixedPrice ? (
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                {formatPrice(product.priceUSD!, currency, exchangeRate)}
              </span>
              {product.originalPriceUSD && (
                <span className="text-xs text-gray-400 line-through font-normal">
                  {formatPrice(product.originalPriceUSD, currency, exchangeRate)}
                </span>
              )}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
              <FileText className="w-3.5 h-3.5" />
              <span>Quote on Request</span>
            </div>
          )}
        </div>
      </div>

      {/* Stock status & Action Button */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className={`text-xs font-bold ${product.inStock ? 'text-emerald-700' : 'text-gray-500'}`}>
          {product.inStock ? 'In Stock' : 'Order On Request'}
        </span>

        {hasFixedPrice ? (
          <button
            type="button"
            onClick={(e) => onAddToCart(product, e)}
            disabled={!product.inStock}
            className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] text-xs sm:text-sm font-bold py-1.5 px-3.5 rounded-full shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleQuoteClick}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold py-1.5 px-3.5 rounded-full shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Request Quote</span>
          </button>
        )}
      </div>
    </div>
  );
};
