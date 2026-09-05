import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { Product, User, Order, AdminStats, BulkUploadRow } from '../src/types.ts';
import { SEED_PRODUCTS } from '../src/data/seedProducts.ts';
import { PRODUCT_CATEGORIES } from '../src/data/categories.ts';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory active stores
let productsStore: Product[] = [];
let usersStore: (User & { passwordHash: string })[] = [];
let ordersStore: Order[] = [];

// Initialize Supabase client if configured
let supabase: SupabaseClient | null = null;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase Client initialized successfully');
  } catch (err) {
    console.warn('⚠️ Failed to initialize Supabase, falling back to local persistent store:', err);
  }
} else {
  console.log('ℹ️ Supabase credentials not set or placeholder; running on resilient persistent storage.');
}

// Load or seed products
export async function initializeStorage() {
  // Load products
  if (fs.existsSync(PRODUCTS_FILE)) {
    try {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
      productsStore = JSON.parse(data);
      console.log(`Loaded ${productsStore.length} products from local persistence.`);
    } catch (e) {
      console.error('Failed to parse products file, seeding defaults:', e);
      productsStore = [...SEED_PRODUCTS];
      saveProductsToFile();
    }
  } else {
    productsStore = [...SEED_PRODUCTS];
    saveProductsToFile();
    console.log(`Seeded ${productsStore.length} initial products.`);
  }

  // Load users
  if (fs.existsSync(USERS_FILE)) {
    try {
      usersStore = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    } catch (e) {
      usersStore = [];
    }
  } else {
    // Seed a demo customer account
    const demoPasswordHash = bcrypt.hashSync('Customer123!', 10);
    usersStore = [
      {
        id: 'usr-demo-01',
        name: 'Enterprise Security Director',
        email: 'director@enterprisesec.org',
        passwordHash: demoPasswordHash,
        role: 'customer',
        createdAt: new Date().toISOString()
      }
    ];
    saveUsersToFile();
  }

  // Load orders
  if (fs.existsSync(ORDERS_FILE)) {
    try {
      ordersStore = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
    } catch (e) {
      ordersStore = [];
    }
  } else {
    // Seed initial orders for demonstration
    ordersStore = [
      {
        id: 'ord-1001',
        orderNumber: 'SEC-2026-98124',
        userId: 'usr-demo-01',
        customerName: 'Enterprise Security Director',
        customerEmail: 'director@enterprisesec.org',
        shippingAddress: {
          fullName: 'Enterprise Security Director',
          street: '100 Cyber Security Parkway, Suite 400',
          city: 'Houston',
          state: 'TX',
          country: 'United States',
          postalCode: '77001',
          phone: '+1 (555) 349-8800'
        },
        items: [
          {
            productId: 'prod-cam-01',
            name: 'AXIS Q1656-LE 4MP Ultra-Low Light Box Camera with Lightfinder 2.0',
            sku: 'AXIS-Q1656-LE',
            priceUSD: 1489.00,
            quantity: 2,
            imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80'
          },
          {
            productId: 'prod-net-01',
            name: 'Cisco Catalyst 9300 48-Port PoE+ Gigabit Managed Switch',
            sku: 'CISCO-C9300-48P-A',
            priceUSD: 3890.00,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
          }
        ],
        currency: 'USD',
        exchangeRate: Number(process.env.USD_TO_NGN_RATE || 1550),
        subtotalUSD: 6868.00,
        subtotalNGN: 6868.00 * Number(process.env.USD_TO_NGN_RATE || 1550),
        shippingFeeUSD: 0,
        taxUSD: 549.44,
        totalUSD: 7417.44,
        totalNGN: 7417.44 * Number(process.env.USD_TO_NGN_RATE || 1550),
        paymentMethod: 'paystack',
        paymentStatus: 'paid',
        orderStatus: 'Shipped',
        paystackReference: 'PSTK_DEMO_REF_98124',
        trackingNumber: 'FEDEX-EXP-889921094',
        carrier: 'FedEx Priority Freight',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        estimatedDelivery: new Date(Date.now() + 3600000 * 24).toISOString()
      }
    ];
    saveOrdersToFile();
  }

  // Attempt sync with Supabase if active
  if (supabase) {
    try {
      const { data: supaProducts } = await supabase.from('products').select('*').limit(10);
      if (supaProducts && supaProducts.length > 0) {
        console.log(`Connected to Supabase. Found ${supaProducts.length} cloud records.`);
      }
    } catch (err) {
      console.warn('Supabase ping check:', err);
    }
  }
}

