import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Menu,
  ChevronDown,
  User as UserIcon,
  Package,
  LogOut,
  X,
  FileText,
  Check
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

  const currencyRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const cartSubtotalUSD = cartItems.reduce((acc, it) => acc + (it.product.priceUSD || 0) * it.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExecuteSearch(searchQuery, selectedCategory);
  };

  return (
    <header className="w-full select-none sticky top-0 z-40 shadow-sm">
      {/* Top Primary Bar #131921 */}
      <div className="bg-[#131921] text-white px-3 sm:px-4 md:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4 md:gap-5">
        {/* Spinel Distribution Logo & Brand Name Lockup (No borders/outlines, wider logo) */}
        <div
          id="spinel-logo-brand"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer py-1 px-1 rounded hover:opacity-95 transition-opacity shrink-0 group"
          title="Spinel Distribution Ltd"
        >
          <img
            src={COMPANY_LOGO_URL}
            alt="Spinel Distribution Ltd"
            className="h-9 sm:h-11 md:h-12 w-auto max-w-[120px] sm:max-w-[145px] object-contain border-0 outline-none ring-0 shadow-none"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col justify-center leading-tight">
            <span className="text-white font-black tracking-wide text-sm sm:text-base md:text-lg font-sans uppercase">
              SPINEL DISTRIBUTION
            </span>
            <span className="text-[#febd69] text-[10px] sm:text-xs font-semibold tracking-wider uppercase hidden xs:block">
              Security & Surveillance
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <form
          id="spinel-search-form"
          onSubmit={handleSearchSubmit}
          className="flex-1 flex items-center h-10 max-w-2xl rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#f08804] border border-transparent"
        >
          {/* "All Products" Category Selector */}
          <div className="relative shrink-0 hidden md:block">
            <button
              type="button"
              id="search-category-dropdown"
              onClick={() => setCatDropdownOpen(!catDropdownOpen)}
              className="bg-[#f3f3f3] text-[#131921] text-xs font-semibold px-3 h-10 flex items-center gap-1 border-r border-gray-300 hover:bg-[#e2e2e2] focus:outline-none max-w-[150px] cursor-pointer"
            >
              <span className="truncate">{selectedCategory || 'All Products'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-600 shrink-0" />
            </button>

            {catDropdownOpen && (
              <div className="absolute left-0 top-11 bg-white text-gray-800 shadow-2xl rounded-md py-2 w-64 max-h-96 overflow-y-auto border border-gray-200 z-50 text-xs">
                <div
                  className={`px-3 py-2 hover:bg-gray-100 cursor-pointer font-bold ${!selectedCategory ? 'bg-amber-50 text-[#c45500]' : ''}`}
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
                    className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${selectedCategory === cat.name ? 'bg-amber-50 text-[#c45500] font-semibold' : ''}`}
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
            placeholder="Search cameras, CCTV, access control, networking..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-full bg-white text-gray-900 px-3 text-sm focus:outline-none placeholder-gray-500 min-w-0"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="bg-white text-gray-400 hover:text-gray-700 px-2 h-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            id="search-submit-btn"
            className="bg-[#febd69] hover:bg-[#f3a847] text-[#131921] h-full px-4 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            title="Search"
          >
            <Search className="w-5 h-5 font-bold" />
          </button>
        </form>

        {/* Right Nav Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Customized USD and NGN 1-Dropdown with enhanced UI/UX */}
          <div ref={currencyRef} id="currency-dropdown-section" className="relative shrink-0">
            <button
              type="button"
              id="currency-selector-btn"
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-2 py-1.5 px-2.5 bg-[#232f3e] hover:bg-[#2d3b4e] rounded-md transition-colors text-white text-xs sm:text-sm font-bold border border-gray-700 hover:border-gray-500 cursor-pointer shadow-xs"
              title="Change Currency (USD / NGN)"
            >
              <img
                src={currency === 'USD' ? USD_FLAG_URL : NGN_FLAG_URL}
                alt={currency}
                className="w-5 h-3.5 object-cover rounded-xs border border-white/30"
                referrerPolicy="no-referrer"
              />
              <span>{currency}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-300 transition-transform ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Polished Currency Popover Menu */}
            {currencyDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white text-gray-900 shadow-2xl rounded-lg py-2 w-48 border border-gray-200 z-50 text-xs sm:text-sm animate-in fade-in duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  Select Currency
                </div>

                <button
                  type="button"
                  id="currency-opt-usd"
                  onClick={() => {
                    onCurrencyChange('USD');
                    setCurrencyDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-amber-50/70 transition-colors cursor-pointer ${
                    currency === 'USD' ? 'bg-amber-50 text-[#c45500] font-bold' : 'text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={USD_FLAG_URL}
                      alt="USA Flag"
                      className="w-5 h-3.5 object-cover rounded-xs border border-gray-300"
                      referrerPolicy="no-referrer"
                    />
                    <span>USD ($ United States)</span>
                  </div>
                  {currency === 'USD' && <Check className="w-4 h-4 text-[#c45500]" />}
                </button>

                <button
                  type="button"
                  id="currency-opt-ngn"
                  onClick={() => {
                    onCurrencyChange('NGN');
                    setCurrencyDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-amber-50/70 transition-colors cursor-pointer ${
                    currency === 'NGN' ? 'bg-amber-50 text-[#c45500] font-bold' : 'text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={NGN_FLAG_URL}
                      alt="Nigeria Flag"
                      className="w-5 h-3.5 object-cover rounded-xs border border-gray-300"
                      referrerPolicy="no-referrer"
                    />
                    <span>NGN (₦ Nigerian Naira)</span>
                  </div>
                  {currency === 'NGN' && <Check className="w-4 h-4 text-[#c45500]" />}
                </button>
              </div>
            )}
          </div>

          {/* "Request Quote" Navigation Button */}
          <button
            type="button"
            id="header-request-quote-btn"
            onClick={() => onNavigate('quote')}
            className={`flex items-center gap-1.5 py-1.5 px-3 sm:px-3.5 rounded-md font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer shrink-0 ${
              currentView === 'quote' || currentView === 'quote-request'
                ? 'bg-[#f08804] text-[#131921] ring-2 ring-white/50'
                : 'bg-[#febd69] hover:bg-[#f3a847] text-[#131921]'
            }`}
            title="Request Quote for custom or unpriced hardware"
          >
            <FileText className="w-4 h-4 text-[#131921]" />
            <span className="hidden sm:inline">Request Quote</span>
            <span className="sm:hidden">Quote</span>
          </button>

          {/* Accounts Dropdown (Navigates to Full Page Sign-in if not signed in) */}
          <div ref={accountRef} id="account-menu-container" className="relative shrink-0">
            <div
              id="account-nav-btn"
              onClick={() => {
                if (user) {
                  setShowAccountMenu(!showAccountMenu);
                } else {
                  onNavigate('signin');
                }
              }}
              className="flex flex-col py-1 px-2 border border-transparent hover:border-gray-500 rounded transition-colors cursor-pointer text-left"
            >
              <span className="text-[11px] sm:text-xs text-gray-300 leading-tight">
                {user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}
              </span>
              <div className="flex items-center gap-0.5">
                <span className="text-xs sm:text-sm font-bold leading-tight">Accounts</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>

            {/* Account Menu Popover - STRICTLY NO TECHNICAL ADMIN LINK */}
            {showAccountMenu && user && (
              <div className="absolute right-0 top-full mt-2 bg-white text-gray-800 shadow-2xl rounded-lg p-4 w-64 border border-gray-200 z-50 text-xs sm:text-sm animate-in fade-in duration-100">
                <div className="pb-3 mb-3 border-b border-gray-200">
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-gray-500 text-xs truncate">{user.email}</p>
                </div>

                <div className="space-y-2.5">
                  <div
                    onClick={() => {
                      setShowAccountMenu(false);
                      onNavigate('orders');
                    }}
                    className="hover:text-[#c45500] hover:underline cursor-pointer flex items-center gap-2 text-gray-800 py-1"
                  >
                    <Package className="w-4 h-4 text-gray-500" />
                    <span>Your Orders & Invoices</span>
                  </div>

                  <div
                    onClick={() => {
                      setShowAccountMenu(false);
                      onNavigate('quote');
                    }}
                    className="hover:text-[#c45500] hover:underline cursor-pointer flex items-center gap-2 text-gray-800 py-1"
                  >
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>Request Custom Quote</span>
                  </div>

                  <div
                    onClick={() => {
                      setShowAccountMenu(false);
                      onLogout();
                    }}
                    className="pt-2 border-t border-gray-100 text-red-600 hover:underline cursor-pointer flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart Button */}
          <div
            id="header-cart-btn"
            onClick={() => onNavigate('cart')}
            className="flex items-center gap-1.5 py-1 px-2.5 border border-transparent hover:border-gray-500 rounded transition-colors cursor-pointer shrink-0"
            title="Shopping Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              <span
                id="header-cart-badge"
                className="absolute -top-1 left-3 bg-[#f08804] text-[#131921] font-bold text-xs px-1.5 py-0.2 rounded-full min-w-[18px] text-center"
              >
                {totalCartCount}
              </span>
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-[11px] text-gray-300 leading-tight">Cart</span>
              <span className="text-xs sm:text-sm font-bold leading-tight">
                {formatPrice(cartSubtotalUSD, currency, exchangeRate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Sub-Header Navigation Bar #232f3e */}
      <div className="bg-[#232f3e] text-white px-3 sm:px-4 md:px-6 py-1.5 flex items-center justify-between text-xs sm:text-sm overflow-x-auto scrollbar-none gap-3">
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* "All Products" Drawer Button */}
          <button
            type="button"
            id="all-products-drawer-btn"
            onClick={onOpenCategoriesDrawer}
            className="flex items-center gap-1.5 font-bold py-1 px-2.5 border border-transparent hover:border-white rounded transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span>All Products</span>
          </button>

          {/* Quick Department Links */}
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Video Surveillance & Cameras' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded transition-colors whitespace-nowrap cursor-pointer"
          >
            Video Surveillance
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Access Control & Door Security' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded transition-colors whitespace-nowrap cursor-pointer"
          >
            Access Control
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Networking & Connectivity' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded transition-colors whitespace-nowrap cursor-pointer"
          >
            PoE Networking
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Renewable Energy' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded transition-colors whitespace-nowrap text-[#febd69] font-semibold cursor-pointer"
          >
            ☀️ Solar & Power
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Security Sensors & Detection' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded transition-colors whitespace-nowrap hidden sm:inline-block cursor-pointer"
          >
            Sensors & Radar
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog', { category: 'Public Address (PAGA) System' })}
            className="py-1 px-1.5 border border-transparent hover:border-white rounded transition-colors whitespace-nowrap hidden md:inline-block cursor-pointer"
          >
            PAGA & Intercom
          </button>
        </div>

        {/* Right subnav shortcut: Request Quote */}
        <div className="shrink-0 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('quote')}
            className="flex items-center gap-1 text-[#febd69] hover:text-white font-semibold py-1 px-2 hover:underline cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>RFQ & Tender Quotes</span>
          </button>
        </div>
      </div>
    </header>
  );
};
