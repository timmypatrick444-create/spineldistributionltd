import React from 'react';
import { Shield, Globe, Lock, ArrowUp } from 'lucide-react';
import { Currency } from '../types.ts';

interface FooterProps {
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  exchangeRate: number;
  onNavigate: (view: string, params?: any) => void;
  deliveryLocation: string;
}

export const Footer: React.FC<FooterProps> = ({
  currency,
  onCurrencyChange,
  exchangeRate,
  onNavigate,
  deliveryLocation
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#232f3e] text-white text-xs select-none mt-12">
      {/* Back to top button */}
      <button
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
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('home')}>About Amazon SecStore</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('catalog', { category: 'Renewable Energy' })}>Sustainable Green Microgrids</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('admin')}>Enterprise Security Accreditation</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('admin')}>Technical Administration</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm text-white mb-3">Security Systems</h4>
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
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('orders')}>Returns & Replacements</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('admin')}>Technical Administrator Login</li>
            <li className="hover:underline cursor-pointer">24/7 Security Escalation Desk</li>
          </ul>
        </div>
      </div>

      {/* Mid divider with Brand, Language, Currency */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-baseline cursor-pointer" onClick={() => onNavigate('home')}>
            <span className="text-2xl font-black tracking-tighter text-white font-sans">amazon</span>
            <span className="text-xs font-bold text-[#febd69] ml-0.5">.secstore</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency selector pill */}
            <div className="flex items-center gap-1 border border-gray-600 rounded px-2.5 py-1 text-xs">
              <span className="text-gray-400">Currency:</span>
              <button
                onClick={() => onCurrencyChange(currency === 'USD' ? 'NGN' : 'USD')}
                className="font-bold text-[#febd69] hover:underline"
              >
                {currency === 'USD' ? '$ USD (United States Dollar)' : '₦ NGN (Nigerian Naira)'}
              </button>
            </div>

            {/* Country badge */}
            <div className="flex items-center gap-1.5 border border-gray-600 rounded px-2.5 py-1 text-xs text-gray-300">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span>{deliveryLocation}</span>
            </div>

            {/* Admin shortcut */}
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1 border border-amber-500/50 bg-amber-500/10 text-amber-300 rounded px-2.5 py-1 text-xs hover:bg-amber-500/20"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer #131921 */}
      <div className="bg-[#131921] py-6 text-center text-gray-400 text-[11px] space-y-1">
        <div className="flex flex-wrap items-center justify-center gap-4 text-gray-300">
          <span className="hover:underline cursor-pointer">Conditions of Use</span>
          <span className="hover:underline cursor-pointer">Privacy Notice</span>
          <span className="hover:underline cursor-pointer">Enterprise Security Disclosures</span>
          <span className="hover:underline cursor-pointer">FIPS 140-2 Compliance</span>
        </div>
        <p className="pt-2">
          © 2026 Amazon SecStore International LLC or its affiliates. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
