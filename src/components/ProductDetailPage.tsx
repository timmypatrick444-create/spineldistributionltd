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
  Layers,
  FileText,
  Building2,
  Clock
} from 'lucide-react';
import { Product, Currency } from '../types.ts';
import { formatPrice } from '../utils/currency.ts';

export interface ProductDetailPageProps {
  product: Product | null;
  currency: Currency;
  exchangeRate: number;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onRequestQuote: (product: Product) => void;
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
  onRequestQuote,
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Product Not Selected</h2>
          <p className="text-sm sm:text-base text-gray-500 mb-6">
            Please browse our security catalog or select a hardware product to view its technical specifications.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-2.5 px-6 rounded-md shadow-xs transition-colors cursor-pointer text-sm"
          >
            ← Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  // Determine if product has explicit fixed price or is quote-based
  const hasFixedPrice =
    product.hasPrice !== false &&
    product.pricingType !== 'quote' &&
    product.priceUSD !== null &&
    product.priceUSD !== undefined &&
    product.priceUSD > 0;

  // Safe images fallback
  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.imageUrl || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80'];

  // Safe specifications fallback
  const specs: Record<string, any> = product.specifications || {
    'Category': product.category,
    'SubCategory': product.subCategory,
    'Brand': product.brand,
    'Model / SKU': product.sku,
    'Compliance': 'CE, FCC, RoHS, ISO9001 Commercial Standards'
  };

