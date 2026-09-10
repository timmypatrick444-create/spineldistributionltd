import fs from 'fs';
import path from 'path';

const csvPath = path.join(process.cwd(), 'data', 'new_cameras.csv');
const productsPath = path.join(process.cwd(), 'data', 'products.json');

// Parse CSV manually with proper quoted string handling
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = values[idx] !== undefined ? values[idx] : '';
    });
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

if (!fs.existsSync(csvPath)) {
  console.error("CSV file not found:", csvPath);
  process.exit(1);
}

const csvText = fs.readFileSync(csvPath, 'utf8');
const rows = parseCSV(csvText);
console.log(`Parsed ${rows.length} rows from CSV`);

// Read current products
let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const initialCount = products.length;

// Filter out old "Video Surveillance & Cameras" products
products = products.filter(p => p.category !== 'Video Surveillance & Cameras');
console.log(`Filtered out Video Surveillance products. Remaining: ${products.length} (removed ${initialCount - products.length})`);

const now = new Date().toISOString();

// Convert CSV rows to Product objects
const newProducts = rows.map((r, index) => {
  const price = parseFloat(r.PriceUSD) || 0;
  const stock = parseInt(r.StockQuantity, 10) || 10;
  const hasPrice = (r.HasPrice || '').toLowerCase() !== 'no';
  const pricingType = (r.PricingType || '').toLowerCase() === 'quote' ? 'quote' : 'fixed';
  
  const featureList = r.Features
    ? r.Features.split(';').map(f => f.trim()).filter(Boolean)
    : [r.Name];

  return {
    id: `prod-cam-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
    name: r.Name || 'Pelco Camera',
    sku: r.SKU || `SKU-PELCO-${index}`,
    category: 'Video Surveillance & Cameras',
    subCategory: r.SubCategory || 'Specialty Cameras',
    hasPrice,
    pricingType,
    priceUSD: price,
    originalPriceUSD: price > 0 ? Math.round(price * 1.15) : undefined,
    rating: 4.8 + Math.round(Math.random() * 2) / 10,
    reviewsCount: Math.floor(12 + Math.random() * 85),
    inStock: stock > 0,
    stockQuantity: stock,
    brand: r.Brand || 'Pelco',
    description: r.Description || r.Name,
    features: featureList,
    specifications: {
      'Category': 'Video Surveillance & Cameras',
      'SubCategory': r.SubCategory || 'Specialty Cameras',
      'Brand': r.Brand || 'Pelco',
      'SKU': r.SKU || '',
      'Warranty': 'Manufacturer Standard'
    },
    imageUrl: r.ImageUrl || 'http://avoweb1.s3-us-west-2.amazonaws.com/Prod/PRODUCT%20MARKETING/ESPRIT-ANTI-COR-PTZ-020323.png',
    badge: price > 5000 ? 'Enterprise Certified' : 'Spinel\'s Choice',
    isPrimeEligible: true,
    freeDelivery: true,
    warrantyYears: 3,
    createdAt: now
  };
});

// Prepend new products
products.unshift(...newProducts);

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
console.log(`Successfully added ${newProducts.length} new products. Total catalog size: ${products.length}`);
