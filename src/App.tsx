import React, { useState, useEffect } from 'react';
import {
  Shield,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle,
  Zap,
  TrendingUp,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Product, Currency, User, CartItem, Order } from './types.ts';
import { PRODUCT_CATEGORIES } from './data/categories.ts';
import { Header } from './components/Header.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { QuadCard, QuadItem } from './components/QuadCard.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { ProductList } from './components/ProductList.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { CartModal } from './components/CartModal.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrdersView } from './components/OrdersView.tsx';
import { AdminLogin } from './components/AdminLogin.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { CategoryDrawer } from './components/CategoryDrawer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
  // Navigation & Routing State
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'orders' | 'admin' | 'admin-dashboard'>('home');

  // Currency & Server Settings
  // User requirement: "Default price are in dollars but create a 1-dropdown for Naira and Dollar"
  const [currency, setCurrency] = useState<Currency>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(1550);
  const [deliveryLocation, setDeliveryLocation] = useState<string>('United States');

  // Products Data
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Cart & Orders State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('secstore_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // User & Admin State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('secstore_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('secstore_admin_token');
  });

  // Drawers & Modals
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Handle browser URL synchronization on load and popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setCurrentView('admin');
      } else if (path === '/admin/dashboard') {
        const token = localStorage.getItem('secstore_admin_token');
        if (token) {
          setAdminToken(token);
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('admin');
        }
      } else {
        setCurrentView('home');
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('secstore_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch Server Configuration (USD to NGN Exchange rate & Paystack info)
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          if (data.usdToNgnRate) {
            setExchangeRate(data.usdToNgnRate);
          }
        }
      } catch (err) {
        console.error('Failed to load server config:', err);
      }
    };
    loadConfig();
  }, []);

  // Fetch initial featured products
  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await fetch('/api/products?limit=12&badge=Best Seller');
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.items || []);
        }
      } catch (err) {
        console.error('Failed to load featured products:', err);
      }
    };
    loadFeatured();
  }, []);

  // Fetch catalog products whenever query/filters change
  const fetchCatalogProducts = async (page = 1) => {
    setCatalogLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '24',
        sort: sortBy
      });

      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedSubCategory) params.append('subCategory', selectedSubCategory);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCatalogProducts(data.items || []);
        setCurrentPage(data.page || 1);
        setHasMore(data.hasMore ?? true);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setCatalogLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === 'catalog') {
      fetchCatalogProducts(1);
    }
  }, [currentView, selectedCategory, selectedSubCategory, searchQuery, sortBy]);

  // Navigation router helper
  const navigateTo = (view: 'home' | 'catalog' | 'orders' | 'admin' | 'admin-dashboard', params?: any) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else if (view === 'admin-dashboard') {
      window.history.pushState(null, '', '/admin/dashboard');
    } else {
      window.history.pushState(null, '', '/');
    }

    if (params?.category !== undefined) {
      setSelectedCategory(params.category);
      setSelectedSubCategory(params.subCategory || '');
    }
    if (params?.search !== undefined) {
      setSearchQuery(params.search);
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantityOrEvent?: any) => {
    const qty = typeof quantityOrEvent === 'number' ? quantityOrEvent : 1;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((it) => (it.product.id === productId ? { ...it, quantity } : it))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((it) => it.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleBuyNow = (product: Product, quantity: number) => {
    handleAddToCart(product, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Search execution
  const handleExecuteSearch = (query: string, category: string) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    setSelectedSubCategory('');
    navigateTo('catalog');
  };

  // Quad Cards Datasets for Amazon Homepage
  const QUAD_1_ITEMS: QuadItem[] = [
    {
      title: '4K Starlight PTZ Cameras',
      subCategory: 'PTZ Cameras',
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Thermal Perimeter Detection',
      subCategory: 'Thermal Cameras',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Enterprise AI NVR Recorders',
      subCategory: 'Network Video Recorders (NVR)',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Solar Autonomous PTZ Poles',
      subCategory: 'Solar-Powered Cameras',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const QUAD_2_ITEMS: QuadItem[] = [
    {
      title: 'Contactless Facial Recognition',
      subCategory: 'Biometric Readers (Fingerprint, Facial, Iris)',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'RFID Smart Badge Scanners',
      subCategory: 'RFID/Smart Card Readers',
      image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'OSDP 2.2 Encrypted Controllers',
      subCategory: 'Access Control Panels & Controllers',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: '1,200 Lbs Maglocks & Strikes',
      subCategory: 'Magnetic Locks (Maglocks)',
      image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const QUAD_3_ITEMS: QuadItem[] = [
    {
      title: '48-Port Managed PoE+ Switches',
      subCategory: 'PoE Network Switches (Managed & Unmanaged)',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Long-Range Wireless Backhauls',
      subCategory: 'Wireless Access Points & Bridges',
      image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Industrial SFP+ Fiber Optics',
      subCategory: 'Fiber Optic Transceivers & Media Converters',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Direct Burial Shielded Cat6A',
      subCategory: 'Network Cables (Cat6, Cat6a, Cat7, Fiber)',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const QUAD_4_ITEMS: QuadItem[] = [
    {
      title: '12kW 3-Phase Hybrid Inverters',
      subCategory: 'Inverters (Pure Sine Wave & Hybrid)',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: '10kWh LiFePO4 Battery Racks',
      subCategory: 'Solar Batteries (Lithium LiFePO4 & Gel)',
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: '550W Tier-1 Monocrystalline Panels',
      subCategory: 'Solar Panels (Monocrystalline & Polycrystalline)',
      image: 'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'MPPT Smart Charge Controllers',
      subCategory: 'Inverters (Pure Sine Wave & Hybrid)',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#eaeded] font-sans antialiased text-gray-900">
      {/* Primary Amazon Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={navigateTo}
        currency={currency}
        onCurrencyChange={setCurrency}
        exchangeRate={exchangeRate}
        cartItems={cartItems}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          setUser(null);
          localStorage.removeItem('secstore_user');
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCategoriesDrawer={() => setIsCategoryDrawerOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExecuteSearch={handleExecuteSearch}
        deliveryLocation={deliveryLocation}
        onChangeLocation={setDeliveryLocation}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <div className="space-y-6">
            {/* Amazon Rotating Hero Banner */}
            <HeroBanner
              onExploreCategory={(cat) => {
                setSelectedCategory(cat);
                setSelectedSubCategory('');
                navigateTo('catalog');
              }}
            />

            {/* Amazon 4-Quad Card Grid Overlapping Hero */}
            <div className="max-w-7xl mx-auto px-4 -mt-24 sm:-mt-32 md:-mt-44 relative z-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <QuadCard
                  title="Video Surveillance Essentials"
                  items={QUAD_1_ITEMS}
                  category="Video Surveillance & Cameras"
                  onExplore={(cat, sub) => {
                    setSelectedCategory(cat);
                    setSelectedSubCategory(sub || '');
                    navigateTo('catalog');
                  }}
                />

                <QuadCard
                  title="Biometric Access & Control"
                  items={QUAD_2_ITEMS}
                  category="Access Control & Door Security"
                  onExplore={(cat, sub) => {
                    setSelectedCategory(cat);
                    setSelectedSubCategory(sub || '');
                    navigateTo('catalog');
                  }}
                />

                <QuadCard
                  title="Enterprise Network & PoE"
                  items={QUAD_3_ITEMS}
                  category="Networking & Connectivity"
                  onExplore={(cat, sub) => {
                    setSelectedCategory(cat);
                    setSelectedSubCategory(sub || '');
                    navigateTo('catalog');
                  }}
                />

                <QuadCard
                  title="Renewable Power & Inverters"
                  items={QUAD_4_ITEMS}
                  category="Renewable Energy"
                  onExplore={(cat, sub) => {
                    setSelectedCategory(cat);
                    setSelectedSubCategory(sub || '');
                    navigateTo('catalog');
                  }}
                />
              </div>
            </div>

            {/* Featured Best Sellers & Deals Carousel */}
            <div className="max-w-7xl mx-auto px-4 pt-4">
              <div className="bg-white p-5 rounded-xs border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">
                      Best Sellers in Enterprise Physical Security
                    </h3>
                    <p className="text-xs text-gray-500">
                      Top deployed industrial surveillance and biometric hardware.
                    </p>
                  </div>
                  <button
                    onClick={() => navigateTo('catalog')}
                    className="text-xs font-semibold text-[#007185] hover:text-[#c45500] hover:underline"
                  >
                    Explore all security systems →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {featuredProducts.slice(0, 8).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currency={currency}
                      exchangeRate={exchangeRate}
                      onSelectProduct={setSelectedProduct}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 16 Category Quick Directory Strip */}
            <div className="max-w-7xl mx-auto px-4">
              <div className="bg-white p-6 rounded-xs border border-gray-200 shadow-xs">
                <h3 className="font-bold text-base text-gray-900 mb-3">
                  Shop By Specialized Department
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 text-center text-xs">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setSelectedSubCategory('');
                        navigateTo('catalog');
                      }}
                      className="p-3 bg-gray-50 hover:bg-amber-50/60 rounded border border-gray-200 hover:border-[#f08804] cursor-pointer transition-all flex flex-col items-center justify-center group"
                    >
                      <span className="font-semibold text-gray-800 group-hover:text-[#c45500] line-clamp-2">
                        {cat.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enterprise Trust Badges Banner */}
            <div className="max-w-7xl mx-auto px-4 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="bg-white p-4 rounded border border-gray-200 flex items-center gap-3">
                  <Truck className="w-8 h-8 text-[#f08804] shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900">Worldwide Air Freight</h4>
                    <p className="text-gray-500">Expedited container shipping & insured delivery</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded border border-gray-200 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900">Paystack Live Protection</h4>
                    <p className="text-gray-500">Dual currency (USD & NGN) with instant settlement</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded border border-gray-200 flex items-center gap-3">
                  <RotateCcw className="w-8 h-8 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900">30-Day Hassle-Free Returns</h4>
                    <p className="text-gray-500">Official PDF invoices for every commercial order</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded border border-gray-200 flex items-center gap-3">
                  <Headphones className="w-8 h-8 text-purple-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900">24/7 Security Escalation</h4>
                    <p className="text-gray-500">Direct engineering consultation and RMA claims</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: CATALOG / SEARCH RESULTS */}
        {currentView === 'catalog' && (
          <ProductList
            products={catalogProducts}
            isLoading={catalogLoading}
            currency={currency}
            exchangeRate={exchangeRate}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            searchQuery={searchQuery}
            onSelectProduct={setSelectedProduct}
            onAddToCart={handleAddToCart}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setSelectedSubCategory('');
            }}
            onSelectSubCategory={(cat, sub) => {
              setSelectedCategory(cat);
              setSelectedSubCategory(sub);
            }}
            onClearFilters={() => {
              setSelectedCategory('');
              setSelectedSubCategory('');
              setSearchQuery('');
            }}
            sortBy={sortBy}
            onSortChange={setSortBy}
            currentPage={currentPage}
            hasMore={hasMore}
            onPageChange={(page) => fetchCatalogProducts(page)}
          />
        )}

        {/* VIEW 3: ORDERS & PDF INVOICE DOWNLOADS */}
        {currentView === 'orders' && (
          <OrdersView
            user={user}
            currency={currency}
            exchangeRate={exchangeRate}
            onNavigateHome={() => navigateTo('home')}
            onSelectProductById={async (id) => {
              try {
                const res = await fetch(`/api/products/${id}`);
                if (res.ok) {
                  const prod = await res.json();
                  setSelectedProduct(prod);
                }
              } catch (err) {
                console.error('Failed to load product:', err);
              }
            }}
          />
        )}

        {/* VIEW 4: ADMIN LOGIN */}
        {/* User requirement: "The admin login will be at the "/admin" of the URL then after imputing the correct credentials, it will navigate to the "/admin/dashboard" of the URL" */}
        {currentView === 'admin' && (
          <AdminLogin
            onLoginSuccess={(token) => {
              setAdminToken(token);
              navigateTo('admin-dashboard');
            }}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {/* VIEW 5: ADMIN DASHBOARD */}
        {/* User requirement: "The total number of products will not be displayed to the public, but will be displayed at the admin dashboard." */}
        {currentView === 'admin-dashboard' && (
          <AdminDashboard
            adminToken={adminToken || ''}
            onLogout={() => {
              setAdminToken(null);
              localStorage.removeItem('secstore_admin_token');
              navigateTo('admin');
            }}
            onNavigateHome={() => navigateTo('home')}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          currency={currency}
          exchangeRate={exchangeRate}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSelectedSubCategory('');
            navigateTo('catalog');
          }}
        />
      )}

      {/* Cart Slide-Over Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currency={currency}
        exchangeRate={exchangeRate}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal (Paystack Live Gateway) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        currency={currency}
        exchangeRate={exchangeRate}
        user={user}
        deliveryLocation={deliveryLocation}
        onOrderSuccess={(order) => {
          handleClearCart();
        }}
      />

      {/* Categories Slide-Over Drawer (Amazon "All" Menu) */}
      <CategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        onSelectSubCategory={(cat, sub) => {
          setSelectedCategory(cat);
          setSelectedSubCategory(sub);
          navigateTo('catalog');
        }}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onNavigateAdmin={() => navigateTo('admin')}
      />

      {/* Customer Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(authUser, token) => {
          setUser(authUser);
          localStorage.setItem('secstore_user', JSON.stringify(authUser));
          localStorage.setItem('secstore_token', token);
        }}
        onNavigateAdmin={() => navigateTo('admin')}
      />

      {/* Amazon Multi-Column Footer */}
      {currentView !== 'admin-dashboard' && (
        <Footer
          currency={currency}
          onCurrencyChange={setCurrency}
          exchangeRate={exchangeRate}
          onNavigate={navigateTo}
          deliveryLocation={deliveryLocation}
        />
      )}
    </div>
  );
}
