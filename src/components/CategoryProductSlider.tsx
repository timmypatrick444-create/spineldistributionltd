import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { Product, Currency } from '../types.ts';
import { formatPrice } from '../utils/currency.ts';

interface CategoryProductSliderProps {
  title: string;
  subtitle?: string;
  category: string;
  products: Product[];
  currency: Currency;
  exchangeRate: number;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewAll: (category: string) => void;
}

export const CategoryProductSlider: React.FC<CategoryProductSliderProps> = ({
  title,
  subtitle,
  category,
  products,
  currency,
  exchangeRate,
  onSelectProduct,
  onAddToCart,
  onViewAll
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 600;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-xs relative">
      {/* Slider Header */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onViewAll(category)}
          className="text-xs font-semibold text-[#007185] hover:text-[#c45500] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>See all in {category}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Slider Container with Left / Right Controls */}
      <div className="relative group">
        {/* Left Scroll Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-md border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
          title="Previous products"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-52 sm:w-60 shrink-0 bg-gray-50/70 hover:bg-white rounded-lg border border-gray-200 hover:border-[#f08804] p-3 transition-all flex flex-col justify-between group/card shadow-2xs hover:shadow-xs"
            >
              {/* Clickable Card Body */}
              <div
                onClick={() => onSelectProduct(product)}
                className="cursor-pointer space-y-2"
              >
                {/* Product Image */}
                <div className="aspect-square bg-white rounded-md p-3 flex items-center justify-center overflow-hidden border border-gray-100 relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover/card:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {product.badge && (
                    <span className="absolute top-2 left-2 bg-[#e47911] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Brand & Subcategory */}
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span className="font-bold uppercase tracking-wider text-gray-600 truncate max-w-[110px]">
                    {product.brand}
                  </span>
                  <span className="text-[10px] text-gray-400 truncate max-w-[90px]">
                    {product.subCategory}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 min-h-[32px] group-hover/card:text-[#c45500] leading-snug">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 text-[11px]">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500 font-medium">({product.reviewsCount})</span>
                </div>

                {/* Price */}
                <div className="font-bold text-sm text-[#b12704] pt-0.5">
                  {formatPrice(product.priceUSD, currency, exchangeRate)}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 mt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-1.5 px-3 rounded-full text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-md border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
          title="Next products"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
