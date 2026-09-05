import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  ShoppingCart,
  Zap,
  Info,
  PackageCheck,
  Award,
  Layers
} from 'lucide-react';
import { Product, Currency } from '../types.ts';
import { formatPrice } from '../utils/currency.ts';

export interface ProductDetailPageProps {
  product: Product | null;
  currency: Currency;
  exchangeRate: number;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onBack: () => void;
  onSelectCategory: (cat: string) => void;
  relatedProducts?: Product[];
  allProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
  onSelectRelatedProduct?: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  currency,
  exchangeRate,
  onAddToCart,
  onBuyNow,
  onBack,
  onSelectCategory,
  relatedProducts = [],
  allProducts = [],
  onSelectProduct,
  onSelectRelatedProduct
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const handleProductSelect = onSelectProduct || onSelectRelatedProduct || (() => {});

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-xs">
          <Layers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Selected</h2>
          <p className="text-sm text-gray-500 mb-6">
            Please browse our security catalog or select a hardware product to view its technical specifications.
          </p>
          <button
            onClick={onBack}
            className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold px-6 py-2.5 rounded-md text-xs shadow-xs transition-colors"
          >
            ← Return to Catalog
          </button>
        </div>
      </div>
    );
  }

  // Safely extract gallery images
  const images = (product.galleryImages && product.galleryImages.length > 0)
    ? product.galleryImages
    : ((product as any).images && (product as any).images.length > 0)
    ? (product as any).images
    : [product.imageUrl || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80'];

  const activeImage = images[selectedImageIndex] || images[0] || product.imageUrl;

  // Safely extract specifications
  const specs = product.specifications || (product as any).specs || {};

  // Safely derive related products
  const derivedRelated = relatedProducts && relatedProducts.length > 0
    ? relatedProducts
    : allProducts.filter((p) => p.category === product.category && p.id !== product.id);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-gray-900">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 flex-wrap">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[#007185] hover:text-[#c45500] hover:underline font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </button>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span
          onClick={() => onSelectCategory(product.category)}
          className="cursor-pointer hover:underline text-[#007185]"
        >
          {product.category}
        </span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-500 font-medium truncate max-w-[200px] sm:max-w-none">
          {product.subCategory}
        </span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-800 font-semibold truncate max-w-[250px]">
          {product.name}
        </span>
      </div>

      {/* Main 3-Column Layout: Gallery | Product Info | Buy Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
        {/* Left Column: Image Gallery (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center p-4 relative group">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-[#e47911] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-xs uppercase tracking-wide">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded border p-1 shrink-0 overflow-hidden bg-white transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#e47911] ring-2 ring-[#e47911]/30'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} - view ${idx + 1}`}
                    className="w-full h-full object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs text-gray-600 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Spinel Certified Genuine Equipment</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Every unit undergoes rigorous factory verification and includes full manufacturer warranty from Spinel Distribution Ltd.
            </p>
          </div>
        </div>

        {/* Center Column: Product Specs & Details (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4 text-xs">
          <div>
            <span className="text-[11px] font-semibold text-[#007185] hover:underline cursor-pointer block mb-1">
              Brand: {product.brand}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>
            <p className="text-xs text-gray-500 font-mono mt-0.5">SKU: {product.sku}</p>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
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
            <span className="font-bold text-gray-800 text-sm">{(product.rating || 5).toFixed(1)}</span>
            <span className="text-gray-400">|</span>
            <span className="text-[#007185] hover:underline cursor-pointer">
              {product.reviewsCount || 48} verified reviews
            </span>
          </div>

          {/* Price breakdown */}
          <div className="border-b border-gray-200 pb-3 space-y-1">
            <div className="text-xs text-gray-500">List Price:</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#b12704]">
                {formatPrice(product.priceUSD, currency, exchangeRate)}
              </span>
              {currency === 'NGN' && (
                <span className="text-xs text-gray-500">
                  (${product.priceUSD.toFixed(2)} USD)
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              Commercial pricing with verified B2B and enterprise volume support.
            </p>
          </div>

          {/* About this item (bullet points) */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-2">About this item</h3>
            <ul className="space-y-1.5 list-disc pl-4 text-gray-700 leading-relaxed">
              {product.features && product.features.length > 0 ? (
                product.features.map((feat, i) => <li key={i}>{feat}</li>)
              ) : (
                <>
                  <li>Enterprise industrial grade hardware designed for continuous 24/7 mission-critical operations.</li>
                  <li>Fully compliant with international physical security, surveillance, and networking standards.</li>
                  <li>Seamless interoperability with ONVIF Profile S/G/T, RTSP, and standard monitoring consoles.</li>
                  <li>Complete technical documentation, firmware updates, and direct manufacturer support included.</li>
                </>
              )}
            </ul>
          </div>

          {/* Technical Specifications */}
          {Object.keys(specs).length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 text-sm mb-2">Technical Specifications</h3>
              <div className="bg-gray-50 rounded border border-gray-200 divide-y divide-gray-200">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 px-3 py-1.5 text-[11px]">
                    <span className="font-semibold text-gray-600">{key}</span>
                    <span className="text-gray-900">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Spinel Buy Box (3 cols on lg) */}
        <div className="lg:col-span-3">
          <div className="border border-gray-300 rounded-lg p-5 bg-gray-50/50 space-y-4 shadow-xs sticky top-24">
            <div className="text-2xl font-bold text-[#b12704]">
              {formatPrice(product.priceUSD, currency, exchangeRate)}
            </div>

            {/* In Stock & Dispatch */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>In Stock</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Available for immediate warehouse dispatch from Spinel Distribution logistics.
              </p>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#f08804] focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 10, 20, 50].map((num) => (
                  <option key={num} value={num}>
                    {num} unit{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Add to Cart button */}
            <button
              type="button"
              id="product-detail-add-to-cart"
              onClick={handleAdd}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-2.5 px-4 rounded-full shadow-xs transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            {/* Buy Now button (direct to checkout) */}
            <button
              type="button"
              id="product-detail-buy-now"
              onClick={() => onBuyNow(product, quantity)}
              className="w-full bg-[#ffa41c] hover:bg-[#fa8900] text-[#0f1111] font-bold py-2.5 px-4 rounded-full shadow-xs transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Buy Now</span>
            </button>

            {addedNotice && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-[11px] font-medium text-center animate-in fade-in">
                ✓ Added {quantity} unit(s) to Cart!
              </div>
            )}

            {/* Commercial Info & Metadata */}
            <div className="text-[11px] text-gray-500 divide-y divide-gray-200 pt-2">
              <div className="py-1 flex justify-between">
                <span>Ships from:</span>
                <span className="font-semibold text-gray-800">Spinel Distribution Ltd</span>
              </div>
              <div className="py-1 flex justify-between">
                <span>Sold by:</span>
                <span className="font-semibold text-gray-800">Spinel Distribution Ltd</span>
              </div>
              <div className="py-1 flex justify-between">
                <span>Payment:</span>
                <span className="font-semibold text-gray-800">Paystack Verified</span>
              </div>
              <div className="py-1 flex justify-between">
                <span>Warranty:</span>
                <span className="font-semibold text-gray-800">
                  {product.warrantyYears ? `${product.warrantyYears}-Year Manufacturer` : '3-Year Manufacturer'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {derivedRelated.length > 0 && (
        <div className="mt-10 bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Recommended Products in {product.category}
            </h2>
            <button
              onClick={() => onSelectCategory(product.category)}
              className="text-xs text-[#007185] hover:text-[#c45500] hover:underline font-semibold cursor-pointer"
            >
              View all in category →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {derivedRelated.slice(0, 6).map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  handleProductSelect(rel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-3 bg-gray-50 hover:bg-white rounded border border-gray-200 hover:border-[#f08804] cursor-pointer transition-all flex flex-col justify-between group shadow-2xs"
              >
                <div className="aspect-square bg-white rounded p-2 mb-2 overflow-hidden flex items-center justify-center">
                  <img
                    src={rel.imageUrl}
                    alt={rel.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="font-semibold text-xs text-gray-800 line-clamp-2 group-hover:text-[#c45500]">
                  {rel.name}
                </h4>
                <div className="mt-2 font-bold text-xs text-[#b12704]">
                  {formatPrice(rel.priceUSD, currency, exchangeRate)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
