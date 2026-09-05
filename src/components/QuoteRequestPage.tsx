import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowLeft,
  Package,
  ShieldCheck,
  Printer,
  ChevronRight,
  Send
} from 'lucide-react';
import { Product } from '../types.ts';

interface QuoteRequestPageProps {
  initialProduct: Product | null;
  allProducts: Product[];
  onNavigate: (view: string, params?: any) => void;
  onBack: () => void;
}

export const QuoteRequestPage: React.FC<QuoteRequestPageProps> = ({
  initialProduct,
  allProducts,
  onNavigate,
  onBack
}) => {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [productName, setProductName] = useState(initialProduct?.name || '');
  const [productSku, setProductSku] = useState(initialProduct?.sku || '');
  const [quantity, setQuantity] = useState(1);

  // Client Details
  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [timeline, setTimeline] = useState('Immediate (< 2 weeks)');
  const [projectScope, setProjectScope] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRfq, setSubmittedRfq] = useState<{
    rfqNumber: string;
    date: string;
    productName: string;
    quantity: number;
    email: string;
    company: string;
  } | null>(null);

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setProductName(initialProduct.name);
      setProductSku(initialProduct.sku);
    }
  }, [initialProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedRfq = `RFQ-2026-SP-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedRfq({
        rfqNumber: generatedRfq,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        productName: productName || product?.name || 'Custom Hardware Package',
        quantity,
        email,
        company: companyName || 'Private Enterprise'
      });
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 hover:text-[#c45500] hover:underline font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Storefront
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">Request an Official Quotation (RFQ)</span>
      </nav>

      {/* SUCCESS CONFIRMATION STATE */}
      {submittedRfq ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 sm:p-10 space-y-6 text-gray-800 animate-in fade-in">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                RFQ Submitted Successfully
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                Quotation Request Reference: {submittedRfq.rfqNumber}
              </h1>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 text-xs sm:text-sm space-y-3">
            <p className="text-gray-700 leading-relaxed">
              Thank you, <strong className="text-gray-900">{contactName || submittedRfq.company}</strong>. Your institutional quotation request for <strong className="text-gray-900">{submittedRfq.productName}</strong> (Qty: {submittedRfq.quantity}) has been registered in the Spinel Distribution technical sales console.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200">
              <div>
                <span className="text-gray-500 block">Recipient Email:</span>
                <span className="font-semibold text-gray-900 font-mono">{submittedRfq.email}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Submission Date:</span>
                <span className="font-semibold text-gray-900">{submittedRfq.date}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Our technical sales engineering team will transmit the formal PDF quotation within 2 to 4 business hours.</span>
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your quote includes direct wholesale pricing, lead times, regional freight options, and commercial payment terms.</span>
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold py-2.5 px-5 rounded-md text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print RFQ Confirmation</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-2.5 px-6 rounded-md text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              Return to Catalog
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmittedRfq(null);
                setProduct(null);
                setProductName('');
                setProductSku('');
              }}
              className="text-xs sm:text-sm text-[#007185] hover:underline cursor-pointer ml-auto"
            >
              Submit Another Quote Request
            </button>
          </div>
        </div>
      ) : (
        /* MAIN QUOTE REQUEST FORM */
        <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 sm:p-8 space-y-6">
          {/* Header Banner */}
          <div className="border-b border-gray-200 pb-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 mb-2">
              <FileText className="w-3.5 h-3.5 text-blue-700" />
              <span>Spinel Institutional Procurement</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Request for Quotation (RFQ)
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
              Use this form to request official pricing, technical bill-of-materials (BOM), project volume discounts, and contractor rates for hardware without fixed price tags.
            </p>
          </div>

          {/* Pre-filled Product Card (if arriving from a specific product) */}
          {product && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded border border-amber-200 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                    {product.brand} • {product.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                    {product.name}
                  </h3>
                  <span className="text-xs font-mono text-gray-600">Model/SKU: {product.sku}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('product-detail', { product })}
                  className="text-xs font-semibold text-[#007185] hover:underline cursor-pointer"
                >
                  View Product Details
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
            {/* 1. Hardware Item Specification */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-700" />
                <span>1. Hardware Details</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">
                    Equipment / Product Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Axis Q1656-LE Box Camera or Custom Solar Inverter"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    SKU / Part Number
                  </label>
                  <input
                    type="text"
                    value={productSku}
                    onChange={(e) => setProductSku(e.target.value)}
                    placeholder="e.g. AXIS-Q1656-LE"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f08804] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Quantity Required <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Deployment Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f08804] focus:outline-none cursor-pointer"
                  >
                    <option value="Immediate (< 2 weeks)">Immediate (&lt; 2 weeks)</option>
                    <option value="1 - 2 Months">1 - 2 Months</option>
                    <option value="Project Tender / Bidding">Project Tender / Bidding</option>
                    <option value="Future Budgeting">Future Budgeting</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Delivery Destination <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f08804] focus:outline-none cursor-pointer"
                  >
                    <option value="Nigeria">Nigeria (Lagos / Abuja / Port Harcourt)</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Canada">Canada</option>
                    <option value="Other International">Other International</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Contact & Corporate Identity */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-700" />
                <span>2. Organization & Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Contact Person Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Full name & title"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Company / Organization / Agency Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company or Government Department"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Corporate Email Address <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="procurement@organization.com"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Direct Telephone / Mobile <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000 or +1 (555) 000-0000"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Scope / Notes */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Scope of Work, Project Notes, or Specific Model Revisions (Optional)
              </label>
              <textarea
                rows={3}
                value={projectScope}
                onChange={(e) => setProjectScope(e.target.value)}
                placeholder="Include power requirements, required lens focal length, server rack specifications, cable requirements, or tender submission deadlines..."
                className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f08804] focus:outline-none text-xs sm:text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-3.5 px-8 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Transmitting RFQ Details...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Official RFQ Request</span>
                  </>
                )}
              </button>

              <div className="text-xs text-gray-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Encrypted transmission to Spinel Distribution Ltd sales desk</span>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
