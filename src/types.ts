export type Currency = 'USD' | 'NGN';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  subCategory: string;
  priceUSD: number;
  originalPriceUSD?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockQuantity: number;
  description: string;
  brand: string;
  features: string[];
  specifications: Record<string, string>;
  imageUrl: string;
  galleryImages?: string[];
  badge?: 'Best Seller' | "Amazon's Choice" | 'Prime Deal' | 'Enterprise Certified' | 'New';
  isPrimeEligible?: boolean;
  freeDelivery?: boolean;
  warrantyYears?: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  priceUSD: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  currency: Currency;
  exchangeRate: number;
  subtotalUSD: number;
  subtotalNGN: number;
  shippingFeeUSD: number;
  taxUSD: number;
  totalUSD: number;
  totalNGN: number;
  paymentMethod: 'paystack' | 'card' | 'bank_transfer';
  paymentStatus: 'paid' | 'pending' | 'failed';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';
  paystackReference?: string;
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  estimatedDelivery: string;
}

export interface AdminStats {
  totalProducts: number;
  totalCategories: number;
  totalSubCategories: number;
  outOfStockCount: number;
  totalOrders: number;
  totalRevenueUSD: number;
  totalRevenueNGN: number;
  pendingOrdersCount: number;
  completedOrdersCount: number;
}

export interface BulkUploadRow {
  name: string;
  sku?: string;
  category: string;
  subCategory: string;
  priceUSD: number;
  stockQuantity: number;
  brand: string;
  description: string;
  features?: string;
  imageUrl?: string;
}

export interface BulkUploadResponse {
  success: boolean;
  message: string;
  uploadedCount: number;
  failedCount: number;
  errors?: string[];
  totalCatalogSize: number;
}
