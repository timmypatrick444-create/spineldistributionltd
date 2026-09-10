import React, { useState, useEffect } from 'react';
import {
  Shield,
  Package,
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter,
  Layers,
  DollarSign,
  TrendingUp,
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  Database,
  CreditCard,
  Building,
  Check,
  X
} from 'lucide-react';
import { AdminStats, Product, Order, BulkUploadResponse } from '../types.ts';
import { PRODUCT_CATEGORIES } from '../data/categories.ts';
import { formatPrice } from '../utils/currency.ts';
import { generateInvoicePDF } from '../utils/pdfInvoice.ts';

interface AdminDashboardProps {
  adminToken: string;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminToken,
  onLogout,
  onNavigateHome
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bulk-upload' | 'products' | 'orders' | 'settings'>('overview');

  // Stats
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Add/Edit Product Modal
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Bulk Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkUploadResponse | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Config Info
  const [config, setConfig] = useState<{ usdToNgnRate: number; paystackPublicKey: string; supabaseConfigured: boolean } | null>(null);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchProducts = async (page = 1) => {
    setProductsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '25'
      });
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`/api/admin/products?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.items || []);
        setTotalProducts(data.totalProducts || 0);
        setCurrentPage(data.page || 1);
      }
    } catch (err) {
      console.error('Failed to fetch admin products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error('Failed to fetch config:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchConfig();
  }, [adminToken]);

  useEffect(() => {
    if (activeTab === 'products') fetchProducts(1);
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab, selectedCategory]);

  // Bulk Upload File Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setUploadResult(null);
      setUploadError(null);
    }
  };

  const handleExecuteBulkUpload = async () => {
    if (!uploadFile) return;
    setIsUploading(true);
    setUploadError(null);
    setUploadResult(null);

    try {
      // Read file as Base64 string
      const reader = new FileReader();
      reader.readAsDataURL(uploadFile);

      reader.onload = async () => {
        try {
          const base64Content = reader.result as string;
          const res = await fetch('/api/admin/products/bulk-upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${adminToken}`
            },
            body: JSON.stringify({
              fileData: base64Content,
              fileName: uploadFile.name
            })
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Bulk upload failed');
          }

          setUploadResult(data);
          // Refresh stats and product catalog
          fetchStats();
          if (activeTab === 'products') fetchProducts(1);
        } catch (err: any) {
          setUploadError(err.message || 'Failed to upload spreadsheet');
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setIsUploading(false);
        setUploadError('Failed to read file from disk');
      };
    } catch (err: any) {
      setIsUploading(false);
      setUploadError(err.message || 'An unexpected error occurred during upload');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        fetchProducts(currentPage);
        fetchStats();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSavingProduct(true);

    try {
      const isEdit = Boolean(editingProduct.id);
      const url = isEdit ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(editingProduct)
      });

      if (res.ok) {
        setEditingProduct(null);
        fetchProducts(currentPage);
        fetchStats();
      }
    } catch (err) {
      console.error('Save product error:', err);
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['orderStatus']) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      if (res.ok) {
        fetchOrders();
        fetchStats();
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-gray-800 text-xs">
      {/* Top Admin Bar */}
      <header className="bg-[#131921] text-white px-6 py-3 flex items-center justify-between border-b border-gray-800 shadow-md">
        <div className="flex items-center gap-3">
          <span className="bg-amber-500/20 text-amber-300 font-bold px-3 py-1 rounded text-xs tracking-wider border border-amber-500/40">
            ADMINISTRATIVE CONSOLE
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-gray-300 hover:text-white flex items-center gap-1 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="bg-red-600/80 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </header>

      {/* Main Layout with Left Navigation */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#232f3e] text-gray-300 p-4 shrink-0 space-y-1">
          <div className="text-[11px] uppercase font-bold text-gray-400 px-3 py-2 tracking-wider">
            Admin Management
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs transition-colors ${activeTab === 'overview' ? 'bg-[#131921] text-amber-400 font-bold' : 'hover:bg-gray-700/50 text-gray-200'}`}
          >
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('bulk-upload')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs transition-colors ${activeTab === 'bulk-upload' ? 'bg-[#131921] text-amber-400 font-bold' : 'hover:bg-gray-700/50 text-gray-200'}`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Bulk Excel Upload</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs transition-colors ${activeTab === 'products' ? 'bg-[#131921] text-amber-400 font-bold' : 'hover:bg-gray-700/50 text-gray-200'}`}
          >
            <Package className="w-4 h-4 text-blue-400" />
            <span>Products Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs transition-colors ${activeTab === 'orders' ? 'bg-[#131921] text-amber-400 font-bold' : 'hover:bg-gray-700/50 text-gray-200'}`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Customer Orders</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs transition-colors ${activeTab === 'settings' ? 'bg-[#131921] text-amber-400 font-bold' : 'hover:bg-gray-700/50 text-gray-200'}`}
          >
            <Database className="w-4 h-4 text-gray-400" />
            <span>Supabase & Paystack Config</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Enterprise Dashboard Overview</h2>
                  <p className="text-xs text-gray-500">
                    Real-time metrics, warehouse inventory and transaction volumes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchStats}
                  className="bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>

              {/* STATS METRIC CARDS */}
              {/* Requirement: "The total number of products will not be displayed to the public, but will be displayed at the admin dashboard." */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Products (Exclusive to Admin Dashboard) */}
                <div className="bg-white p-5 rounded-lg border border-amber-300 shadow-xs relative overflow-hidden bg-gradient-to-br from-amber-50/50 to-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-amber-900 uppercase tracking-wider">
                      Total Products (Admin Only)
                    </span>
                    <Package className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-3xl font-black text-gray-900 font-mono">
                    {stats?.totalProducts.toLocaleString() || 0}
                  </div>
                  <p className="text-[11px] text-amber-800 font-medium mt-1">
                    Hidden from public clients • Displayed exclusively here
                  </p>
                </div>

                {/* Categories & Subcategories */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-gray-600 uppercase tracking-wider">
                      Categories Hierarchy
                    </span>
                    <Layers className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-black text-gray-900 font-mono">
                    {stats?.totalCategories || 16}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Across {stats?.totalSubCategories || 110} exact sub-categories
                  </p>
                </div>

                {/* Total Revenue USD */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-gray-600 uppercase tracking-wider">
                      Total Revenue (USD)
                    </span>
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-black text-emerald-800 font-mono">
                    ${stats?.totalRevenueUSD.toLocaleString() || '0.00'}
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    ₦{stats?.totalRevenueNGN.toLocaleString() || '0'} NGN via Paystack
                  </p>
                </div>

                {/* Customer Orders */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-gray-600 uppercase tracking-wider">
                      Total Orders
                    </span>
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-3xl font-black text-gray-900 font-mono">
                    {stats?.totalOrders || 0}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {stats?.pendingOrdersCount || 0} pending processing
                  </p>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Quick Bulk Excel Upload
                  </h3>
                  <p className="text-xs text-gray-600 mb-4">
                    Instantly import thousands of products across any of the 16 security and surveillance categories.
                  </p>
                  <button
                    onClick={() => setActiveTab('bulk-upload')}
                    className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-2 px-4 rounded text-xs shadow-xs"
                  >
                    Open Bulk Upload Tool →
                  </button>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" /> Paystack & Exchange Rate
                  </h3>
                  <p className="text-xs text-gray-600 mb-4">
                    Active rate: <strong className="text-gray-900">1 USD = ₦{config?.usdToNgnRate.toLocaleString() || '1,550'}</strong>.
                    Payments are securely settled via Paystack in Naira and Dollars.
                  </p>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded text-xs border border-gray-300"
                  >
                    View Integration Status →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. BULK EXCEL UPLOAD TAB */}
          {/* User requirement: "I want to be able to easily upload bulk products to each categories of products using an excel file that contains all products details. I want to be able perform the bulk product upload operation of thousands of products" */}
          {activeTab === 'bulk-upload' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Bulk Product Upload Operation</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Upload an Excel spreadsheet (.xlsx, .xls, .csv) containing product details to batch-insert thousands of products into the catalog.
                </p>
              </div>

              {/* Download Template Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-700" /> Official Excel Upload Template with Quote Support
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    Download formatted template supporting both <strong>Fixed-Price products</strong> (checkout flow) and <strong>Unpriced/Quote products</strong> (Request Quote flow).
                  </p>
                </div>

                <a
                  href="/api/admin/products/template"
                  download="Spinel_Bulk_Products_Template.xlsx"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded text-xs flex items-center gap-2 shrink-0 transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .XLSX Template</span>
                </a>
              </div>

              {/* Upload Drop Zone */}
              <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#f08804] transition-colors text-center">
                <input
                  type="file"
                  id="bulk-file-input"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <label htmlFor="bulk-file-input" className="cursor-pointer block">
                  <UploadCloud className="w-12 h-12 text-[#f08804] mx-auto mb-2" />
                  <span className="text-sm font-bold text-gray-900 block">
                    {uploadFile ? uploadFile.name : 'Click to select Excel file (.xlsx / .csv) or drag & drop'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1 block">
                    Supports large batches with thousands of rows across all 16 categories
                  </span>
                </label>

                {uploadFile && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-4">
                    <span className="text-xs text-gray-600 font-semibold">
                      Selected: {uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)
                    </span>

                    <button
                      type="button"
                      onClick={handleExecuteBulkUpload}
                      disabled={isUploading}
                      className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-2 px-6 rounded-full text-xs shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing Rows with XLSX Engine...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          <span>Start Bulk Upload</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Success Result Box */}
              {uploadResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-5 text-xs text-green-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-green-800">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>{uploadResult.message}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-green-200 font-medium">
                    <div>
                      <span className="text-gray-500 block">Uploaded Products:</span>
                      <span className="text-lg font-bold text-green-700">{uploadResult.uploadedCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Failed / Skipped:</span>
                      <span className="text-lg font-bold text-amber-700">{uploadResult.failedCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Total Catalog Size:</span>
                      <span className="text-lg font-bold text-gray-900">{uploadResult.totalCatalogSize}</span>
                    </div>
                  </div>

                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-green-200">
                      <span className="font-bold text-amber-900 block mb-1">Row Notices:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800 max-h-32 overflow-y-auto">
                        {uploadResult.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Error Box */}
              {uploadError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Expected Excel Columns Reference */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs text-xs space-y-3">
                <h4 className="font-bold text-gray-900 text-sm">Supported Excel Header Columns</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    <strong className="block text-gray-800">Name *</strong>
                    <span className="text-[11px] text-gray-500">Product title/name</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border">
                    <strong className="block text-gray-800">Category *</strong>
                    <span className="text-[11px] text-gray-500">One of the 16 categories</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border">
                    <strong className="block text-gray-800">SubCategory</strong>
                    <span className="text-[11px] text-gray-500">Specific subcategory</span>
                  </div>
                  <div className="p-2 bg-amber-50 rounded border border-amber-200">
                    <strong className="block text-amber-900">HasPrice</strong>
                    <span className="text-[11px] text-amber-700">"Yes" (checkout) or "No" (quote)</span>
                  </div>
                  <div className="p-2 bg-amber-50 rounded border border-amber-200">
                    <strong className="block text-amber-900">PricingType</strong>
                    <span className="text-[11px] text-amber-700">"fixed" or "quote"</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border">
                    <strong className="block text-gray-800">PriceUSD</strong>
                    <span className="text-[11px] text-gray-500">USD price (leave blank if quote)</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border">
                    <strong className="block text-gray-800">StockQuantity</strong>
                    <span className="text-[11px] text-gray-500">Inventory units available</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border">
                    <strong className="block text-gray-800">SKU</strong>
                    <span className="text-[11px] text-gray-500">Unique model number</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border">
                    <strong className="block text-gray-800">Brand</strong>
                    <span className="text-[11px] text-gray-500">Manufacturer/brand</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border">
                    <strong className="block text-gray-800">Features</strong>
                    <span className="text-[11px] text-gray-500">Semicolon separated list</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border">
                    <strong className="block text-gray-800">ImageUrl</strong>
                    <span className="text-[11px] text-gray-500">Public photo URL</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. PRODUCTS CATALOG TAB */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Products Catalog ({totalProducts} Items)</h2>
                  <p className="text-xs text-gray-500">
                    Manage inventory levels, prices, categories and add single or bulk products.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('bulk-upload')}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-1.5 px-3 rounded flex items-center gap-1 text-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" /> Bulk Excel Upload
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingProduct({})}
                    className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-1.5 px-3 rounded flex items-center gap-1 text-xs shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Single Product
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search by SKU, Name, Brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchProducts(1)}
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white border border-gray-300 rounded px-3 py-1.5 text-xs font-semibold focus:outline-none max-w-xs truncate"
                >
                  <option value="">All 16 Categories</option>
                  {PRODUCT_CATEGORIES.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => fetchProducts(1)}
                  className="bg-gray-800 text-white px-4 py-1.5 rounded font-semibold text-xs hover:bg-black"
                >
                  Filter
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase text-[10px]">
                      <th className="p-3">Product</th>
                      <th className="p-3">Category / Sub</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Price (USD)</th>
                      <th className="p-3">Stock Qty</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {productsLoading ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-500">
                          Loading products from database...
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-500">
                          No products found matching filters.
                        </td>
                      </tr>
                    ) : (
                      products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="p-3 flex items-center gap-3 max-w-xs">
                            <div className="w-10 h-10 bg-gray-50 rounded border p-0.5 shrink-0 flex items-center justify-center">
                              <img src={prod.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-gray-900 truncate block">{prod.name}</span>
                              <span className="text-[10px] text-gray-400">{prod.brand}</span>
                            </div>
                          </td>
                          <td className="p-3 max-w-[180px]">
                            <span className="font-semibold text-gray-800 truncate block">{prod.category}</span>
                            <span className="text-[10px] text-gray-500 truncate block">{prod.subCategory}</span>
                          </td>
                          <td className="p-3 font-mono text-gray-600">{prod.sku}</td>
                          <td className="p-3 font-bold text-gray-900">${prod.priceUSD.toFixed(2)}</td>
                          <td className="p-3 font-semibold">{prod.stockQuantity}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${prod.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {prod.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setEditingProduct(prod)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between py-2 text-xs">
                <span className="text-gray-500">
                  Showing page {currentPage} of {Math.ceil(totalProducts / 25) || 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => fetchProducts(currentPage - 1)}
                    className="p-1.5 border rounded bg-white hover:bg-gray-50 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentPage * 25 >= totalProducts}
                    onClick={() => fetchProducts(currentPage + 1)}
                    className="p-1.5 border rounded bg-white hover:bg-gray-50 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. CUSTOMER ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Customer Orders & Fulfillment</h2>
                  <p className="text-xs text-gray-500">
                    Track pending and completed shipments, Paystack payment references, and download official invoices.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchOrders}
                  className="bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
                </button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase text-[10px]">
                      <th className="p-3">Order #</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Total (USD / NGN)</th>
                      <th className="p-3">Paystack Ref</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ordersLoading ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-500">
                          Loading orders...
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-500">
                          No customer orders placed yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="p-3 font-mono font-bold text-gray-900">{ord.orderNumber}</td>
                          <td className="p-3">
                            <span className="font-semibold text-gray-800 block">{ord.customerName}</span>
                            <span className="text-[10px] text-gray-500 truncate block">{ord.customerEmail}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-gray-700">{ord.items.length} items</span>
                          </td>
                          <td className="p-3 font-bold text-gray-900">
                            ${ord.totalUSD.toFixed(2)}
                            <span className="block text-[10px] text-gray-500 font-normal">
                              ₦{ord.totalNGN.toLocaleString()} NGN
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[10px] text-gray-600">
                            {ord.paystackReference || 'Direct'}
                          </td>
                          <td className="p-3">
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs font-semibold focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => generateInvoicePDF(ord)}
                              className="text-[#007185] hover:text-[#c45500] hover:underline font-semibold flex items-center gap-1 justify-end"
                            >
                              <Download className="w-3 h-3" />
                              <span>PDF</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. SETTINGS / SUPABASE / PAYSTACK STATUS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">System Integration & Environment</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Status of Supabase cloud database, Paystack live payment gateway, and dynamic server exchange rates.
                </p>
              </div>

              {/* Supabase Status */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600" /> Supabase Database & Auth Storage
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${config?.supabaseConfigured ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {config?.supabaseConfigured ? 'Cloud Connected' : 'Resilient Persistent Storage'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {config?.supabaseConfigured
                    ? 'Connected to your Supabase PostgreSQL cluster for live cloud data persistence.'
                    : 'Running with resilient persistent storage and automatic synchronization to Supabase when SUPABASE_URL and keys are supplied in environment variables.'}
                </p>
                <div className="text-[11px] font-mono text-gray-500 bg-gray-50 p-2 rounded border">
                  Environment variables: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
                </div>
              </div>

              {/* Paystack Payment Status */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" /> Paystack Live Gateway
                  </h3>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    Active
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Accepts live payments in Naira and Dollars via Debit/Credit Cards, Bank Transfer, USSD, and Apple Pay.
                </p>
                <div className="text-[11px] font-mono text-gray-500 bg-gray-50 p-2 rounded border">
                  Environment variables: PAYSTACK_SECRET_KEY, PAYSTACK_PUBLIC_KEY
                </div>
              </div>

              {/* Exchange Rate Status */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs space-y-2">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" /> Live Currency Exchange Rate
                </h3>
                <p className="text-xs text-gray-600">
                  Current rate applied across the entire catalog and checkout:
                  <strong className="text-gray-900 ml-1">1 USD = ₦{config?.usdToNgnRate.toLocaleString() || '1,550'} NGN</strong>.
                </p>
                <div className="text-[11px] font-mono text-gray-500 bg-gray-50 p-2 rounded border">
                  Environment variable: USD_TO_NGN_RATE (parsed dynamically on the server)
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 text-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold">
                {editingProduct.id ? 'Edit Product' : 'Add New Product to Catalog'}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Product Title / Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full border rounded px-3 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Category *</label>
                  <select
                    value={editingProduct.category || PRODUCT_CATEGORIES[0].name}
                    onChange={(e) => {
                      const cat = PRODUCT_CATEGORIES.find(c => c.name === e.target.value);
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value,
                        subCategory: cat ? cat.subCategories[0] : ''
                      });
                    }}
                    className="w-full border rounded px-3 py-1.5"
                  >
                    {PRODUCT_CATEGORIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Sub-Category *</label>
                  <select
                    value={editingProduct.subCategory || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subCategory: e.target.value })}
                    className="w-full border rounded px-3 py-1.5"
                  >
                    {(PRODUCT_CATEGORIES.find(c => c.name === (editingProduct.category || PRODUCT_CATEGORIES[0].name))?.subCategories || []).map((sub, i) => (
                      <option key={i} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Pricing Model *</label>
                  <select
                    value={editingProduct.hasPrice === false || editingProduct.pricingType === 'quote' ? 'quote' : 'fixed'}
                    onChange={(e) => {
                      const isQuote = e.target.value === 'quote';
                      setEditingProduct({
                        ...editingProduct,
                        hasPrice: !isQuote,
                        pricingType: isQuote ? 'quote' : 'fixed',
                        priceUSD: isQuote ? null : (editingProduct.priceUSD || 100)
                      });
                    }}
                    className="w-full border rounded px-3 py-1.5 bg-white font-semibold"
                  >
                    <option value="fixed">Fixed Price (Direct Checkout & Cart)</option>
                    <option value="quote">Quote-Based (Request Quote Button)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">
                    Price (USD) {editingProduct.pricingType === 'quote' || editingProduct.hasPrice === false ? '(Disabled for Quote)' : '*'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={editingProduct.pricingType === 'quote' || editingProduct.hasPrice === false}
                    required={!(editingProduct.pricingType === 'quote' || editingProduct.hasPrice === false)}
                    placeholder={editingProduct.pricingType === 'quote' || editingProduct.hasPrice === false ? 'Quote Required' : '0.00'}
                    value={editingProduct.priceUSD ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceUSD: Number(e.target.value) })}
                    className="w-full border rounded px-3 py-1.5 disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stockQuantity ?? 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })}
                    className="w-full border rounded px-3 py-1.5"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">SKU / Model Number</label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full border rounded px-3 py-1.5"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Brand / Manufacturer</label>
                  <input
                    type="text"
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full border rounded px-3 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingProduct.imageUrl || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border rounded px-3 py-1.5"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full border rounded px-3 py-1.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-1.5 border rounded hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-5 py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] rounded font-bold shadow-xs disabled:opacity-50"
                >
                  {isSavingProduct ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
