import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import * as XLSX from 'xlsx';
import { createServer as createViteServer } from 'vite';

import {
  initializeStorage,
  getPublicProducts,
  getProductById,
  getAdminProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  processBulkUpload,
  registerUser,
  verifyUserCredentials,
  findUserById,
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getAdminDashboardStats
} from './server/storage.ts';

import { PRODUCT_CATEGORIES } from './src/data/categories.ts';
import { BulkUploadRow, Order } from './src/types.ts';

const app = express();
const PORT = 3000;

// High body limit to support bulk upload of thousands of products
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ extended: true, limit: '150mb' }));
app.use(cors());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET || 'secstore-secure-jwt-key-2026';

// Initialize storage & database
initializeStorage().catch(err => console.error('Storage init error:', err));

// Auth Middleware Helper
function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; email: string };
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired authentication token' });
  }
}

// Admin Auth Middleware Helper
function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : req.cookies?.admin_token;

  if (!token) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; email: string };
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admin privileges required' });
    }
    (req as any).admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired admin session' });
  }
}

// ---------------- API ROUTES ----------------

// 1. App Configuration & Exchange Rate (parsed dynamically from env)
app.get('/api/config', (req: Request, res: Response) => {
  const usdToNgnRate = Number(process.env.USD_TO_NGN_RATE || 1550);
  const paystackPublicKey = process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_demo_secstore_public_key';
  const supabaseConfigured = Boolean(process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project'));

  res.json({
    usdToNgnRate,
    paystackPublicKey,
    supabaseConfigured,
    currencySymbolUSD: '$',
    currencySymbolNGN: '₦'
  });
});

// 2. Categories & Subcategories (16 Official Categories)
app.get('/api/categories', (req: Request, res: Response) => {
  res.json({
    categories: PRODUCT_CATEGORIES
  });
});

// 3. Public Products Listing
// User strict requirement: "The total number of products will not be displayed to the public, but will be displayed at the admin dashboard."
app.get('/api/products', (req: Request, res: Response) => {
  const { page, limit, category, subCategory, search, sortBy, minPrice, maxPrice, brand } = req.query;

  const result = getPublicProducts({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 24,
    category: category as string,
    subCategory: subCategory as string,
    search: search as string,
    sortBy: sortBy as any,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    brand: brand as string
  });

  // Note: result only includes items, page, limit, hasNextPage, hasPrevPage (NO total count exposed to public!)
  res.json(result);
});

// 4. Product Details
app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// 5. Customer Authentication
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const user = registerUser(name, email, password);
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 3600 * 1000 });
    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = verifyUserCredentials(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 3600 * 1000 });
  res.json({ user, token });
});

