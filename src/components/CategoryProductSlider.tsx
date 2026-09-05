import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Product, Currency } from '../types.ts';

interface CategoryProductSliderProps {
  title: string;
  categoryName: string;
  products: Product[];
  currency: Currency;
  exchangeRate: number;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewAll: (category: string) => void;
}

export const CategoryProductSlider: React.FC<CategoryProductSliderProps> = ({
  title,
  categoryName,
  products,
  onSelectProduct,
  onViewAll
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-xs space-y-3">
      {/* Category Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
        <button
          type="button"
          onClick={() => onViewAll(categoryName)}
          className="text-xs sm:text-sm font-semibold text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer"
        >
          View all {categoryName} →
        </button>
      </div>

      {/* Slider Carousel Container */}
      <div className="relative group">
        {/* Left Scroll Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-white/95 hover:bg-white text-gray-800 rounded-full shadow-md border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none cursor-pointer"
          title="Previous products"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Products Row */}
        {/* Requirement: Each product in the slides at the home page should NOT display the product price, product details, and 'add to cart' or 'request quote' button */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1"
        >
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="w-52 sm:w-60 shrink-0 bg-gray-50/70 hover:bg-white rounded-lg border border-gray-200 hover:border-[#f08804] p-3 transition-all flex flex-col justify-between group/card shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <div className="space-y-2.5">
                {/* Product Image */}
                <div className="aspect-square bg-white rounded-md p-3 flex items-center justify-center overflow-hidden border border-gray-100 relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover/card:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {product.badge && (
                    <span className="absolute top-2 left-2 bg-[#e47911] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow-2xs">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Brand & Subcategory */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-bold uppercase tracking-wider text-gray-700 truncate max-w-[120px]">
                    {product.brand}
                  </span>
                  <span className="text-[11px] text-gray-400 truncate max-w-[90px]">
                    {product.subCategory}
                  </span>
                </div>

                {/* Product Name */}
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 min-h-[36px] group-hover/card:text-[#c45500] leading-snug">
                  {product.name}
                </h3>

                {/* Star Rating */}
                <div className="flex items-center gap-1.5 text-xs">
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
                  <span className="text-gray-500 font-medium">({product.reviewsCount})</span>
                </div>
              </div>

              {/* Card Footer: Clear view prompt */}
              <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 group-hover/card:text-[#c45500]">
                <span className="font-medium">View Specifications</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-white/95 hover:bg-white text-gray-800 rounded-full shadow-md border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none cursor-pointer"
          title="Next products"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
