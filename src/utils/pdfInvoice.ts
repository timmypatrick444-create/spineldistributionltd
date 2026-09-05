import { jsPDF } from 'jspdf';
import { Order } from '../types.ts';
import { formatPrice } from './currency.ts';

export function generateInvoicePDF(order: Order) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header Banner
  doc.setFillColor(19, 25, 33); // Amazon dark navy #131921
  doc.rect(0, 0, pageWidth, 30, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('amazon', 15, 18);

  doc.setTextColor(254, 189, 105); // Amazon accent orange
  doc.setFontSize(14);
  doc.text('.secstore', 52, 18);

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('ENTERPRISE SECURITY & SURVEILLANCE', 15, 25);

  // INVOICE title top right
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL INVOICE', pageWidth - 15, 18, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`ORIGINAL COMMERCIAL RECEIPT`, pageWidth - 15, 25, { align: 'right' });

  y = 42;

  // Order Details Box
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Order Number: ${order.orderNumber}`, 15, y);
  doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth - 15, y, { align: 'right' });

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Payment Status: ${order.paymentStatus.toUpperCase()} (${order.paymentMethod.toUpperCase()})`, 15, y);
  if (order.paystackReference) {
    doc.text(`Paystack Ref: ${order.paystackReference}`, pageWidth - 15, y, { align: 'right' });
  }

  y += 7;
  doc.text(`Fulfillment Status: ${order.orderStatus.toUpperCase()}`, 15, y);
  doc.text(`Carrier: ${order.carrier || 'Global Air Freight'} (${order.trackingNumber || 'TRK-PENDING'})`, pageWidth - 15, y, { align: 'right' });

  // Divider
  y += 5;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(15, y, pageWidth - 15, y);

  // Billing and Shipping Addresses
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Sold By:', 15, y);
  doc.text('Shipped & Billed To:', 110, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Amazon SecStore International LLC', 15, y);
  doc.text(order.customerName, 110, y);

  y += 5;
  doc.text('Enterprise Hardware Fulfillment Center', 15, y);
  doc.text(order.shippingAddress.street, 110, y);

  y += 5;
  doc.text('410 Terry Avenue North, Seattle, WA 98109', 15, y);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`, 110, y);

  y += 5;
  doc.text('Tax ID / VAT: US-983109244-SEC', 15, y);
  doc.text(`${order.shippingAddress.country} | Phone: ${order.shippingAddress.phone}`, 110, y);

  // Items Table Header
  y += 12;
  doc.setFillColor(243, 244, 246);
  doc.rect(15, y, pageWidth - 30, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text('Item Description & SKU', 18, y + 5.5);
  doc.text('Qty', 125, y + 5.5, { align: 'center' });
  doc.text(`Unit Price (${order.currency})`, 155, y + 5.5, { align: 'right' });
  doc.text(`Total (${order.currency})`, pageWidth - 18, y + 5.5, { align: 'right' });

  y += 9;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  order.items.forEach((item, index) => {
    // Check page overflow
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    const itemPrice = order.currency === 'NGN'
      ? item.priceUSD * order.exchangeRate
      : item.priceUSD;
    const itemTotal = itemPrice * item.quantity;

    // Title truncated if too long
    const title = item.name.length > 55 ? item.name.substring(0, 52) + '...' : item.name;

    doc.setFont('helvetica', 'bold');
    doc.text(title, 18, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`SKU: ${item.sku}`, 18, y + 8);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);

    doc.text(String(item.quantity), 125, y + 5, { align: 'center' });
    doc.text(formatPrice(item.priceUSD, order.currency, order.exchangeRate), 155, y + 5, { align: 'right' });
    doc.text(formatPrice(item.priceUSD * item.quantity, order.currency, order.exchangeRate), pageWidth - 18, y + 5, { align: 'right' });

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

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsX, y);
  doc.text(formatPrice(order.subtotalUSD, order.currency, order.exchangeRate), valuesX, y, { align: 'right' });

  y += 6;
  doc.text('Shipping & Handling:', totalsX, y);
  doc.text(order.shippingFeeUSD === 0 ? 'FREE Enterprise Freight' : formatPrice(order.shippingFeeUSD, order.currency, order.exchangeRate), valuesX, y, { align: 'right' });

  y += 6;
  doc.text('Estimated VAT / Tax (7.5%):', totalsX, y);
  doc.text(formatPrice(order.taxUSD, order.currency, order.exchangeRate), valuesX, y, { align: 'right' });

  if (order.currency === 'NGN') {
    y += 6;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Applied Exchange Rate: 1 USD = ₦${order.exchangeRate.toLocaleString()}`, totalsX, y);
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
    order.currency === 'NGN' ? `NGN ₦${order.totalNGN.toLocaleString()}` : `USD $${order.totalUSD.toFixed(2)}`,
    valuesX,
    y + 2,
    { align: 'right' }
  );

  // Footer / Security watermark
  const footerY = 275;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('This is an electronically generated and certified commercial invoice.', 15, footerY);
  doc.text('Returns accepted within 30 days. For technical warranty claims, contact support@secstore.amazon.com', 15, footerY + 4);
  doc.text(`Page 1 of 1 • Certified Security Authenticated`, pageWidth - 15, footerY, { align: 'right' });

  // Save the PDF
  doc.save(`Invoice_${order.orderNumber}.pdf`);
}
