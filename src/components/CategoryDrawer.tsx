import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ArrowLeft,
  Camera,
  Server,
  KeyRound,
  PhoneCall,
  Network,
  Radio,
  Volume2,
  ShieldCheck,
  HardDrive,
  Zap,
  Box,
  Wrench,
  Lightbulb,
  Satellite,
  Settings,
  Sun,
  User as UserIcon,
  ShoppingBag
} from 'lucide-react';
import { PRODUCT_CATEGORIES, Category } from '../data/categories.ts';
import { User } from '../types.ts';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubCategory: (categoryName: string, subCategoryName: string) => void;
  user: User | null;
  onOpenAuth: () => void;
  onNavigateAdmin: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Camera: <Camera className="w-4 h-4 text-gray-500" />,
  Server: <Server className="w-4 h-4 text-gray-500" />,
  KeyRound: <KeyRound className="w-4 h-4 text-gray-500" />,
  PhoneCall: <PhoneCall className="w-4 h-4 text-gray-500" />,
  Network: <Network className="w-4 h-4 text-gray-500" />,
  Radio: <Radio className="w-4 h-4 text-gray-500" />,
  Volume2: <Volume2 className="w-4 h-4 text-gray-500" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4 text-gray-500" />,
  HardDrive: <HardDrive className="w-4 h-4 text-gray-500" />,
  Zap: <Zap className="w-4 h-4 text-gray-500" />,
  Box: <Box className="w-4 h-4 text-gray-500" />,
  Wrench: <Wrench className="w-4 h-4 text-gray-500" />,
  Lightbulb: <Lightbulb className="w-4 h-4 text-gray-500" />,
  Satellite: <Satellite className="w-4 h-4 text-gray-500" />,
  Settings: <Settings className="w-4 h-4 text-gray-500" />,
  Sun: <Sun className="w-4 h-4 text-amber-500" />
};

export const CategoryDrawer: React.FC<CategoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectSubCategory,
  user,
  onOpenAuth,
  onNavigateAdmin
}) => {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="relative w-screen max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Close Button (Outside or Top Corner) */}
          <button
            onClick={onClose}
            className="absolute top-3 -right-12 text-white hover:text-amber-300 p-1 hidden sm:block"
            title="Close menu"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Drawer Header with user profile - Amazon style */}
          <div className="bg-[#232f3e] text-white p-4 flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                if (!user) onOpenAuth();
              }}
            >
              <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-300">Hello,</p>
                <p className="text-sm font-bold text-white">
                  {user ? user.name : 'Sign in to Enterprise Account'}
                </p>
              </div>
            </div>

            <button onClick={onClose} className="text-gray-300 hover:text-white sm:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeCategory ? (
              // Subcategory View
              <div className="py-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className="w-full flex items-center gap-2 px-6 py-3 text-xs font-bold text-gray-700 hover:bg-gray-100 border-b border-gray-200 uppercase tracking-wider"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-500" />
                  <span>Main Menu</span>
                </button>

                <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-bold text-sm text-gray-900">{activeCategory.name}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">{activeCategory.description}</p>
                </div>

                <div className="py-1">
                  <div
                    onClick={() => {
                      onSelectSubCategory(activeCategory.name, '');
                      onClose();
                    }}
                    className="px-6 py-2.5 text-xs text-[#c45500] font-bold hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                  >
                    <span>View All {activeCategory.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>

                  {activeCategory.subCategories.map((sub, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        onSelectSubCategory(activeCategory.name, sub);
                        onClose();
                      }}
                      className="px-6 py-2.5 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <span>{sub}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Main Category List View
              <div className="py-3">
                <div className="px-6 py-2 text-xs font-bold uppercase tracking-wider text-gray-800">
                  Enterprise Security Categories
                </div>

                <div className="divide-y divide-gray-100">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setActiveCategory(cat)}
                      className="px-6 py-3 text-xs text-gray-800 hover:bg-gray-100 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        {ICON_MAP[cat.featuredIcon] || <ShoppingBag className="w-4 h-4 text-gray-500" />}
                        <span className="font-medium group-hover:text-[#c45500]">{cat.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </div>
                  ))}
                </div>

                {/* Additional Quick Navigation */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="px-6 py-2 text-xs font-bold uppercase tracking-wider text-gray-800">
                    Programs & Features
                  </div>
                  <div
                    onClick={() => {
                      onNavigateAdmin();
                      onClose();
                    }}
                    className="px-6 py-2.5 text-xs text-amber-700 font-semibold hover:bg-amber-50 cursor-pointer flex items-center justify-between"
                  >
                    <span>Admin Technical Dashboard</span>
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                  </div>
                  <div
                    onClick={() => {
                      onSelectSubCategory('Renewable Energy', '');
                      onClose();
                    }}
                    className="px-6 py-2.5 text-xs text-green-700 font-medium hover:bg-green-50 cursor-pointer flex items-center justify-between"
                  >
                    <span>Industrial Solar & LiFePO4 Inverters</span>
                    <Sun className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
