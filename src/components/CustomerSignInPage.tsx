import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Building2, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { User } from '../types.ts';

interface CustomerSignInPageProps {
  onLoginSuccess: (user: User, token: string) => void;
  onNavigateHome: () => void;
}

const COMPANY_LOGO_URL = 'https://res.cloudinary.com/bmv4hvtk/image/upload/v1788619290/Spinel_Distribution.jpg';

export const CustomerSignInPage: React.FC<CustomerSignInPageProps> = ({
  onLoginSuccess,
  onNavigateHome
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister ? { email, password, name, company } : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12 bg-gray-50">
      {/* Return to Storefront link */}
      <div className="max-w-md w-full mb-4">
        <button
          type="button"
          onClick={onNavigateHome}
          className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </button>
      </div>

      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 text-gray-800">
        {/* Spinel Distribution Logo Header (No outlines/borders) */}
        <div className="text-center mb-6">
          <div
            onClick={onNavigateHome}
            className="inline-flex items-center justify-center cursor-pointer mb-2"
            title="Spinel Distribution Ltd"
          >
            <img
              src={COMPANY_LOGO_URL}
              alt="Spinel Distribution Ltd"
              className="h-12 sm:h-14 w-auto object-contain border-0 outline-none ring-0 shadow-none"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
            {isRegister ? 'Create Customer Account' : 'Customer Sign-In'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Access purchase tracking, quotations, order history, and tax invoices.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {isRegister && (
            <>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Your Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First and last name"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f08804] focus:outline-none text-xs sm:text-sm"
                  />
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Company / Organization</label>
                <div className="relative">
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Organization or agency name"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f08804] focus:outline-none text-xs sm:text-sm"
                  />
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f08804] focus:outline-none text-xs sm:text-sm"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f08804] focus:outline-none text-xs sm:text-sm"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-3 px-4 rounded-md shadow-xs transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50 mt-4 cursor-pointer"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs sm:text-sm text-gray-600">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-blue-700 font-bold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              New customer to Spinel Distribution?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-blue-700 font-bold hover:underline cursor-pointer"
              >
                Create your account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
