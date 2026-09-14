import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartLine, Product } from '../lib/types';
import { PROMO_CODES } from '../lib/utils';
import { useAuth } from './AuthContext';

interface Promo {
  code: string;
  pct: number;
}

interface StoreCtx {
  lines: CartLine[];
  loading: boolean;
  cartCount: number;
  subtotal: number;
  wishlist: number[];
  promo: Promo | null;
  addToCart: (p: Product, qty?: number) => Promise<void>;
  updateQty: (productId: number, qty: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleWishlist: (id: number) => void;
  isWishlisted: (id: number) => boolean;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
  refreshCart: () => Promise<void>;
}

const StoreContext = createContext<StoreCtx | null>(null);

const GUEST_KEY = 'shopsphere_guest_cart';
const WISH_KEY = 'shopsphere_wishlist';
const PROMO_KEY = 'shopsphere_promo';

function readGuest(): CartLine[] {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

function readWishlist(): number[] {
  try {
    const raw = localStorage.getItem(WISH_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<number[]>(() => readWishlist());
  const [promo, setPromo] = useState<Promo | null>(() => {
    try {
      const raw = localStorage.getItem(PROMO_KEY);
      return raw ? (JSON.parse(raw) as Promo) : null;
    } catch {
      return null;
    }
  });

  const refreshCart = useCallback(async () => {
    if (!token || !user) {
      setLines(readGuest());
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setLines(
            data
              .filter((r) => r.products)
              .map((r) => ({ product: r.products as Product, qty: r.quantity as number, cartId: r.id as number })),
          );
        }
      }
    } catch (err) {
      console.error('Cart fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    setLoading(true);
    refreshCart();
  }, [refreshCart]);

  const persistGuest = (next: CartLine[]) => {
    setLines(next);
    try {
      localStorage.setItem(GUEST_KEY, JSON.stringify(next));
    } catch { /* noop */ }
  };

  const addToCart = async (p: Product, qty = 1) => {
    if (!user || !token) {
      const existing = readGuest();
      const found = existing.find((l) => l.product.id === p.id);
      if (found) persistGuest(existing.map((l) => (l.product.id === p.id ? { ...l, qty: l.qty + qty } : l)));
      else persistGuest([...existing, { product: p, qty }]);
      return;
    }

    setLines((prev) => {
      const found = prev.find((l) => l.product.id === p.id);
      if (found) return prev.map((l) => (l.product.id === p.id ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { product: p, qty }];
    });

    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: p.id, quantity: qty }),
      });
      await refreshCart();
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  };

  const updateQty = async (productId: number, qty: number) => {
    if (!user || !token) {
      if (qty <= 0) persistGuest(readGuest().filter((l) => l.product.id !== productId));
      else persistGuest(readGuest().map((l) => (l.product.id === productId ? { ...l, qty } : l)));
      return;
    }
    const line = lines.find((l) => l.product.id === productId);
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.product.id !== productId) : prev.map((l) => (l.product.id === productId ? { ...l, qty } : l)),
    );
    try {
      if (!line?.cartId) {
        await refreshCart();
        return;
      }
      await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: line.cartId, quantity: qty }),
      });
    } catch (err) {
      console.error('Update cart error:', err);
    }
  };

  const removeItem = async (productId: number) => {
    if (!user || !token) {
      persistGuest(readGuest().filter((l) => l.product.id !== productId));
      return;
    }
    const line = lines.find((l) => l.product.id === productId);
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
    try {
      if (!line?.cartId) return;
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: line.cartId }),
      });
    } catch (err) {
      console.error('Remove cart error:', err);
    }
  };

  const clearCart = async () => {
    if (!user || !token) {
      persistGuest([]);
      return;
    }
    setLines([]);
    try {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clear: true }),
      });
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id];
      try {
        localStorage.setItem(WISH_KEY, JSON.stringify(next));
      } catch { /* noop */ }
      return next;
    });
  };

  const isWishlisted = (id: number) => wishlist.includes(id);

  const applyPromo = (code: string): boolean => {
    const pct = PROMO_CODES[code.trim().toUpperCase()];
    if (!pct) return false;
    const p = { code: code.trim().toUpperCase(), pct };
    setPromo(p);
    try {
      localStorage.setItem(PROMO_KEY, JSON.stringify(p));
    } catch { /* noop */ }
    return true;
  };

  const clearPromo = () => {
    setPromo(null);
    try {
      localStorage.removeItem(PROMO_KEY);
    } catch { /* noop */ }
  };

  const cartCount = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((s, l) => s + Number(l.product.price) * l.qty, 0), [lines]);

  return (
    <StoreContext.Provider
      value={{
        lines,
        loading,
        cartCount,
        subtotal,
        wishlist,
        promo,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        toggleWishlist,
        isWishlisted,
        applyPromo,
        clearPromo,
        refreshCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreCtx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
