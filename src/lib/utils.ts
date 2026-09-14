import type { Product } from './types';

export function formatPrice(n: number | string | null | undefined): string {
  const num = Number(n) || 0;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
}

export function discountPct(p: Product): number | null {
  if (!p.original_price || p.original_price <= p.price) return null;
  return Math.round(((p.original_price - p.price) / p.original_price) * 100);
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const FREE_SHIPPING_THRESHOLD = 50;
export const FLAT_SHIPPING = 4.99;

export function shippingCost(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

export const PROMO_CODES: Record<string, number> = {
  SAVE10: 10,
  WELCOME20: 20,
  STUDENT15: 15,
};
