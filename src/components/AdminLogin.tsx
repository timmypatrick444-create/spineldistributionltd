import React, { useState } from 'react';
import { Shield, Key, Mail, AlertCircle, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (adminToken: string) => void;
  onNavigateHome: () => void;
}

const COMPANY_LOGO_URL = 'https://res.cloudinary.com/bmv4hvtk/image/upload/v1788619290/Spinel_Distribution.jpg';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [technicalEmail, setTechnicalEmail] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technicalEmail, accessKey })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Store admin token
      localStorage.setItem('secstore_admin_token', data.token);
      onLoginSuccess(data.token);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full bg-white border border-gray-300 rounded-xl shadow-xl p-8">
        {/* Spinel Distribution Logo Header (No outline/border around logo) */}
        <div className="text-center mb-6">
          <div
            onClick={onNavigateHome}
            className="inline-flex items-center justify-center cursor-pointer mb-3"
            title="Spinel Distribution Ltd"
          >
            <img
              src={COMPANY_LOGO_URL}
              alt="Spinel Distribution Ltd"
              className="h-12 sm:h-14 w-auto object-contain border-0 outline-none ring-0 shadow-none"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span>Technical Admin Portal</span>
            </div>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 text-center">Administrator Sign-In</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-6 text-center">
          Restricted to authorized personnel via Technical Email ID and Access Key.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Technical Email ID
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={technicalEmail}
                onChange={(e) => setTechnicalEmail(e.target.value)}
                placeholder="e.g. admin@enterprise.sec"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f08804] focus:outline-none text-xs sm:text-sm"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Master Access Key
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f08804] focus:outline-none text-xs sm:text-sm"
              />
              <Key className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-3 px-4 rounded-md shadow-xs transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50 mt-4 cursor-pointer"
          >
            {isLoading ? (
              <span>Authenticating Credentials...</span>
            ) : (
              <>
                <span>Sign-In to Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 hover:underline cursor-pointer"
          >
            ← Return to Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