  // Safe related products
  const derivedRelated = relatedProducts.length > 0
    ? relatedProducts
    : allProducts
        .filter((p) => p.id !== product.id && p.category === product.category)
        .slice(0, 4);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Breadcrumb Navigation */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-gray-500 pb-2 border-b border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 hover:text-[#c45500] hover:underline font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Storefront
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <button
          type="button"
          onClick={() => onSelectCategory(product.category)}
          className="hover:text-[#c45500] hover:underline font-medium cursor-pointer"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold truncate max-w-[240px] sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout (3 Columns on Large Screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-5 sm:p-7 rounded-xl border border-gray-200 shadow-xs">
        {/* Left Column: Image Gallery (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square bg-gray-50 rounded-lg p-6 border border-gray-200 flex items-center justify-center overflow-hidden relative">
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#e47911] text-white text-xs font-bold px-3 py-1 rounded shadow-xs">
                {product.badge}
              </span>
            )}
            {!hasFixedPrice && (
              <span className="absolute top-4 right-4 bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded shadow-xs flex items-center gap-1">
                <FileText className="w-3 h-3" /> Quote Required
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded border p-1 shrink-0 bg-white transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-[#f08804] ring-2 ring-[#f08804]/30'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantee Box */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Spinel Certified Enterprise Hardware</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">
              Authentic hardware procured directly from accredited manufacturers. Includes official factory warranty and Spinel Distribution SLA support.
            </p>
          </div>
        </div>

        {/* Center Column: Product Specs & Details (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <span className="text-xs sm:text-sm font-semibold text-[#007185] hover:underline cursor-pointer block mb-1">
              Brand: {product.brand}
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-mono mt-1">SKU: {product.sku}</p>
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
            <span className="text-[#007185] hover:underline cursor-pointer text-xs sm:text-sm">
              {product.reviewsCount || 48} verified reviews
            </span>
          </div>

          {/* Price or Quote Required Breakdown */}
          <div className="border-b border-gray-200 pb-3 space-y-1.5">
            {hasFixedPrice ? (
              <>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">Standard Commercial Price:</div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#b12704]">
                    {formatPrice(product.priceUSD!, currency, exchangeRate)}
                  </span>
                  {currency === 'NGN' && (
                    <span className="text-xs sm:text-sm text-gray-500 font-medium">
                      (${product.priceUSD!.toFixed(2)} USD)
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Fixed pricing available for direct e-commerce checkout and immediate warehouse dispatch.
                </p>
              </>
            ) : (
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span>Price On Application / Request Quote</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  Custom Quotation Required
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  This enterprise security product requires tailored configuration, project bill-of-materials (BOM), or institutional volume pricing.
                </p>
              </div>
            )}
          </div>

          {/* About this item (bullet points) */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2.5">Key Capabilities & Features</h3>
            <ul className="space-y-2 list-disc pl-4 text-gray-700 text-xs sm:text-sm leading-relaxed">
              {product.features && product.features.length > 0 ? (
                product.features.map((feat, i) => <li key={i}>{feat}</li>)
              ) : (
                <>
                  <li>Enterprise industrial grade hardware designed for continuous 24/7 mission-critical operations.</li>
                  <li>Fully compliant with international physical security, surveillance, and networking standards.</li>
                  <li>Seamless interoperability with ONVIF Profile S/G/T, RTSP, and standard monitoring consoles.</li>
                  <li>Complete technical documentation, firmware updates, and direct manufacturer warranty support included.</li>
                </>
              )}
            </ul>
          </div>

          {/* Technical Specifications */}
          {Object.keys(specs).length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2.5">Technical Specifications</h3>
              <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 px-3.5 py-2 text-xs sm:text-sm">
                    <span className="font-semibold text-gray-600">{key}</span>
                    <span className="text-gray-900 font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Action Box (3 cols on lg) */}
        {/* Requirement: Therefore at the product details of every product, it's either they have add to cart, buy navigation OR they have request quote navigation */}
        <div className="lg:col-span-3">
          <div className="border border-gray-300 rounded-xl p-5 sm:p-6 bg-gray-50/60 space-y-4 shadow-xs sticky top-24">
            {hasFixedPrice ? (
              <>
                {/* 1. E-COMMERCE FIXED PRICE BUY BOX */}
                <div className="text-2xl sm:text-3xl font-black text-[#b12704]">
                  {formatPrice(product.priceUSD!, currency, exchangeRate)}
                </div>

                {/* In Stock & Dispatch */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm sm:text-base">
                    <CheckCircle className="w-5 h-5" />
                    <span>In Stock</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Available for immediate warehouse dispatch from Spinel Distribution logistics.
                  </p>
                </div>

                {/* Quantity Selector */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Quantity:</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#f08804] focus:outline-none cursor-pointer"
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
                  className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-3 px-4 rounded-full shadow-xs transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                {/* Buy Now button */}
                <button
                  type="button"
                  id="product-detail-buy-now"
                  onClick={() => onBuyNow(product, quantity)}
                  className="w-full bg-[#ffa41c] hover:bg-[#fa8900] text-[#0f1111] font-bold py-3 px-4 rounded-full shadow-xs transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>

                {addedNotice && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs sm:text-sm font-medium text-center animate-in fade-in">
                    ✓ Added {quantity} unit(s) to Cart!
                  </div>
                )}
              </>
            ) : (
              <>
                {/* 2. REQUEST QUOTE ACTION BOX */}
                <div className="border-b border-gray-200 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-1 rounded">
                    Institutional Hardware
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-2">
                    Request Official Quote
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Receive formal PDF quotation with volume discounts, freight options, and commercial payment terms.
                  </p>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Manufacturer Project Pricing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Quote turnaround within 2-4 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Direct B2B & Contractor Billing</span>
                  </div>
                </div>

                {/* Request Quote Button */}
                <button
                  type="button"
                  id="product-detail-request-quote-btn"
                  onClick={() => onRequestQuote(product)}
                  className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-3.5 px-4 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  <FileText className="w-5 h-5 text-[#0f1111]" />
                  <span>Request Quote for this Product</span>
                </button>

                <p className="text-[11px] sm:text-xs text-gray-500 text-center">
                  Product name & SKU will be automatically pre-populated in your quote application.
                </p>
              </>
            )}

            {/* Commercial Info & Metadata */}
            <div className="text-xs sm:text-sm text-gray-600 divide-y divide-gray-200 pt-3 border-t border-gray-200">
              <div className="py-1.5 flex justify-between">
                <span>Distributor:</span>
                <span className="font-semibold text-gray-900">Spinel Distribution Ltd</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span>Warranty:</span>
                <span className="font-semibold text-gray-900">
                  {product.warrantyYears ? `${product.warrantyYears}-Year Official Warranty` : '3-Year Official Warranty'}
                </span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span>Support:</span>
                <span className="font-semibold text-gray-900">Engineering SLA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {derivedRelated.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Related Equipment in {product.category}
            </h2>
            <button
              type="button"
              onClick={() => onSelectCategory(product.category)}
              className="text-xs sm:text-sm font-semibold text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer"
            >
              See full department →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {derivedRelated.map((rel) => {
              const relHasPrice = rel.hasPrice !== false && rel.priceUSD && rel.priceUSD > 0;
              return (
                <div
                  key={rel.id}
                  onClick={() => handleProductSelect(rel)}
                  className="bg-gray-50/70 hover:bg-white rounded-lg border border-gray-200 hover:border-[#f08804] p-3 transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-2">
                    <div className="aspect-square bg-white rounded-md p-2 flex items-center justify-center overflow-hidden border border-gray-100">
                      <img
                        src={rel.imageUrl}
                        alt={rel.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      {rel.brand}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#c45500]">
                      {rel.name}
                    </h4>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-200 flex items-center justify-between text-xs font-bold">
                    {relHasPrice ? (
                      <span className="text-[#b12704]">
                        {formatPrice(rel.priceUSD!, currency, exchangeRate)}
                      </span>
                    ) : (
                      <span className="text-blue-700 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Quote on Request
                      </span>
                    )}
                    <span className="text-gray-400 group-hover:text-[#c45500]">View →</span>
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
