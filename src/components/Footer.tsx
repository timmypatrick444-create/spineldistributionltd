import React from 'react';
import { Shield, ArrowUp } from 'lucide-react';
import { Currency } from '../types.ts';

interface FooterProps {
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  exchangeRate: number;
  onNavigate: (view: string, params?: any) => void;
  deliveryLocation: string;
}

const COMPANY_LOGO_URL = 'https://res.cloudinary.com/bmv4hvtk/image/upload/v1788619290/Spinel_Distribution.jpg';

export const Footer: React.FC<FooterProps> = ({
  currency,
  onCurrencyChange,
  exchangeRate,
  onNavigate
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#232f3e] text-white text-xs select-none mt-12">
      {/* Back to top button */}
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full py-3.5 bg-[#37475a] hover:bg-[#485769] text-center text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
      >
        <ArrowUp className="w-3.5 h-3.5" />
        <span>Back to top</span>
      </button>

      {/* Main 4-column Links Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-sm text-white mb-3">Get to Know Us</h4>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('home')}>About Spinel Distribution</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('catalog', { category: 'Renewable Energy' })}>Solar & Clean Power Systems</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('catalog', { category: 'Video Surveillance & Cameras' })}>Enterprise Surveillance Infrastructure</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('admin')}>Technical Administration Portal</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm text-white mb-3">Product Categories</h4>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('catalog', { category: 'Video Surveillance & Cameras' })}>Video Surveillance & 4K PTZ</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('catalog', { category: 'Access Control & Door Security' })}>Biometric Access Control</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('catalog', { category: 'Networking & Connectivity' })}>Industrial Managed PoE</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('catalog', { category: 'Public Address (PAGA) System' })}>PAGA & Intercom Audio</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm text-white mb-3">Payments & Currencies</h4>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer" onClick={() => onCurrencyChange(currency === 'USD' ? 'NGN' : 'USD')}>
              Active Currency: <span className="text-[#febd69] font-bold">{currency === 'USD' ? 'US Dollar ($)' : 'Nigerian Naira (₦)'}</span>
            </li>
            <li className="hover:underline cursor-pointer">Live Paystack Integration</li>
            <li className="text-gray-400">Server Rate: 1 USD = ₦{exchangeRate.toLocaleString()}</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('orders')}>Download PDF Tax Invoices</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm text-white mb-3">Customer Support</h4>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('orders')}>Your Orders & Tracking</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('cart')}>Shopping Cart & Checkout</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('admin')}>Technical Administrator Login</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('home')}>Spinel Technical Help Desk</li>
          </ul>
        </div>
      </div>

      {/* Mid divider with Brand & Logo */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-6">
          <div
            className="flex items-center gap-3 cursor-pointer bg-white rounded-md p-1.5 shadow-xs"
            onClick={() => onNavigate('home')}
          >
            <img
              src={COMPANY_LOGO_URL}
              alt="Spinel Distribution Ltd"
              className="h-9 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Currency selector pill */}
            <div className="flex items-center gap-1 border border-gray-600 rounded px-2.5 py-1 text-xs">
              <span className="text-gray-400">Currency:</span>
              <button
                type="button"
                onClick={() => onCurrencyChange(currency === 'USD' ? 'NGN' : 'USD')}
                className="font-bold text-[#febd69] hover:underline"
              >
                {currency === 'USD' ? '$ USD (United States Dollar)' : '₦ NGN (Nigerian Naira)'}
              </button>
            </div>

            {/* Admin shortcut */}
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1 border border-amber-500/50 bg-amber-500/10 text-amber-300 rounded px-2.5 py-1 text-xs hover:bg-amber-500/20"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Technical Admin Access</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer #131921 */}
      <div className="bg-[#131921] py-6 text-center text-gray-400 text-[11px] space-y-1">
        <div className="flex flex-wrap items-center justify-center gap-4 text-gray-300">
          <span className="hover:underline cursor-pointer">Conditions of Use & Distribution</span>
          <span className="hover:underline cursor-pointer">Privacy Notice</span>
          <span className="hover:underline cursor-pointer">Physical Security Standards</span>
          <span className="hover:underline cursor-pointer">Spinel Commercial Compliance</span>
        </div>
        <p className="pt-2 text-gray-500">
          © 2026 Spinel Distribution Ltd. All rights reserved. International Security, Surveillance, Access Control & Power Distribution.
        </p>
      </div>
    </footer>
  );
};
