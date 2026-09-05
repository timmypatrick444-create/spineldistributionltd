import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  MapPin,
  Menu,
  ChevronDown,
  User as UserIcon,
  Shield,
  DollarSign,
  Globe,
  Package,
  LogOut,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Currency, User, CartItem } from '../types.ts';
import { PRODUCT_CATEGORIES } from '../data/categories.ts';
import { formatPrice } from '../utils/currency.ts';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  exchangeRate: number;
  cartItems: CartItem[];
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenCart: () => void;
  onOpenCategoriesDrawer: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onExecuteSearch: (query: string, category: string) => void;
  deliveryLocation: string;
  onChangeLocation: (loc: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  currency,
  onCurrencyChange,
  exchangeRate,
  cartItems,
  user,
  onOpenAuth,
  onLogout,
  onOpenCart,
  onOpenCategoriesDrawer,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onExecuteSearch,
  deliveryLocation,
  onChangeLocation
}) => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempLocation, setTempLocation] = useState(deliveryLocation);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const cartSubtotalUSD = cartItems.reduce((acc, it) => acc + it.product.priceUSD * it.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExecuteSearch(searchQuery, selectedCategory);
  };

  return (
    <header className="w-full select-none sticky top-0 z-40">
      {/* Top Primary Amazon Bar #131921 */}
      <div className="bg-[#131921] text-white px-3 md:px-4 py-2 flex items-center justify-between gap-2 md:gap-4">
        {/* Amazon SecStore Logo */}
        <div
          id="amazon-logo-container"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 cursor-pointer py-1 px-2 border border-transparent hover:border-white rounded-xs transition-colors shrink-0"
        >
          <div className="flex items-baseline">
            <span className="text-xl md:text-2xl font-black tracking-tighter text-white font-sans">amazon</span>
            <span className="text-xs md:text-sm font-bold text-[#febd69] ml-0.5 tracking-tight">.secstore</span>
          </div>
          <div className="hidden sm:flex items-center text-[10px] uppercase font-semibold text-gray-300 bg-gray-800/80 px-1.5 py-0.5 rounded">
            <Shield className="w-2.5 h-2.5 mr-0.5 text-[#febd69]" /> Enterprise
          </div>
        </div>

        {/* Deliver to Pin */}
        <div
          id="deliver-to-selector"
          onClick={() => setShowLocationModal(true)}
          className="hidden lg:flex items-center gap-1 cursor-pointer py-1 px-2 border border-transparent hover:border-white rounded-xs transition-colors shrink-0"
        >
          <MapPin className="w-4 h-4 text-gray-300 mt-2" />
          <div className="flex flex-col text-left">
            <span className="text-[11px] text-gray-300 leading-tight">Deliver to</span>
            <span className="text-xs font-bold leading-tight truncate max-w-[120px]">{deliveryLocation}</span>
          </div>
        </div>

        {/* Amazon Search Bar */}
        <form
          id="amazon-search-form"
          onSubmit={handleSearchSubmit}
          className="flex-1 flex items-center h-10 max-w-3xl rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#f08804]"
        >
          {/* Category Dropdown */}
          <div className="relative shrink-0 hidden sm:block">
            <button
              type="button"
              id="search-category-dropdown"
              onClick={() => setCatDropdownOpen(!catDropdownOpen)}
              className="bg-[#e6e6e6] text-[#131921] text-xs font-medium px-3 h-10 flex items-center gap-1 border-r border-gray-300 hover:bg-[#d8d8d8] focus:outline-none max-w-[140px]"
            >
              <span className="truncate">{selectedCategory || 'All Categories'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-600 shrink-0" />
            </button>

            {catDropdownOpen && (
              <div className="absolute left-0 top-11 bg-white text-gray-800 shadow-2xl rounded-md py-2 w-64 max-h-96 overflow-y-auto border border-gray-200 z-50 text-xs">
                <div
                  className={`px-3 py-1.5 hover:bg-gray-100 cursor-pointer font-bold ${!selectedCategory ? 'bg-amber-50 text-[#c45500]' : ''}`}
                  onClick={() => {
                    onSelectCategory('');
                    setCatDropdownOpen(false);
                  }}
                >
                  All Security Categories
                </div>
                <div className="h-px bg-gray-200 my-1" />
                {PRODUCT_CATEGORIES.map(cat => (
                  <div
                    key={cat.id}
                    className={`px-3 py-1.5 hover:bg-gray-100 cursor-pointer ${selectedCategory === cat.name ? 'bg-amber-50 text-[#c45500] font-semibold' : ''}`}
                    onClick={() => {
                      onSelectCategory(cat.name);
                      setCatDropdownOpen(false);
                    }}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Input */}
          <input
            id="amazon-search-input"
            type="text"
            placeholder="Search surveillance, access control, NVRs, PoE switches, solar inverters..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-full bg-white text-gray-900 px-3 text-sm focus:outline-none placeholder-gray-500"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="bg-white text-gray-400 hover:text-gray-700 px-2 h-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Submit Search Button */}
          <button
            type="submit"
            id="search-submit-btn"
            className="bg-[#febd69] hover:bg-[#f3a847] text-[#131921] h-full px-4 flex items-center justify-center transition-colors shrink-0"
            title="Search"
          >
            <Search className="w-5 h-5 font-bold" />
          </button>
        </form>

        {/* Currency 1-Dropdown (Dollar & Naira) */}
        {/* User requirement: "Default price are in dollars but create a 1-dropdown for Naira and Dollar" */}
        <div id="currency-dropdown-container" className="relative group shrink-0">
          <button
            type="button"
            id="currency-selector-button"
            className="flex items-center gap-1 py-1 px-2 border border-transparent hover:border-white rounded-xs transition-colors text-white"
          >
            <span className="text-sm font-bold">
              {currency === 'USD' ? '🇺🇸 $ USD' : '🇳🇬 ₦ NGN'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-1 bg-white text-gray-800 shadow-xl rounded-md py-2 w-52 border border-gray-200 hidden group-hover:block z-50 text-xs">
            <div className="px-3 py-1 text-gray-500 font-semibold border-b border-gray-100">
              Select Currency:
            </div>

            <button
              type="button"
              id="currency-opt-usd"
              onClick={() => onCurrencyChange('USD')}
              className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-100 transition-colors ${currency === 'USD' ? 'font-bold text-[#c45500] bg-amber-50' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🇺🇸</span>
                <span>$ - USD (US Dollar)</span>
              </div>
              {currency === 'USD' && <span className="text-xs text-[#c45500]">✓ Default</span>}
            </button>

            <button
              type="button"
              id="currency-opt-ngn"
              onClick={() => onCurrencyChange('NGN')}
              className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-100 transition-colors ${currency === 'NGN' ? 'font-bold text-[#c45500] bg-amber-50' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🇳🇬</span>
                <span>₦ - NGN (Nigerian Naira)</span>
              </div>
              {currency === 'NGN' && <span className="text-xs text-[#c45500]">✓ Active</span>}
            </button>

            <div className="mt-2 pt-2 border-t border-gray-100 px-3 text-[11px] text-gray-500 leading-tight">
              Server Exchange Rate: <br />
              <span className="font-semibold text-gray-700">1 USD = ₦{exchangeRate.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Account & Lists */}
        <div
          id="account-menu-container"
          className="relative shrink-0"
          onMouseEnter={() => setShowAccountMenu(true)}
          onMouseLeave={() => setShowAccountMenu(false)}
        >
          <div
            id="account-nav-btn"
            onClick={() => user ? onNavigate('orders') : onOpenAuth()}
            className="flex flex-col py-1 px-2 border border-transparent hover:border-white rounded-xs transition-colors cursor-pointer text-left"
          >
            <span className="text-[11px] text-gray-300 leading-tight">
              {user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}
            </span>
            <div className="flex items-center gap-0.5">
              <span className="text-xs font-bold leading-tight">Account & Lists</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
          </div>

          {/* Account Menu Popover */}
          {showAccountMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white text-gray-800 shadow-2xl rounded-md p-4 w-64 border border-gray-200 z-50 text-xs">
              {!user ? (
                <div className="text-center pb-3 border-b border-gray-200">
                  <button
                    type="button"
                    id="header-sign-in-btn"
                    onClick={() => {
                      setShowAccountMenu(false);
                      onOpenAuth();
                    }}
                    className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-semibold py-2 px-4 rounded-md shadow-xs transition-colors"
                  >
                    Sign in
                  </button>
                  <p className="mt-2 text-[11px] text-gray-600">
                    New customer?{' '}
                    <span
                      onClick={() => {
                        setShowAccountMenu(false);
                        onOpenAuth();
                      }}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Start here.
                    </span>
                  </p>
                </div>
              ) : (
                <div className="pb-2 mb-2 border-b border-gray-200">
                  <p className="font-bold text-sm text-gray-900">{user.name}</p>
                  <p className="text-gray-500 text-[11px] truncate">{user.email}</p>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <div className="font-bold text-gray-900">Your Account</div>
                <div
                  onClick={() => {
                    setShowAccountMenu(false);
                    onNavigate('orders');
                  }}
                  className="hover:text-[#c45500] hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <Package className="w-3.5 h-3.5 text-gray-500" /> Your Orders & Invoices
                </div>
                <div
                  onClick={() => {
                    setShowAccountMenu(false);
                    onNavigate('admin');
                  }}
                  className="hover:text-[#c45500] hover:underline cursor-pointer flex items-center gap-1.5 text-amber-800 font-medium"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-700" /> Admin Technical Login
                </div>

                {user && (
                  <div
                    onClick={() => {
                      setShowAccountMenu(false);
                      onLogout();
                    }}
                    className="pt-2 border-t border-gray-100 text-red-600 hover:underline cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Returns & Orders */}
        <div
          id="returns-orders-nav"
          onClick={() => onNavigate('orders')}
          className="hidden md:flex flex-col py-1 px-2 border border-transparent hover:border-white rounded-xs transition-colors cursor-pointer text-left shrink-0"
        >
          <span className="text-[11px] text-gray-300 leading-tight">Returns</span>
          <span className="text-xs font-bold leading-tight">& Orders</span>
        </div>

        {/* Shopping Cart with Badge */}
        <div
          id="header-cart-btn"
          onClick={onOpenCart}
          className="flex items-center gap-1.5 py-1 px-2.5 border border-transparent hover:border-white rounded-xs transition-colors cursor-pointer shrink-0"
        >
          <div className="relative">
            <ShoppingCart className="w-7 h-7 text-white" />
            <span
              id="header-cart-badge"
              className="absolute -top-1 left-3 bg-[#f08804] text-[#131921] font-bold text-xs px-1.5 py-0.2 rounded-full min-w-[18px] text-center"
            >
              {totalCartCount}
            </span>
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-[11px] text-gray-300 leading-tight">Cart</span>
            <span className="text-xs font-bold leading-tight">
              {formatPrice(cartSubtotalUSD, currency, exchangeRate)}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Header Navigation Bar #232f3e */}
      <div className="bg-[#232f3e] text-white px-3 md:px-4 py-1.5 flex items-center justify-between text-xs overflow-x-auto scrollbar-none gap-3">
        <div className="flex items-center gap-4 shrink-0">
          {/* "All" Hamburger Button */}
          <button
            type="button"
            id="all-categories-drawer-btn"
            onClick={onOpenCategoriesDrawer}
            className="flex items-center gap-1.5 font-bold py-1 px-2 border border-transparent hover:border-white rounded-xs transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span>All Categories</span>
          </button>

          {/* Quick Category links */}
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Video Surveillance & Cameras' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded-xs transition-colors whitespace-nowrap"
          >
            Video Surveillance
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Access Control & Door Security' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded-xs transition-colors whitespace-nowrap"
          >
            Access Control
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Networking & Connectivity' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded-xs transition-colors whitespace-nowrap"
          >
            PoE Switches & Routers
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Security Sensors & Detection' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded-xs transition-colors whitespace-nowrap hidden sm:inline-block"
          >
            Sensors & Radar
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Renewable Energy' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded-xs transition-colors whitespace-nowrap text-[#febd69] font-medium"
          >
            ☀️ Solar & LiFePO4
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Public Address (PAGA) System' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded-xs transition-colors whitespace-nowrap hidden md:inline-block"
          >
            PAGA Systems
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Storage & Data Infrastructure' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded-xs transition-colors whitespace-nowrap hidden lg:inline-block"
          >
            Storage & Servers
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { dealOnly: true })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded-xs transition-colors text-amber-300 font-semibold whitespace-nowrap"
          >
            Today's Enterprise Deals
          </button>
        </div>

        {/* Right side Admin link */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            id="admin-nav-link"
            onClick={() => onNavigate('admin')}
            className="flex items-center gap-1 py-1 px-2 bg-gray-700/60 hover:bg-gray-700 border border-gray-600 rounded-xs transition-colors text-amber-300 font-semibold"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 text-gray-800">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#f08804]" /> Choose your location
              </h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 mt-3">
              Delivery options and speeds may vary for different enterprise delivery destinations across the globe.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Destination Country / Region:
                </label>
                <input
                  type="text"
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#f08804] focus:outline-none"
                  placeholder="e.g. United States, Nigeria, United Kingdom, UAE"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="px-4 py-1.5 border border-gray-300 rounded text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangeLocation(tempLocation || 'United States');
                    setShowLocationModal(false);
                  }}
                  className="px-4 py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 rounded text-xs font-bold shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