function saveProductsToFile() {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(productsStore, null, 2), 'utf-8');
}

function saveUsersToFile() {
  fs.writeFileSync(USERS_FILE, JSON.stringify(usersStore, null, 2), 'utf-8');
}

function saveOrdersToFile() {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(ordersStore, null, 2), 'utf-8');
}

// ---------------- PRODUCTS OPERATIONS ----------------

export interface ProductQueryOptions {
  page?: number;
  limit?: number;
  category?: string;
  subCategory?: string;
  search?: string;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
}

export function getPublicProducts(options: ProductQueryOptions) {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(60, Math.max(1, Number(options.limit) || 20));

  let filtered = [...productsStore];

  if (options.category) {
    const catLower = options.category.toLowerCase().trim();
    filtered = filtered.filter(p => p.category.toLowerCase().trim() === catLower);
  }

  if (options.subCategory) {
    const subLower = options.subCategory.toLowerCase().trim();
    filtered = filtered.filter(p => p.subCategory.toLowerCase().trim() === subLower);
  }

  if (options.brand) {
    const brandLower = options.brand.toLowerCase().trim();
    filtered = filtered.filter(p => p.brand.toLowerCase().trim() === brandLower);
  }

  if (options.search) {
    const q = options.search.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subCategory.toLowerCase().includes(q)
    );
  }

  if (options.minPrice !== undefined && !isNaN(options.minPrice)) {
    filtered = filtered.filter(p => p.priceUSD >= options.minPrice!);
  }

  if (options.maxPrice !== undefined && !isNaN(options.maxPrice)) {
    filtered = filtered.filter(p => p.priceUSD <= options.maxPrice!);
  }

  // Sorting
  if (options.sortBy === 'price-asc') {
    filtered.sort((a, b) => a.priceUSD - b.priceUSD);
  } else if (options.sortBy === 'price-desc') {
    filtered.sort((a, b) => b.priceUSD - a.priceUSD);
  } else if (options.sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (options.sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const startIndex = (page - 1) * limit;
  const items = filtered.slice(startIndex, startIndex + limit);
  const hasNextPage = startIndex + limit < filtered.length;

  // IMPORTANT: Strict constraint:
  // "The total number of products will not be displayed to the public, but will be displayed at the admin dashboard."
  return {
    items,
    page,
    limit,
    hasNextPage,
    hasPrevPage: page > 1
  };
}

export function getProductById(id: string): Product | undefined {
  return productsStore.find(p => p.id === id || p.sku === id);
}

// Admin only: Gets full catalog with exact totals
export function getAdminProducts(options: ProductQueryOptions) {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(options.limit) || 20));

  let filtered = [...productsStore];

  if (options.category) {
    filtered = filtered.filter(p => p.category === options.category);
  }
  if (options.subCategory) {
    filtered = filtered.filter(p => p.subCategory === options.subCategory);
  }
  if (options.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  }

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const items = filtered.slice(startIndex, startIndex + limit);

  return {
    items,
    page,
    limit,
    totalProducts: total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
}

export function addProduct(productData: Partial<Product>): Product {
  const newProduct: Product = {
    id: 'prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    name: productData.name || 'New Industrial Product',
    sku: productData.sku || 'SKU-' + Math.floor(100000 + Math.random() * 900000),
    category: productData.category || PRODUCT_CATEGORIES[0].name,
    subCategory: productData.subCategory || PRODUCT_CATEGORIES[0].subCategories[0],
    priceUSD: Number(productData.priceUSD) || 99.00,
    originalPriceUSD: productData.originalPriceUSD ? Number(productData.originalPriceUSD) : undefined,
    rating: 5.0,
    reviewsCount: 1,
    inStock: (productData.stockQuantity ?? 10) > 0,
    stockQuantity: Number(productData.stockQuantity ?? 10),
    brand: productData.brand || 'Enterprise OEM',
    description: productData.description || 'Enterprise security and hardware equipment.',
    features: productData.features || ['Industrial grade construction', 'Enterprise reliability'],
    specifications: productData.specifications || { 'Standard': 'Commercial Grade' },
    imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    badge: productData.badge,
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: productData.warrantyYears || 3,
    createdAt: new Date().toISOString()
  };

  productsStore.unshift(newProduct);
  saveProductsToFile();
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const index = productsStore.findIndex(p => p.id === id);
  if (index === -1) return null;

  const current = productsStore[index];
  const updated: Product = {
    ...current,
    ...updates,
    priceUSD: updates.priceUSD !== undefined ? Number(updates.priceUSD) : current.priceUSD,
    stockQuantity: updates.stockQuantity !== undefined ? Number(updates.stockQuantity) : current.stockQuantity,
    inStock: updates.stockQuantity !== undefined ? updates.stockQuantity > 0 : current.inStock
  };

  productsStore[index] = updated;
  saveProductsToFile();
  return updated;
}

