import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Menu,
  ChevronDown,
  User as UserIcon,
  Package,
  LogOut,
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
  onOpenCategoriesDrawer: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onExecuteSearch: (query: string, category: string) => void;
}

const USD_FLAG_URL = 'https://res.cloudinary.com/bmv4hvtk/image/upload/v1788620186/usa-flag.png';
const NGN_FLAG_URL = 'https://res.cloudinary.com/bmv4hvtk/image/upload/v1788620186/nigeria-flag.png';
const COMPANY_LOGO_URL = 'https://res.cloudinary.com/bmv4hvtk/image/upload/v1788619290/Spinel_Distribution.jpg';

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
  onOpenCategoriesDrawer,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onExecuteSearch
}) => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const cartSubtotalUSD = cartItems.reduce((acc, it) => acc + it.product.priceUSD * it.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExecuteSearch(searchQuery, selectedCategory);
  };

  return (
    <header className="w-full select-none sticky top-0 z-40">
      {/* Top Primary Bar #131921 */}
      <div className="bg-[#131921] text-white px-3 md:px-5 py-2.5 flex items-center justify-between gap-3 md:gap-5">
        {/* Spinel Distribution Company Logo */}
        <div
          id="spinel-logo-container"
          onClick={() => onNavigate('home')}
          className="flex items-center cursor-pointer py-1 px-1 border border-transparent hover:border-white rounded transition-colors shrink-0 bg-white rounded-md p-1 shadow-xs"
          title="Spinel Distribution Ltd"
        >
          <img
            src={COMPANY_LOGO_URL}
            alt="Spinel Distribution Ltd"
            className="h-8 sm:h-9 w-auto object-contain rounded-xs"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Search Bar */}
        <form
          id="spinel-search-form"
          onSubmit={handleSearchSubmit}
          className="flex-1 flex items-center h-10 max-w-3xl rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#f08804]"
        >
          {/* "All Products" Category Selector */}
          <div className="relative shrink-0 hidden sm:block">
            <button
              type="button"
              id="search-category-dropdown"
              onClick={() => setCatDropdownOpen(!catDropdownOpen)}
              className="bg-[#e6e6e6] text-[#131921] text-xs font-semibold px-3 h-10 flex items-center gap-1 border-r border-gray-300 hover:bg-[#d8d8d8] focus:outline-none max-w-[145px]"
            >
              <span className="truncate">{selectedCategory || 'All Products'}</span>
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
                  All Products
                </div>
                <div className="h-px bg-gray-200 my-1" />
                {PRODUCT_CATEGORIES.map((cat) => (
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
            id="spinel-search-input"
            type="text"
            placeholder="Search security cameras, CCTV, access control, networking, surveillance, power systems..."
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

          {/* Search Button */}
          <button
            type="submit"
            id="search-submit-btn"
            className="bg-[#febd69] hover:bg-[#f3a847] text-[#131921] h-full px-4 flex items-center justify-center transition-colors shrink-0"
            title="Search"
          >
            <Search className="w-5 h-5 font-bold" />
          </button>
        </form>

        {/* Currency 1-Dropdown (USD with its image, only one dropdown of NGN with its image) */}
        <div id="currency-dropdown-section" className="relative shrink-0">
          <button
            type="button"
            id="currency-selector-btn"
            onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
            className="flex items-center gap-1.5 py-1.5 px-2 border border-transparent hover:border-white rounded transition-colors text-white text-xs font-bold"
          >
            <img
              src={currency === 'USD' ? USD_FLAG_URL : NGN_FLAG_URL}
              alt={currency}
              className="w-5 h-3.5 object-cover rounded-xs border border-white/20 shadow-2xs"
              referrerPolicy="no-referrer"
            />
            <span>{currency}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
          </button>

          {/* Dropdown Menu - only shows the other currency with its image */}
          {currencyDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 bg-white text-gray-800 shadow-2xl rounded-md py-1.5 w-36 border border-gray-200 z-50 text-xs animate-in fade-in duration-100">
              {currency === 'USD' ? (
                <button
                  type="button"
                  id="currency-dropdown-opt-ngn"
                  onClick={() => {
                    onCurrencyChange('NGN');
                    setCurrencyDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-100 transition-colors font-medium text-gray-800"
                >
                  <img
                    src={NGN_FLAG_URL}
                    alt="NGN"
                    className="w-5 h-3.5 object-cover rounded-xs border border-gray-300"
                    referrerPolicy="no-referrer"
                  />
                  <span>NGN</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="currency-dropdown-opt-usd"
                  onClick={() => {
                    onCurrencyChange('USD');
                    setCurrencyDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-100 transition-colors font-medium text-gray-800"
                >
                  <img
                    src={USD_FLAG_URL}
                    alt="USD"
                    className="w-5 h-3.5 object-cover rounded-xs border border-gray-300"
                    referrerPolicy="no-referrer"
                  />
                  <span>USD</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Accounts (replaced 'Accounts & Lists') */}
        <div
          id="account-menu-container"
          className="relative shrink-0"
          onMouseEnter={() => setShowAccountMenu(true)}
          onMouseLeave={() => setShowAccountMenu(false)}
        >
          <div
            id="account-nav-btn"
            onClick={() => user ? onNavigate('orders') : onOpenAuth()}
            className="flex flex-col py-1 px-2 border border-transparent hover:border-white rounded transition-colors cursor-pointer text-left"
          >
            <span className="text-[11px] text-gray-300 leading-tight">
              {user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}
            </span>
            <div className="flex items-center gap-0.5">
              <span className="text-xs font-bold leading-tight">Accounts</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
          </div>

          {/* Account Menu Popover */}
          {showAccountMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white text-gray-800 shadow-2xl rounded-md p-4 w-60 border border-gray-200 z-50 text-xs">
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
                  <span>Technical Admin Login</span>
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

        {/* Shopping Cart Button - navigates to full page cart */}
        <div
          id="header-cart-btn"
          onClick={() => onNavigate('cart')}
          className="flex items-center gap-1.5 py-1 px-2.5 border border-transparent hover:border-white rounded transition-colors cursor-pointer shrink-0"
          title="Shopping Cart"
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

      {/* Secondary Sub-Header Navigation Bar #232f3e */}
      <div className="bg-[#232f3e] text-white px-3 md:px-5 py-1.5 flex items-center text-xs overflow-x-auto scrollbar-none gap-3">
        <div className="flex items-center gap-4 shrink-0">
          {/* "All Products" Hamburger Button (replaced 'All Categories') */}
          <button
            type="button"
            id="all-products-drawer-btn"
            onClick={onOpenCategoriesDrawer}
            className="flex items-center gap-1.5 font-bold py-1 px-2 border border-transparent hover:border-white rounded transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span>All Products</span>
          </button>

          {/* Quick Category links */}
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Video Surveillance & Cameras' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded transition-colors whitespace-nowrap"
          >
            Video Surveillance
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Access Control & Door Security' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded transition-colors whitespace-nowrap"
          >
            Access Control
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Networking & Connectivity' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded transition-colors whitespace-nowrap"
          >
            PoE Switches & Routers
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Security Sensors & Detection' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded transition-colors whitespace-nowrap hidden sm:inline-block"
          >
            Sensors & Radar
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Renewable Energy' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded transition-colors whitespace-nowrap text-[#febd69] font-medium"
          >
            ☀️ Solar & Power Solutions
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Public Address (PAGA) System' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded transition-colors whitespace-nowrap hidden md:inline-block"
          >
            PAGA & Intercom
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Storage & Data Infrastructure' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded transition-colors whitespace-nowrap hidden lg:inline-block"
          >
            Storage & Servers
          </button>
        </div>
      </div>
    </header>
  );
};
