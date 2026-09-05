import React, { useState } from 'react';
import {
  Star,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Check
} from 'lucide-react';
import { Product, Currency } from '../types.ts';
import { PRODUCT_CATEGORIES } from '../data/categories.ts';
import { ProductCard } from './ProductCard.tsx';

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  currency: Currency;
  exchangeRate: number;
  selectedCategory: string;
  selectedSubCategory: string;
  searchQuery: string;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onSelectCategory: (category: string) => void;
  onSelectSubCategory: (category: string, subCategory: string) => void;
  onClearFilters: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  currentPage: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  isLoading,
  currency,
  exchangeRate,
  selectedCategory,
  selectedSubCategory,
  searchQuery,
  onSelectProduct,
  onAddToCart,
  onSelectCategory,
  onSelectSubCategory,
  onClearFilters,
  sortBy,
  onSortChange,
  currentPage,
  hasMore,
  onPageChange
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [primeOnly, setPrimeOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);

  // Available brands derived from current category or all
  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  const filteredProducts = products.filter((p) => {
    if (selectedBrand && p.brand !== selectedBrand) return false;
    if (minRating > 0 && p.rating < minRating) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-gray-800">
      {/* Top Breadcrumb & Active Query Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3 mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <span onClick={onClearFilters} className="hover:underline cursor-pointer">
              All Security Equipment
            </span>
            {selectedCategory && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span
                  onClick={() => onSelectSubCategory(selectedCategory, '')}
                  className="hover:underline cursor-pointer font-semibold text-gray-800"
                >
                  {selectedCategory}
                </span>
              </>
            )}
            {selectedSubCategory && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#c45500] font-bold">{selectedSubCategory}</span>
              </>
            )}
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : selectedSubCategory
              ? selectedSubCategory
              : selectedCategory
              ? selectedCategory
              : 'Enterprise Security & Surveillance Catalog'}
          </h2>
          {/* Note: Total count is purposefully omitted for public clients as per user requirement:
              "The total number of products will not be displayed to the public, but will be displayed at the admin dashboard." */}
          <span className="text-[11px] text-gray-500">
            Certified enterprise equipment with verified manufacturer warranty.
          </span>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2 text-xs self-start sm:self-auto">
          <label className="text-gray-500 font-semibold whitespace-nowrap">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#f08804]"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Filter Sidebar (Amazon style) */}
        <aside className="md:col-span-3 space-y-6 text-xs text-gray-700">
          {/* Department / Category Filter */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-2">Security Department</h3>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              <div
                onClick={() => onSelectCategory('')}
                className={`cursor-pointer hover:text-[#c45500] ${!selectedCategory ? 'font-bold text-[#c45500]' : ''}`}
              >
                All Departments
              </div>
              {PRODUCT_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.name)}
                  className={`cursor-pointer hover:text-[#c45500] truncate ${selectedCategory === cat.name ? 'font-bold text-[#c45500]' : ''}`}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </div>

          {/* Subcategory Filter (if category selected) */}
          {selectedCategory && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 text-sm mb-2">Subcategory</h3>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                <div
                  onClick={() => onSelectSubCategory(selectedCategory, '')}
                  className={`cursor-pointer hover:text-[#c45500] ${!selectedSubCategory ? 'font-bold text-[#c45500]' : ''}`}
                >
                  All in {selectedCategory}
                </div>
                {(PRODUCT_CATEGORIES.find(c => c.name === selectedCategory)?.subCategories || []).map((sub, i) => (
                  <div
                    key={i}
                    onClick={() => onSelectSubCategory(selectedCategory, sub)}
                    className={`cursor-pointer hover:text-[#c45500] truncate ${selectedSubCategory === sub ? 'font-bold text-[#c45500]' : ''}`}
                  >
                    {sub}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews Rating Filter */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-bold text-gray-900 text-sm mb-2">Customer Reviews</h3>
            <div className="space-y-1.5">
              {[4, 3, 2, 1].map((stars) => (
                <div
                  key={stars}
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                  className={`flex items-center gap-1.5 cursor-pointer hover:text-[#c45500] ${minRating === stars ? 'font-bold text-[#c45500]' : ''}`}
                >
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span>& Up</span>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          {brands.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 text-sm mb-2">Enterprise Brands</h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                <div
                  onClick={() => setSelectedBrand('')}
                  className={`cursor-pointer hover:text-[#c45500] ${!selectedBrand ? 'font-bold text-[#c45500]' : ''}`}
                >
                  All Brands
                </div>
                {brands.map((b) => (
                  <div
                    key={b}
                    onClick={() => setSelectedBrand(selectedBrand === b ? '' : b)}
                    className={`cursor-pointer hover:text-[#c45500] flex items-center gap-1.5 ${selectedBrand === b ? 'font-bold text-[#c45500]' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrand === b}
                      onChange={() => {}}
                      className="rounded text-[#f08804] focus:ring-0"
                    />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reset Filters */}
          <button
            type="button"
            onClick={() => {
              setSelectedBrand('');
              setMinRating(0);
              onClearFilters();
            }}
            className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-semibold text-xs border border-gray-300"
          >
            Clear All Filters
          </button>
        </aside>

        {/* Right Main Product Grid (9 cols) */}
        <div className="md:col-span-9">
          {isLoading ? (
            <div className="py-20 text-center text-gray-500 text-xs">
              Loading security hardware catalog...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-500 space-y-3">
              <h3 className="font-bold text-gray-800 text-base">No matching products found</h3>
              <p className="text-xs">
                Try resetting your filters or searching with different keywords.
              </p>
              <button
                onClick={onClearFilters}
                className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-semibold text-xs py-2 px-6 rounded-full shadow-xs"
              >
                View All Categories
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    exchangeRate={exchangeRate}
                    onSelectProduct={onSelectProduct}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>

              {/* Pagination controls */}
              <div className="pt-6 border-t border-gray-200 flex items-center justify-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => onPageChange(currentPage - 1)}
                  className="px-4 py-2 border border-gray-300 rounded bg-white text-xs font-semibold hover:bg-gray-50 disabled:opacity-40"
                >
                  ← Previous
                </button>
                <span className="px-3 py-2 text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 rounded">
                  Page {currentPage}
                </span>
                <button
                  disabled={!hasMore}
                  onClick={() => onPageChange(currentPage + 1)}
                  className="px-4 py-2 border border-gray-300 rounded bg-white text-xs font-semibold hover:bg-gray-50 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