export function deleteProduct(id: string): boolean {
  const initialLength = productsStore.length;
  productsStore = productsStore.filter(p => p.id !== id);
  if (productsStore.length !== initialLength) {
    saveProductsToFile();
    return true;
  }
  return false;
}

// Bulk Upload Process
export function processBulkUpload(rows: BulkUploadRow[]): { uploaded: number; failed: number; errors: string[]; totalProducts: number } {
  let uploaded = 0;
  let failed = 0;
  const errors: string[] = [];

  const categoryMap = new Map<string, string>();
  PRODUCT_CATEGORIES.forEach(c => {
    categoryMap.set(c.name.toLowerCase().trim(), c.name);
  });

  const now = new Date().toISOString();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // account for header row

    if (!row.name || !row.name.trim()) {
      errors.push(`Row ${rowNum}: Product Name is missing.`);
      failed++;
      continue;
    }

    if (!row.category || !row.category.trim()) {
      errors.push(`Row ${rowNum}: Category is missing.`);
      failed++;
      continue;
    }

    // Match or fallback category
    const matchedCategory = categoryMap.get(row.category.toLowerCase().trim()) || row.category.trim();

    // Check whether product has a fixed price or is quote-based
    const hasPriceRaw = String(row.hasPrice ?? '').trim().toLowerCase();
    const pricingTypeRaw = String(row.pricingType ?? '').trim().toLowerCase();
    const rawPriceStr = row.priceUSD !== undefined && row.priceUSD !== null ? String(row.priceUSD).trim() : '';

    const isExplicitlyQuote =
      hasPriceRaw === 'no' ||
      hasPriceRaw === 'false' ||
      hasPriceRaw === 'quote' ||
      pricingTypeRaw === 'quote' ||
      rawPriceStr === '' ||
      rawPriceStr === '0' ||
      rawPriceStr === 'quote';

    let hasPrice = !isExplicitlyQuote;
    let pricingType: 'fixed' | 'quote' = hasPrice ? 'fixed' : 'quote';
    let priceUSD: number | null = null;

    if (hasPrice) {
      const parsedPrice = Number(row.priceUSD);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        // If price is invalid but not marked as quote, treat as quote or flag error
        if (rawPriceStr === '') {
          hasPrice = false;
          pricingType = 'quote';
          priceUSD = null;
        } else {
          errors.push(`Row ${rowNum}: Price (${row.priceUSD}) is invalid.`);
          failed++;
          continue;
        }
      } else {
        priceUSD = parsedPrice;
      }
    }

    const stock = Number(row.stockQuantity);
    const stockQuantity = isNaN(stock) || stock < 0 ? 10 : stock;

    const sku = row.sku && row.sku.trim()
      ? row.sku.trim()
      : 'SKU-' + Math.floor(100000 + Math.random() * 900000);

    const featureList = row.features
      ? row.features.split(';').map(f => f.trim()).filter(Boolean)
      : ['Industrial durability', 'Certified security specification', 'High-performance chipset'];

    const newProd: Product = {
      id: 'prod-bulk-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7) + '-' + i,
      name: row.name.trim(),
      sku,
      category: matchedCategory,
      subCategory: row.subCategory?.trim() || 'General Equipment',
      hasPrice,
      pricingType,
      priceUSD,
      originalPriceUSD: priceUSD && priceUSD > 50 ? Math.round(priceUSD * 1.15) : undefined,
      rating: 4.8 + Math.round(Math.random() * 2) / 10,
      reviewsCount: Math.floor(10 + Math.random() * 80),
      inStock: stockQuantity > 0,
      stockQuantity,
      brand: row.brand?.trim() || 'Industrial Enterprise',
      description: row.description?.trim() || `${row.name} - high performance industrial enterprise grade equipment.`,
      features: featureList,
      specifications: {
        'Category': matchedCategory,
        'SubCategory': row.subCategory?.trim() || 'General',
        'Compliance': 'CE, FCC, RoHS, ISO9001',
        'Warranty': '3 Years Commercial'
      },
      imageUrl: row.imageUrl?.trim() || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
      badge: hasPrice ? (priceUSD && priceUSD > 1000 ? 'Enterprise Certified' : 'Best Seller') : 'Quote Required',
      isPrimeEligible: true,
      freeDelivery: true,
      warrantyYears: 3,
      createdAt: now
    };

    productsStore.unshift(newProd);
    uploaded++;
  }

  if (uploaded > 0) {
    saveProductsToFile();
  }

  return {
    uploaded,
    failed,
    errors: errors.slice(0, 20), // return first 20 errors to avoid payload bloat
    totalProducts: productsStore.length
  };
}