app.get('/api/auth/me', authenticateUser, (req: Request, res: Response) => {
  const user = findUserById((req as any).user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// 6. Admin Authentication
// Strictly accessed through Technical Email ID and Access Key from Environment Variables
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { technicalEmail, accessKey } = req.body;

  // Sensitive environment variables parsed on the server:
  const configuredAdminEmail = process.env.ADMIN_TECHNICAL_EMAIL || 'admin@enterprise.sec';
  const configuredAdminKey = process.env.ADMIN_ACCESS_KEY || 'SEC_ADMIN_KEY_8892';

  if (!technicalEmail || !accessKey) {
    return res.status(400).json({ error: 'Technical Email ID and Access Key are required' });
  }

  // Strict credential comparison
  if (
    technicalEmail.trim().toLowerCase() !== configuredAdminEmail.trim().toLowerCase() ||
    accessKey.trim() !== configuredAdminKey.trim()
  ) {
    return res.status(401).json({ error: 'Invalid Technical Email ID or Access Key' });
  }

  const adminToken = jwt.sign(
    { id: 'admin-master', email: configuredAdminEmail, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.cookie('admin_token', adminToken, { httpOnly: true, maxAge: 24 * 3600 * 1000 });
  res.json({
    success: true,
    token: adminToken,
    admin: {
      email: configuredAdminEmail,
      role: 'admin'
    }
  });
});

app.get('/api/admin/verify', authenticateAdmin, (req: Request, res: Response) => {
  res.json({
    valid: true,
    admin: (req as any).admin
  });
});

app.post('/api/admin/logout', (req: Request, res: Response) => {
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Admin logged out' });
});

// 7. Admin Dashboard Stats
// Total number of products displayed at the admin dashboard!
app.get('/api/admin/stats', authenticateAdmin, (req: Request, res: Response) => {
  const stats = getAdminDashboardStats();
  res.json(stats);
});

// 8. Admin Products Management
app.get('/api/admin/products', authenticateAdmin, (req: Request, res: Response) => {
  const { page, limit, category, subCategory, search } = req.query;
  const result = getAdminProducts({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 25,
    category: category as string,
    subCategory: subCategory as string,
    search: search as string
  });
  res.json(result);
});

app.post('/api/admin/products', authenticateAdmin, (req: Request, res: Response) => {
  const product = addProduct(req.body);
  res.status(201).json(product);
});

app.put('/api/admin/products/:id', authenticateAdmin, (req: Request, res: Response) => {
  const updated = updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(updated);
});

app.delete('/api/admin/products/:id', authenticateAdmin, (req: Request, res: Response) => {
  const deleted = deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, message: 'Product removed' });
});

// Helper: Robust RFC-4180 CSV parser supporting BOM, multiline quoted fields, and delimiter auto-detection
function parseCsvContent(text: string): Record<string, any>[] {
  let cleanText = text;
  if (cleanText.charCodeAt(0) === 0xFEFF) {
    cleanText = cleanText.slice(1);
  }

  // Detect delimiter from first non-empty line
  const firstNewline = cleanText.indexOf('\n');
  const firstLine = firstNewline !== -1 ? cleanText.slice(0, firstNewline) : cleanText;
  let delimiter = ',';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  if (semicolonCount > commaCount && semicolonCount > tabCount) {
    delimiter = ';';
  } else if (tabCount > commaCount && tabCount > semicolonCount) {
    delimiter = '\t';
  }

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  const len = cleanText.length;

  for (let i = 0; i < len; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      row.push(cell.trim());
      cell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(cell.trim());
      if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
        rows.push(row);
      }
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (cell !== '' || row.length > 0) {
    row.push(cell.trim());
    if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
      rows.push(row);
    }
  }

  if (rows.length === 0) return [];

  const headerRow = rows[0].map(h => h.replace(/^["']|["']$/g, '').trim());
  const dataRows: Record<string, any>[] = [];

  for (let r = 1; r < rows.length; r++) {
    const rValues = rows[r];
    if (rValues.length === 0 || (rValues.length === 1 && !rValues[0])) continue;
    const obj: Record<string, any> = {};
    for (let c = 0; c < headerRow.length; c++) {
      const headerKey = headerRow[c] || `col_${c}`;
      obj[headerKey] = rValues[c] !== undefined ? rValues[c] : '';
    }
    dataRows.push(obj);
  }

  return dataRows;
}

// 9. Bulk Product Upload (Excel / CSV parsing with zero truncation)
app.post('/api/admin/products/bulk-upload', authenticateAdmin, (req: Request, res: Response) => {
  try {
    const { fileData, csvText, defaultCategory, replaceCategory, action } = req.body;

    if (!fileData && !csvText) {
      return res.status(400).json({ error: 'Missing fileData or csvText in request body' });
    }

    let rawRows: any[] = [];

    // Mode A: Direct raw CSV/TSV text
    if (csvText && typeof csvText === 'string') {
      rawRows = parseCsvContent(csvText);
    } else if (fileData) {
      // Mode B: File buffer (Base64 data URL or pure Base64)
      const base64Content = fileData.includes(',') ? fileData.split(',')[1] : fileData;
      const buffer = Buffer.from(base64Content, 'base64');

      // Check if file is a ZIP-based Excel (.xlsx) or OLE-based (.xls)
      const isZip = buffer.length > 4 && buffer[0] === 0x50 && buffer[1] === 0x4B;
      const isOle = buffer.length > 4 && buffer[0] === 0xD0 && buffer[1] === 0xCF;

      if (isZip || isOle) {
        const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true, raw: false });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          return res.status(400).json({ error: 'Excel file contains no worksheets.' });
        }
        const sheet = workbook.Sheets[sheetName];
        rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      } else {
        // Plain text CSV or TSV
        const text = buffer.toString('utf8');
        rawRows = parseCsvContent(text);
        if (rawRows.length === 0) {
          // Fallback to xlsx parser if custom parser found no rows
          try {
            const wb = XLSX.read(buffer, { type: 'buffer' });
            const sName = wb.SheetNames[0];
            if (sName) {
              rawRows = XLSX.utils.sheet_to_json(wb.Sheets[sName], { defval: '' });
            }
          } catch {}
        }
      }
    }

    if (!rawRows || rawRows.length === 0) {
      return res.status(400).json({ error: 'The uploaded file or text contains no valid product rows.' });
    }

    // Map columns flexibly (handles common header variations across industry spreadsheets)
    const normalizedRows: BulkUploadRow[] = rawRows.map(row => {
      const getVal = (...keys: string[]) => {
        for (const k of keys) {
          if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') return row[k];
          // case-insensitive check
          const found = Object.keys(row).find(rk => rk.trim().toLowerCase() === k.trim().toLowerCase());
          if (found && row[found] !== undefined && row[found] !== null && String(row[found]).trim() !== '') return row[found];
        }
        return '';
      };

      const hasPriceVal = getVal('HasPrice', 'Has Price', 'has_price', 'PriceAvailable');
      const pricingTypeVal = getVal('PricingType', 'Pricing Type', 'pricing_type', 'Pricing Model');
      const rawPrice = getVal('PriceUSD', 'Price ($)', 'Price', 'price', 'Unit Price', 'unit_price');

      return {
        name: String(getVal('Name', 'Product Name', 'product_name', 'Title', 'item_name') || ''),
        sku: String(getVal('SKU', 'sku', 'Item Number', 'Model Number', 'Model', 'Part Number') || ''),
        category: String(getVal('Category', 'category', 'Product Category') || defaultCategory || ''),
        subCategory: String(getVal('SubCategory', 'Sub Category', 'sub_category', 'Sub-Category') || ''),
        hasPrice: hasPriceVal !== '' ? hasPriceVal : undefined,
        pricingType: pricingTypeVal ? (String(pricingTypeVal).toLowerCase().includes('quote') ? 'quote' : 'fixed') : undefined,
        priceUSD: rawPrice !== '' && rawPrice !== null ? Number(rawPrice) : undefined,
        stockQuantity: Number(getVal('StockQuantity', 'Stock', 'Quantity', 'stock_quantity', 'Qty') || 15),
        brand: String(getVal('Brand', 'brand', 'Manufacturer') || 'Enterprise OEM'),
        description: String(getVal('Description', 'description', 'Details') || ''),
        features: String(getVal('Features', 'features', 'Key Features') || ''),
        imageUrl: String(getVal('ImageUrl', 'Image URL', 'image_url', 'Photo', 'Image') || '')
      };
    });

    const result = processBulkUpload(normalizedRows, {
      defaultCategory: typeof defaultCategory === 'string' ? defaultCategory : undefined,
      replaceCategory: typeof replaceCategory === 'string' ? replaceCategory : undefined,
      action: action || (replaceCategory ? 'replace_category' : 'append')
    });

    res.json({
      success: true,
      message: `Successfully uploaded ${result.uploaded} products to catalogue with zero truncation (all ${result.totalRows} rows processed).`,
      totalRowsInFile: result.totalRows,
      uploadedCount: result.uploaded,
      failedCount: result.failed,
      errors: result.errors,
      totalCatalogSize: result.totalProducts,
      replacedCategory: result.replacedCategory
    });
  } catch (err: any) {
    console.error('Bulk upload error:', err);
    res.status(500).json({ error: 'Failed to process bulk upload: ' + err.message });
  }
});

