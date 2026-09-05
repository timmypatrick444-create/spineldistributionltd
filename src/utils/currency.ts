import { Currency } from '../types.ts';

export function formatPrice(
  amountUSD: number,
  currency: Currency,
  exchangeRate: number = 1550
): string {
  if (currency === 'NGN') {
    const amountNGN = Math.round(amountUSD * exchangeRate);
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amountNGN);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amountUSD);
}

export function convertUSDToNGN(amountUSD: number, exchangeRate: number = 1550): number {
  return Math.round(amountUSD * exchangeRate);
}
