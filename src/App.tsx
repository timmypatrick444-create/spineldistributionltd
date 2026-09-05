import React, { useState, useEffect } from 'react';
import { Product, Currency, User, CartItem, Order } from './types.ts';
import { PRODUCT_CATEGORIES } from './data/categories.ts';
import { SEED_PRODUCTS } from './data/seedProducts.ts';
import { Header } from './components/Header.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { QuadCard, QuadItem } from './components/QuadCard.tsx';
import { ProductList } from './components/ProductList.tsx';
import { ProductDetailPage } from './components/ProductDetailPage.tsx';
import { CartPage } from './components/CartPage.tsx';
import { CheckoutPage } from './components/CheckoutPage.tsx';
import { OrdersView } from './components/OrdersView.tsx';
import { AdminLogin } from './components/AdminLogin.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { CategoryDrawer } from './components/CategoryDrawer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { Footer } from './components/Footer.tsx';
import { CategoryProductSlider } from './components/CategoryProductSlider.tsx';
import { QuoteRequestPage } from './components/QuoteRequestPage.tsx';
import { CustomerSignInPage } from './components/CustomerSignInPage.tsx';

type ViewType =
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'quote-request'
  | 'signin'
  | 'admin'
  | 'admin-dashboard';

export default function App() {
  // Navigation & Routing State
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);

  // Currency & Server Settings
  const [currency, setCurrency] = useState<Currency>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(1550);
  const [deliveryLocation, setDeliveryLocation] = useState<string>('United States');

  // Products Data
  const [allProducts, setAllProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    try {
      const savedId = localStorage.getItem('spinel_selected_product_id');
      if (savedId) {
        const match = SEED_PRODUCTS.find((p) => p.id === savedId);
        if (match) return match;
      }
    } catch {}
    return SEED_PRODUCTS[0] || null;
  });

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
      const saved = localStorage.getItem('spinel_cart') || localStorage.getItem('secstore_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User & Admin State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('spinel_user') || localStorage.getItem('secstore_user');
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
      } else if (path === '/cart') {
        setCurrentView('cart');
      } else if (path === '/checkout') {
        setCurrentView('checkout');
      } else if (path === '/orders') {
        setCurrentView('orders');
      } else if (path === '/quote' || path === '/quote-request') {
        setCurrentView('quote-request');
      } else if (path === '/signin') {
        setCurrentView('signin');
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
    localStorage.setItem('spinel_cart', JSON.stringify(cartItems));
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

  // Fetch all products on initial load
  useEffect(() => {
    const loadInitialProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=100');
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            setAllProducts(data.items);
          }
        }
      } catch (err) {
        console.error('Failed to load initial products:', err);
      }
    };
    loadInitialProducts();
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
  const navigateTo = (view: ViewType | string, params?: any) => {
    const resolvedView =
      view === 'quote' ? 'quote-request' : view === 'customer-signin' ? 'signin' : (view as ViewType);

    setCurrentView(resolvedView);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (resolvedView === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else if (resolvedView === 'admin-dashboard') {
      window.history.pushState(null, '', '/admin/dashboard');
    } else if (resolvedView === 'cart') {
      window.history.pushState(null, '', '/cart');
    } else if (resolvedView === 'checkout') {
      window.history.pushState(null, '', '/checkout');
    } else if (resolvedView === 'orders') {
      window.history.pushState(null, '', '/orders');
    } else if (resolvedView === 'quote-request') {
      window.history.pushState(null, '', '/quote');
    } else if (resolvedView === 'signin') {
      window.history.pushState(null, '', '/signin');
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

  // Trigger Request Quote page with product pre-populated
  const handleRequestQuote = (product?: Product) => {
    if (product) {
      setQuoteProduct(product);
    }
    navigateTo('quote-request');
  };

  // Select a product and open in full page
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    try {
      localStorage.setItem('spinel_selected_product_id', product.id);
    } catch {}
    navigateTo('product-detail');
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
    navigateTo('checkout');
  };

  // Search execution
  const handleExecuteSearch = (query: string, category: string) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    setSelectedSubCategory('');
    navigateTo('catalog');
  };

  // Quad Cards Datasets for Homepage
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

  // Helper to filter products by category for sliders
  const getProductsByCategory = (catName: string) => {
    return allProducts.filter((p) => p.category.toLowerCase() === catName.toLowerCase());
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#eaeded] font-sans antialiased text-gray-900">
      {/* Primary Spinel Distribution Navigation Header */}
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
          localStorage.removeItem('spinel_user');
          localStorage.removeItem('secstore_user');
        }}
        onOpenCart={() => navigateTo('cart')}
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
          <div className="space-y-6 pb-12">
            {/* Rotating Hero Banner */}
            <HeroBanner
              onExploreCategory={(cat) => {
                setSelectedCategory(cat);
                setSelectedSubCategory('');
                navigateTo('catalog');
              }}
            />

            {/* 4-Quad Card Grid Overlapping Hero */}
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

            {/* Categorized Product Sliders (Clean Horizontal Rows) */}
            <div className="max-w-7xl mx-auto px-4 space-y-6 pt-2">
              {/* Slider 1: Video Surveillance & Cameras */}
              <CategoryProductSlider
                title="Video Surveillance & Ultra-HD Cameras"
                subtitle="IP Cameras, 4K PTZ Starlight, AI Facial Analytics & Thermal Imaging"
                category="Video Surveillance & Cameras"
                products={getProductsByCategory('Video Surveillance & Cameras')}
                currency={currency}
                exchangeRate={exchangeRate}
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCart}
                onViewAll={(cat) => {
                  setSelectedCategory(cat);
                  setSelectedSubCategory('');
                  navigateTo('catalog');
                }}
              />

              {/* Slider 2: Access Control & Door Security */}
              <CategoryProductSlider
                title="Biometric Access Control & Physical Security"
                subtitle="Encrypted RFID Readers, OSDP 2.2 Controllers & Heavy-Duty Maglocks"
                category="Access Control & Door Security"
                products={getProductsByCategory('Access Control & Door Security')}
                currency={currency}
                exchangeRate={exchangeRate}
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCart}
                onViewAll={(cat) => {
                  setSelectedCategory(cat);
                  setSelectedSubCategory('');
                  navigateTo('catalog');
                }}
              />

              {/* Slider 3: Networking & Connectivity */}
              <CategoryProductSlider
                title="Industrial Networking & PoE Infrastructure"
                subtitle="Managed Gigabit Switches, Outdoor Wireless Bridges & Fiber Transceivers"
                category="Networking & Connectivity"
                products={getProductsByCategory('Networking & Connectivity')}
                currency={currency}
                exchangeRate={exchangeRate}
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCart}
                onViewAll={(cat) => {
                  setSelectedCategory(cat);
                  setSelectedSubCategory('');
                  navigateTo('catalog');
                }}
              />

              {/* Slider 4: Renewable Energy & Clean Power */}
              <CategoryProductSlider
                title="Solar & Renewable Energy Solutions"
                subtitle="Pure Sine Hybrid Inverters, Lithium LiFePO4 Storage & Monocrystalline Arrays"
                category="Renewable Energy"
                products={getProductsByCategory('Renewable Energy')}
                currency={currency}
                exchangeRate={exchangeRate}
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCart}
                onViewAll={(cat) => {
                  setSelectedCategory(cat);
                  setSelectedSubCategory('');
                  navigateTo('catalog');
                }}
              />

              {/* Slider 5: Security Sensors & Detection */}
              <CategoryProductSlider
                title="Perimeter Intrusion Detection & Radar"
                subtitle="Dual-Tech PIR Detectors, Microwave Radar & Long-Range Photoelectric Beams"
                category="Security Sensors & Detection"
                products={getProductsByCategory('Security Sensors & Detection')}
                currency={currency}
                exchangeRate={exchangeRate}
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCart}
                onViewAll={(cat) => {
                  setSelectedCategory(cat);
                  setSelectedSubCategory('');
                  navigateTo('catalog');
                }}
              />

              {/* Slider 6: Public Address (PAGA) System */}
              <CategoryProductSlider
                title="Public Address & Emergency Communication"
                subtitle="IP Horn Speakers, Network Paging Microphones & Intercom Master Stations"
                category="Public Address (PAGA) System"
                products={getProductsByCategory('Public Address (PAGA) System')}
                currency={currency}
                exchangeRate={exchangeRate}
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCart}
                onViewAll={(cat) => {
                  setSelectedCategory(cat);
                  setSelectedSubCategory('');
                  navigateTo('catalog');
                }}
              />
            </div>

            {/* 16 Category Quick Directory Strip */}
            <div className="max-w-7xl mx-auto px-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900">
                      Explore All 16 Specialized Departments
                    </h3>
                    <p className="text-xs text-gray-500">
                      High-availability hardware for commercial and critical facilities
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedSubCategory('');
                      navigateTo('catalog');
                    }}
                    className="text-xs font-semibold text-[#007185] hover:text-[#c45500] hover:underline"
                  >
                    View entire catalog →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3 text-center text-xs">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setSelectedSubCategory('');
                        navigateTo('catalog');
                      }}
                      className="p-3 bg-gray-50/80 hover:bg-amber-50/70 rounded-lg border border-gray-200 hover:border-[#f08804] cursor-pointer transition-all flex flex-col items-center justify-center group shadow-2xs"
                    >
                      <span className="font-semibold text-gray-800 group-hover:text-[#c45500] line-clamp-2">
                        {cat.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PRODUCT DETAIL FULL PAGE (NO MODAL) */}
        {currentView === 'product-detail' && (
          <ProductDetailPage
            product={selectedProduct || allProducts[0] || SEED_PRODUCTS[0]}
            currency={currency}
            exchangeRate={exchangeRate}
            allProducts={allProducts}
            relatedProducts={(allProducts || []).filter(
              (p) =>
                p.category === (selectedProduct?.category || allProducts[0]?.category) &&
                p.id !== (selectedProduct?.id || allProducts[0]?.id)
            )}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onRequestQuote={handleRequestQuote}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setSelectedSubCategory('');
              navigateTo('catalog');
            }}
            onSelectProduct={handleSelectProduct}
            onSelectRelatedProduct={handleSelectProduct}
            onBack={() => navigateTo('catalog')}
          />
        )}

        {/* VIEW 3: CART FULL PAGE (NO MODAL) */}
        {currentView === 'cart' && (
          <CartPage
            cartItems={cartItems}
            currency={currency}
            exchangeRate={exchangeRate}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onProceedToCheckout={() => navigateTo('checkout')}
            onNavigateHome={() => navigateTo('home')}
            onNavigateCatalog={() => navigateTo('catalog')}
            onContinueShopping={() => navigateTo('catalog')}
            recommendedProducts={(allProducts || []).slice(0, 12)}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onRequestQuote={handleRequestQuote}
          />
        )}

        {/* VIEW 4: CHECKOUT FULL PAGE (NO MODAL) */}
        {currentView === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            currency={currency}
            exchangeRate={exchangeRate}
            user={user}
            onOrderSuccess={(order) => {
              handleClearCart();
            }}
            onReturnToStore={() => navigateTo('home')}
            onViewOrders={() => navigateTo('orders')}
          />
        )}

        {/* VIEW 5: CATALOG / SEARCH RESULTS */}
        {currentView === 'catalog' && (
          <ProductList
            products={catalogProducts}
            isLoading={catalogLoading}
            currency={currency}
            exchangeRate={exchangeRate}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            searchQuery={searchQuery}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onRequestQuote={handleRequestQuote}
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

        {/* VIEW: REQUEST QUOTE FULL PAGE */}
        {currentView === 'quote-request' && (
          <QuoteRequestPage
            initialProduct={quoteProduct || selectedProduct}
            allProducts={allProducts}
            onNavigate={(view, params) => navigateTo(view, params)}
            onBack={() => navigateTo('home')}
          />
        )}

        {/* VIEW: CUSTOMER SIGN-IN / REGISTER FULL PAGE */}
        {currentView === 'signin' && (
          <CustomerSignInPage
            onLoginSuccess={(loggedUser, token) => {
              setUser(loggedUser);
              try {
                localStorage.setItem('spinel_user', JSON.stringify(loggedUser));
                localStorage.setItem('spinel_token', token);
              } catch {}
              navigateTo('home');
            }}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {/* VIEW 6: ORDERS & PDF INVOICE DOWNLOADS */}
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
                  handleSelectProduct(prod);
                }
              } catch (err) {
                console.error('Failed to load product:', err);
              }
            }}
          />
        )}

        {/* VIEW 7: ADMIN LOGIN */}
        {currentView === 'admin' && (
          <AdminLogin
            onLoginSuccess={(token) => {
              setAdminToken(token);
              navigateTo('admin-dashboard');
            }}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {/* VIEW 8: ADMIN DASHBOARD */}
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

      {/* Categories Slide-Over Drawer (All Products Menu) */}
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
          localStorage.setItem('spinel_user', JSON.stringify(authUser));
          localStorage.setItem('spinel_token', token);
        }}
        onNavigateAdmin={() => navigateTo('admin')}
      />

      {/* Spinel Distribution Multi-Column Footer */}
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