// 10. Download Sample Excel Template for Bulk Upload
app.get('/api/admin/products/template', (req: Request, res: Response) => {
  try {
    const sampleRows = [
      {
        'Name': 'Axis M3075-V 4MP Mini Dome Camera with Wide Dynamic Range',
        'SKU': 'AXIS-M3075-V',
        'Category': 'Video Surveillance & Cameras',
        'SubCategory': 'Dome Cameras',
        'HasPrice': 'Yes',
        'PricingType': 'fixed',
        'PriceUSD': 349.00,
        'StockQuantity': 50,
        'Brand': 'Axis Communications',
        'Description': 'Compact 4MP mini dome camera for indoor retail and commercial monitoring with WDR and Lightfinder. Fixed price checkout available.',
        'Features': '4MP Quad HD resolution; Wide Dynamic Range; Forensic capture; Edge storage support',
        'ImageUrl': 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'
      },
      {
        'Name': 'Cisco CBS350-24P-4G 24-Port Managed Gigabit PoE Switch 195W',
        'SKU': 'CISCO-CBS350-24P',
        'Category': 'Networking & Connectivity',
        'SubCategory': 'PoE Switches',
        'HasPrice': 'Yes',
        'PricingType': 'fixed',
        'PriceUSD': 620.00,
        'StockQuantity': 30,
        'Brand': 'Cisco',
        'Description': 'Business 350 series 24-port PoE managed switch with 4 Gigabit SFP combo uplink ports. Fixed price checkout available.',
        'Features': '24 Gigabit PoE ports; 195W power budget; Layer 2 and Layer 3 routing; Intuitive dashboard',
        'ImageUrl': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
      },
      {
        'Name': 'FLIR Ranger HRC High-Definition Long-Range Thermal Bi-Spectral Radar PTZ',
        'SKU': 'FLIR-HRC-RADAR',
        'Category': 'Video Surveillance & Cameras',
        'SubCategory': 'Thermal & Specialty Cameras',
        'HasPrice': 'No',
        'PricingType': 'quote',
        'PriceUSD': '',
        'StockQuantity': 5,
        'Brand': 'Teledyne FLIR',
        'Description': 'Military-grade high-definition cooled thermal surveillance with integrated radar slew-to-cue. Requires custom quotation and export licensing.',
        'Features': 'Cooled MWIR thermal detector; 20 km vehicle detection; Integrated perimeter radar interface; Military MIL-STD-810G',
        'ImageUrl': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'
      },
      {
        'Name': 'Modular Megawatt Microgrid Container BESS Solar Battery Storage',
        'SKU': 'SPINEL-BESS-1MWH',
        'Category': 'Renewable Energy',
        'SubCategory': 'Lithium Battery Storage',
        'HasPrice': 'No',
        'PricingType': 'quote',
        'PriceUSD': '',
        'StockQuantity': 3,
        'Brand': 'Spinel Power Systems',
        'Description': 'Industrial 1MWh ISO containerized energy storage system with liquid thermal management, fire suppression, and grid-forming inverters. Requires tailored quote.',
        'Features': '1MWh LiFePO4 chemistry; 6000 cycle life at 90% DOD; Built-in HVAC and aerosol suppression; SCADA EMS connectivity',
        'ImageUrl': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
      }
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sampleRows);

    // Set column widths
    ws['!cols'] = [
      { wch: 45 }, // Name
      { wch: 18 }, // SKU
      { wch: 32 }, // Category
      { wch: 25 }, // SubCategory
      { wch: 12 }, // HasPrice
      { wch: 14 }, // PricingType
      { wch: 12 }, // PriceUSD
      { wch: 14 }, // StockQuantity
      { wch: 22 }, // Brand
      { wch: 40 }, // Description
      { wch: 45 }, // Features
      { wch: 40 }  // ImageUrl
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Products_Template');

    // Add category reference sheet
    const catRows = PRODUCT_CATEGORIES.map(cat => ({
      'Category Name': cat.name,
      'Available Sub-Categories': cat.subCategories.join(', ')
    }));
    const catWs = XLSX.utils.json_to_sheet(catRows);
    catWs['!cols'] = [{ wch: 35 }, { wch: 70 }];
    XLSX.utils.book_append_sheet(wb, catWs, 'Categories_Reference');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Spinel_Bulk_Products_Template.xlsx"');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate template: ' + err.message });
  }
});

// 11. Customer Orders
app.post('/api/orders', (req: Request, res: Response) => {
  const { customerName, customerEmail, shippingAddress, items, currency, paymentMethod, paystackReference } = req.body;

  if (!customerName || !customerEmail || !items || !items.length || !shippingAddress) {
    return res.status(400).json({ error: 'Incomplete order payload' });
  }

  const rate = Number(process.env.USD_TO_NGN_RATE || 1550);
  const selectedCurrency = currency === 'NGN' ? 'NGN' : 'USD';

  // Calculate totals
  let subtotalUSD = 0;
  for (const it of items) {
    subtotalUSD += (Number(it.priceUSD) || 0) * (Number(it.quantity) || 1);
  }

  const shippingFeeUSD = subtotalUSD > 1000 ? 0 : 49.00; // Free enterprise freight over $1,000
  const taxUSD = Math.round(subtotalUSD * 0.075 * 100) / 100; // 7.5% commercial VAT
  const totalUSD = Math.round((subtotalUSD + shippingFeeUSD + taxUSD) * 100) / 100;

  const subtotalNGN = Math.round(subtotalUSD * rate);
  const totalNGN = Math.round(totalUSD * rate);

  // Determine user ID from auth token if present
  let userId = 'guest';
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.substring(7), JWT_SECRET) as any;
      if (decoded && decoded.id) userId = decoded.id;
    } catch (_) {}
  }

  const newOrder = createOrder({
    userId,
    customerName,
    customerEmail,
    shippingAddress,
    items,
    currency: selectedCurrency,
    exchangeRate: rate,
    subtotalUSD,
    subtotalNGN,
    shippingFeeUSD,
    taxUSD,
    totalUSD,
    totalNGN,
    paymentMethod: paymentMethod || 'paystack',
    paymentStatus: paystackReference ? 'paid' : 'pending',
    orderStatus: 'Pending',
    paystackReference,
    estimatedDelivery: new Date(Date.now() + 3600000 * 24 * 4).toISOString()
  });

  res.status(201).json(newOrder);
});

