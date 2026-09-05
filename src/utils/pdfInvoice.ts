import { jsPDF } from 'jspdf';
import { Order, Currency } from '../types.ts';
import { formatPrice } from './currency.ts';

export function generateInvoicePDF(order: any, activeCurrency?: Currency, activeRate?: number) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const currency = order.currency || activeCurrency || 'USD';
  const exchangeRate = order.exchangeRate || activeRate || 1550;
  const orderRef = order.orderNumber || order.id || `ORD-${Date.now()}`;
  const customerName = order.customerName || 'Valued Commercial Client';
  const customerEmail = order.customerEmail || '';
  const street = order.shippingAddress?.street || '142 Enterprise Logistics Way';
  const city = order.shippingAddress?.city || 'New York';
  const state = order.shippingAddress?.state || 'NY';
  const postalCode = order.shippingAddress?.postalCode || '10001';
  const country = order.shippingAddress?.country || 'United States';
  const phone = order.shippingAddress?.phone || order.customerPhone || '+1 (555) 382-9901';

  // Header Banner #131921
  doc.setFillColor(19, 25, 33);
  doc.rect(0, 0, pageWidth, 30, 'F');

  // Brand Name: Spinel Distribution Ltd
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('SPINEL DISTRIBUTION', 15, 18);

  doc.setTextColor(254, 189, 105);
  doc.setFontSize(12);
  doc.text('LTD', 95, 18);

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('PHYSICAL SECURITY, SURVEILLANCE & POWER SOLUTIONS', 15, 25);

  // INVOICE title top right
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('COMMERCIAL INVOICE', pageWidth - 15, 18, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('ORIGINAL TAX RECEIPT', pageWidth - 15, 25, { align: 'right' });

  y = 42;

  // Order Details Box
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Invoice Reference: ${orderRef}`, 15, y);
  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  doc.text(`Issue Date: ${orderDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth - 15, y, { align: 'right' });

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Payment Status: ${(order.paymentStatus || 'PAID').toUpperCase()} (${(order.paymentMethod || 'PAYSTACK LIVE').toUpperCase()})`, 15, y);
  if (order.paystackReference || order.paymentReference) {
    doc.text(`Ref: ${order.paystackReference || order.paymentReference}`, pageWidth - 15, y, { align: 'right' });
  }

  y += 7;
  doc.text(`Fulfillment: ${(order.orderStatus || 'CONFIRMED').toUpperCase()}`, 15, y);
  doc.text(`Carrier: ${order.carrier || 'Insured Global Air Cargo'} (${order.trackingNumber || 'SPN-' + Math.floor(100000 + Math.random() * 900000)})`, pageWidth - 15, y, { align: 'right' });

  // Divider
  y += 5;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(15, y, pageWidth - 15, y);

  // Billing and Shipping Addresses
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Supplied By:', 15, y);
  doc.text('Shipped & Billed To:', 110, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Spinel Distribution Ltd', 15, y);
  doc.text(customerName, 110, y);

  y += 5;
  doc.text('Commercial Security & Logistics Division', 15, y);
  doc.text(street, 110, y);

  y += 5;
  doc.text('VAT / Tax ID: SPN-983109244-COMM', 15, y);
  doc.text(`${city}, ${state} ${postalCode}`, 110, y);

  y += 5;
  doc.text('support@spineldistribution.com', 15, y);
  doc.text(`${country} | ${phone}`, 110, y);

  // Items Table Header
  y += 12;
  doc.setFillColor(243, 244, 246);
  doc.rect(15, y, pageWidth - 30, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text('Item Description & SKU', 18, y + 5.5);
  doc.text('Qty', 125, y + 5.5, { align: 'center' });
  doc.text(`Unit Price (${currency})`, 155, y + 5.5, { align: 'right' });
  doc.text(`Total (${currency})`, pageWidth - 18, y + 5.5, { align: 'right' });

  y += 9;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  const items: any[] = order.items || [];

  items.forEach((item) => {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    const name = item.product?.name || item.name || 'Security Product';
    const sku = item.product?.sku || item.sku || 'SPN-PROD';
    const priceUSD = item.product?.priceUSD || item.unitPriceUSD || item.priceUSD || 0;
    const quantity = item.quantity || 1;

    const title = name.length > 55 ? name.substring(0, 52) + '...' : name;

    doc.setFont('helvetica', 'bold');
    doc.text(title, 18, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`SKU: ${sku}`, 18, y + 8);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);

    doc.text(String(quantity), 125, y + 5, { align: 'center' });
    doc.text(formatPrice(priceUSD, currency, exchangeRate), 155, y + 5, { align: 'right' });
    doc.text(formatPrice(priceUSD * quantity, currency, exchangeRate), pageWidth - 18, y + 5, { align: 'right' });

    y += 11;
    doc.setDrawColor(240, 240, 240);
    doc.line(15, y, pageWidth - 15, y);
    y += 2;
  });

  // Summary Totals Box
  y += 4;
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  const totalsX = 125;
  const valuesX = pageWidth - 18;

  const subtotalUSD = order.subtotalUSD || items.reduce((acc, it) => acc + (it.product?.priceUSD || it.priceUSD || 0) * (it.quantity || 1), 0);
  const shippingFeeUSD = order.shippingFeeUSD || 0;
  const taxUSD = order.taxUSD || subtotalUSD * 0.075;
  const grandTotalUSD = order.totalUSD || subtotalUSD + shippingFeeUSD + taxUSD;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsX, y);
  doc.text(formatPrice(subtotalUSD, currency, exchangeRate), valuesX, y, { align: 'right' });

  y += 6;
  doc.text('Shipping & Freight:', totalsX, y);
  doc.text(shippingFeeUSD === 0 ? 'FREE Enterprise Shipping' : formatPrice(shippingFeeUSD, currency, exchangeRate), valuesX, y, { align: 'right' });

  y += 6;
  doc.text('Estimated VAT (7.5%):', totalsX, y);
  doc.text(formatPrice(taxUSD, currency, exchangeRate), valuesX, y, { align: 'right' });

  if (currency === 'NGN') {
    y += 6;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`FX Exchange Rate: 1 USD = ₦${exchangeRate.toLocaleString()}`, totalsX, y);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);
  }

  y += 8;
  doc.setFillColor(254, 189, 105, 0.2);
  doc.rect(totalsX - 5, y - 5, pageWidth - totalsX - 10, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(19, 25, 33);
  doc.text('Grand Total:', totalsX, y + 2);
  doc.text(
    formatPrice(grandTotalUSD, currency, exchangeRate),
    valuesX,
    y + 2,
    { align: 'right' }
  );

  // Footer
  const footerY = 275;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('This is an electronically generated and certified commercial tax invoice from Spinel Distribution Ltd.', 15, footerY);
  doc.text('For warranty service, technical documentation, or inquiries, contact support@spineldistribution.com', 15, footerY + 4);
  doc.text('Page 1 of 1 • Spinel Distribution Certified', pageWidth - 15, footerY, { align: 'right' });

  // Save the PDF
  doc.save(`Spinel_Invoice_${orderRef}.pdf`);
}
