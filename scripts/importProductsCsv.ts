import fs from 'fs';
import path from 'path';
import { processBulkUpload } from '../server/storage.ts';
import { BulkUploadRow } from '../src/types.ts';

function parseCsv(text: string): BulkUploadRow[] {
  let cleanText = text;
  if (cleanText.charCodeAt(0) === 0xFEFF) {
    cleanText = cleanText.slice(1);
  }

  // Detect delimiter
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

  const headers = rows[0].map(h => h.replace(/^["']|["']$/g, '').trim());
  const results: BulkUploadRow[] = [];

  for (let r = 1; r < rows.length; r++) {
    const rValues = rows[r];
    if (rValues.length === 0 || (rValues.length === 1 && !rValues[0])) continue;

    const getVal = (...keys: string[]) => {
      for (const k of keys) {
        const idx = headers.findIndex(h => h.toLowerCase() === k.toLowerCase());
        if (idx !== -1 && rValues[idx] !== undefined && rValues[idx] !== '') {
          return rValues[idx];
        }
      }
      return '';
    };

    const hasPriceVal = getVal('HasPrice', 'Has Price', 'has_price', 'PriceAvailable');
    const pricingTypeVal = getVal('PricingType', 'Pricing Type', 'pricing_type', 'Pricing Model');
    const rawPrice = getVal('PriceUSD', 'Price ($)', 'Price', 'price', 'Unit Price');

    results.push({
      name: String(getVal('Name', 'Product Name', 'product_name', 'Title') || ''),
      sku: String(getVal('SKU', 'sku', 'Item Number', 'Model Number') || ''),
      category: String(getVal('Category', 'category', 'Product Category') || 'Video Surveillance & Cameras'),
      subCategory: String(getVal('SubCategory', 'Sub Category', 'sub_category') || 'General Equipment'),
      hasPrice: hasPriceVal !== '' ? hasPriceVal : undefined,
      pricingType: pricingTypeVal ? (String(pricingTypeVal).toLowerCase().includes('quote') ? 'quote' : 'fixed') : undefined,
      priceUSD: rawPrice !== '' && rawPrice !== null ? Number(rawPrice) : undefined,
      stockQuantity: Number(getVal('StockQuantity', 'Stock', 'Quantity', 'stock_quantity') || 15),
      brand: String(getVal('Brand', 'brand', 'Manufacturer') || 'Enterprise OEM'),
      description: String(getVal('Description', 'description', 'Details') || ''),
      features: String(getVal('Features', 'features', 'Key Features') || ''),
      imageUrl: String(getVal('ImageUrl', 'Image URL', 'image_url', 'Photo') || '')
    });
  }

  return results;
}

// Check arguments or look for any .csv file in current directory
const targetFile = process.argv[2] || (fs.readdirSync('.').find(f => f.endsWith('.csv')));

if (!targetFile || !fs.existsSync(targetFile)) {
  console.log('No CSV file specified or found. Place your CSV file in the project folder (e.g. products.csv) and run this script.');
  process.exit(1);
}

console.log(`Processing file: ${targetFile}...`);
const fileContent = fs.readFileSync(targetFile, 'utf8');
const rows = parseCsv(fileContent);
console.log(`Parsed ${rows.length} product rows from ${targetFile}.`);

const result = processBulkUpload(rows, {
  defaultCategory: 'Video Surveillance & Cameras',
  action: 'append'
});

console.log('=== Upload Complete ===');
console.log(`Uploaded successfully: ${result.uploaded}`);
console.log(`Failed / skipped: ${result.failed}`);
console.log(`Total catalogue size now: ${result.totalProducts}`);