app.get('/api/orders', (req: Request, res: Response) => {
  const { email, userId } = req.query;
  const orders = getUserOrders(userId as string, email as string);
  res.json({ orders });
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// 12. Admin Orders Management
app.get('/api/admin/orders', authenticateAdmin, (req: Request, res: Response) => {
  const orders = getAllOrders();
  res.json({ orders });
});

app.patch('/api/admin/orders/:id/status', authenticateAdmin, (req: Request, res: Response) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = updateOrderStatus(req.params.id, orderStatus, paymentStatus);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// 13. Paystack Payment Integration
// User requirement: "use Paystack for live payment"
app.post('/api/paystack/initialize', async (req: Request, res: Response) => {
  try {
    const { email, amountUSD, orderId } = req.body;
    if (!email || !amountUSD) {
      return res.status(400).json({ error: 'Email and amount are required' });
    }

    const rate = Number(process.env.USD_TO_NGN_RATE || 1550);
    // Convert USD to NGN, and then to Kobo (Paystack uses kobo: 1 NGN = 100 Kobo)
    const amountInNGN = Math.round(Number(amountUSD) * rate);
    const amountInKobo = amountInNGN * 100;
    const reference = 'PSTK_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const isRealKey = paystackSecret && paystackSecret.startsWith('sk_') && !paystackSecret.includes('xxxx');

    if (isRealKey) {
      // Direct call to Paystack API
      try {
        const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${paystackSecret}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            amount: amountInKobo,
            reference,
            currency: 'NGN',
            metadata: {
              orderId,
              amountUSD,
              exchangeRate: rate
            }
          })
        });

        const data = await paystackResponse.json();
        if (data.status) {
          return res.json({
            status: true,
            authorization_url: data.data.authorization_url,
            access_code: data.data.access_code,
            reference: data.data.reference,
            amountInNGN,
            amountInKobo,
            exchangeRate: rate
          });
        }
      } catch (apiErr: any) {
        console.warn('Paystack live API call returned error, serving fallback:', apiErr.message);
      }
    }

    // Client-side Paystack standard popup reference & fallback
    res.json({
      status: true,
      reference,
      amountInNGN,
      amountInKobo,
      exchangeRate: rate,
      paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_demo_secstore_public_key',
      message: 'Paystack transaction reference initialized.'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to initialize Paystack: ' + err.message });
  }
});

app.post('/api/paystack/verify', async (req: Request, res: Response) => {
  try {
    const { reference, orderId } = req.body;
    if (!reference) {
      return res.status(400).json({ error: 'Reference is required' });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const isRealKey = paystackSecret && paystackSecret.startsWith('sk_') && !paystackSecret.includes('xxxx');

    let verified = false;

    if (isRealKey) {
      try {
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${paystackSecret}`
          }
        });
        const data = await verifyRes.json();
        if (data.status && data.data.status === 'success') {
          verified = true;
        }
      } catch (err) {
        console.warn('Live Paystack verify check exception, falling back:', err);
      }
    } else {
      // Test/demo mode verification
      verified = true;
    }

    if (verified && orderId) {
      updateOrderStatus(orderId, 'Processing', 'paid');
    }

    res.json({
      verified,
      reference,
      orderId,
      status: verified ? 'success' : 'failed'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to verify transaction: ' + err.message });
  }
});

// ---------------- VITE MIDDLEWARE & SPA SETUP ----------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Spinel Distribution Server running at http://0.0.0.0:${PORT}`);
  });
}

start();