// ---------------- USERS OPERATIONS ----------------

export function findUserByEmail(email: string) {
  return usersStore.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
}

export function findUserById(id: string) {
  const u = usersStore.find(u => u.id === id);
  if (!u) return null;
  const { passwordHash, ...safeUser } = u;
  return safeUser;
}

export function registerUser(name: string, email: string, passwordPlain: string): User {
  const existing = findUserByEmail(email);
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const passwordHash = bcrypt.hashSync(passwordPlain, 10);
  const newUser = {
    id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    role: 'customer' as const,
    createdAt: new Date().toISOString()
  };

  usersStore.push(newUser);
  saveUsersToFile();

  const { passwordHash: _, ...safeUser } = newUser;
  return safeUser;
}

export function verifyUserCredentials(email: string, passwordPlain: string): User | null {
  const user = findUserByEmail(email);
  if (!user) return null;

  const valid = bcrypt.compareSync(passwordPlain, user.passwordHash);
  if (!valid) return null;

  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

// ---------------- ORDERS OPERATIONS ----------------

export function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
  const newOrder: Order = {
    ...orderData,
    id: 'ord-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    orderNumber: 'SEC-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000),
    createdAt: new Date().toISOString(),
    trackingNumber: 'TRK-' + Math.floor(100000000 + Math.random() * 900000000),
    carrier: 'Amazon Global Freight / DHL Express'
  };

  ordersStore.unshift(newOrder);
  saveOrdersToFile();

  // Deduct inventory
  for (const item of newOrder.items) {
    const prod = productsStore.find(p => p.id === item.productId);
    if (prod) {
      prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
      prod.inStock = prod.stockQuantity > 0;
    }
  }
  saveProductsToFile();

  return newOrder;
}

export function getUserOrders(userId?: string, email?: string): Order[] {
  return ordersStore.filter(o =>
    (userId && o.userId === userId) ||
    (email && o.customerEmail.toLowerCase() === email.toLowerCase())
  );
}

export function getOrderById(id: string): Order | undefined {
  return ordersStore.find(o => o.id === id || o.orderNumber === id);
}

export function getAllOrders(): Order[] {
  return [...ordersStore];
}

export function updateOrderStatus(id: string, status: Order['orderStatus'], paymentStatus?: Order['paymentStatus']): Order | null {
  const order = ordersStore.find(o => o.id === id || o.orderNumber === id);
  if (!order) return null;

  order.orderStatus = status;
  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }
  saveOrdersToFile();
  return order;
}

// ---------------- ADMIN STATS ----------------

export function getAdminDashboardStats(): AdminStats {
  const totalProducts = productsStore.length;
  const outOfStockCount = productsStore.filter(p => !p.inStock || p.stockQuantity <= 0).length;
  const totalOrders = ordersStore.length;
  const pendingOrdersCount = ordersStore.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;
  const completedOrdersCount = ordersStore.filter(o => o.orderStatus === 'Completed' || o.orderStatus === 'Shipped').length;

  const totalRevenueUSD = ordersStore
    .filter(o => o.paymentStatus === 'paid')
    .reduce((acc, curr) => acc + curr.totalUSD, 0);

  const rate = Number(process.env.USD_TO_NGN_RATE || 1550);
  const totalRevenueNGN = totalRevenueUSD * rate;

  const totalCategories = PRODUCT_CATEGORIES.length;
  const totalSubCategories = PRODUCT_CATEGORIES.reduce((acc, cat) => acc + cat.subCategories.length, 0);

  return {
    totalProducts,
    totalCategories,
    totalSubCategories,
    outOfStockCount,
    totalOrders,
    totalRevenueUSD: Math.round(totalRevenueUSD * 100) / 100,
    totalRevenueNGN: Math.round(totalRevenueNGN),
    pendingOrdersCount,
    completedOrdersCount
  };
}
