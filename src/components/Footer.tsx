import React from 'react';
import { ArrowUp, FileText, Phone, Mail, MapPin } from 'lucide-react';
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
  onNavigate
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#232f3e] text-white text-xs sm:text-sm select-none mt-12">
      {/* Back to top button */}
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full py-3.5 bg-[#37475a] hover:bg-[#485769] text-center text-xs sm:text-sm font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <ArrowUp className="w-4 h-4" />
        <span>Back to top</span>
      </button>

      {/* Main 4-column Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-white mb-3">About Spinel Distribution</h4>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-3">
            Spinel Distribution Ltd provides high-performance electronic security, video surveillance, biometric access control, and clean power infrastructure.
          </p>
          <ul className="space-y-2 text-gray-300 text-xs sm:text-sm">
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('home')}>Storefront Home</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('quote')}>Request an Official Quote (RFQ)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm sm:text-base text-white mb-3">Core Hardware Categories</h4>
          <ul className="space-y-2 text-gray-300 text-xs sm:text-sm">
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('catalog', { category: 'Video Surveillance & Cameras' })}>Video Surveillance & 4K PTZ</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('catalog', { category: 'Access Control & Door Security' })}>Biometric Access Control</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('catalog', { category: 'Networking & Connectivity' })}>Industrial Managed PoE Switches</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('catalog', { category: 'Renewable Energy' })}>Solar & Hybrid Inverters</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('catalog', { category: 'Public Address (PAGA) System' })}>Public Address (PAGA) & Intercom</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm sm:text-base text-white mb-3">Client Services & Orders</h4>
          <ul className="space-y-2 text-gray-300 text-xs sm:text-sm">
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('orders')}>Customer Orders & Tracking</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('cart')}>Shopping Cart & Checkout</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('quote')}>Institutional Quotations</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('orders')}>Download PDF Tax Invoices</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm sm:text-base text-white mb-3">Contact & Support</h4>
          <ul className="space-y-2.5 text-gray-300 text-xs sm:text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#febd69] shrink-0" />
              <span>Technical Sales Helpdesk</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#febd69] shrink-0" />
              <span>sales@spineldistribution.com</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#febd69] shrink-0 mt-0.5" />
              <span>Spinel Distribution Operations & Logistics Centers</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Sub-footer #131921 */}
      <div className="bg-[#131921] py-6 text-center text-gray-400 text-xs sm:text-sm border-t border-gray-800">
        <p className="text-gray-400">
          © 2026 Spinel Distribution Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
