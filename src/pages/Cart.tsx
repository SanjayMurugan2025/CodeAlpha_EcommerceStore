import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Loader2, Minus, Plus, ShieldCheck, ShoppingBag, Tag, Trash2, Truck, X } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { formatPrice, shippingCost } from '../lib/utils';

export default function Cart() {
  const { lines, loading, subtotal, promo, applyPromo, clearPromo, updateQty, removeItem } = useStore();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [promoMsg, setPromoMsg] = useState('');

  const ship = shippingCost(subtotal);
  const discount = promo ? (subtotal * promo.pct) / 100 : 0;
  const total = Math.max(0, subtotal - discount + ship);

  const submitPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const ok = applyPromo(code);
    setPromoMsg(ok ? '' : 'Invalid promo code. Try SAVE10.');
    if (ok) setCode('');
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="h-9 w-64 animate-pulse rounded bg-slate-100" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <ShoppingBag size={34} className="text-[#2563EB]" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-extrabold text-[#111827]">Your cart is empty</h1>
        <p className="mt-2 text-[15px] text-[#6B7280]">Looks like you haven't added anything yet. Let's fix that.</p>
        <Link to="/products" className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-[#2563EB] px-8 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#1D4ED8]">
          Continue Shopping <ArrowRight size={17} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">Your Shopping Cart</h1>
        <p className="mt-1.5 text-[15px] text-[#6B7280]">{lines.reduce((s, l) => s + l.qty, 0)} items in your cart</p>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {lines.map(({ product: p, qty }) => (
              <div key={p.id} className="flex gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-4 transition hover:shadow-lg hover:shadow-slate-900/5 sm:p-5">
                <Link to={`/products/${p.slug}`} className="shrink-0">
                  <img src={p.image} alt={p.name} className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#7C3AED]">{p.category}</p>
                      <Link to={`/products/${p.slug}`} className="mt-0.5 block truncate font-display text-[15px] font-bold text-[#111827] hover:text-[#2563EB] sm:text-base">
                        {p.name}
                      </Link>
                      <p className="mt-1 text-sm font-semibold text-[#2563EB]">{formatPrice(p.price)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(p.id)}
                      aria-label="Remove item"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#9CA3AF] transition hover:bg-red-50 hover:text-[#DC2626]"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex h-10 items-center rounded-xl border border-[#E5E7EB]">
                      <button onClick={() => updateQty(p.id, qty - 1)} className="flex h-full w-9 items-center justify-center text-[#4B5563] hover:text-[#2563EB]" aria-label="Decrease">
                        <Minus size={15} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{qty}</span>
                      <button onClick={() => updateQty(p.id, qty + 1)} className="flex h-full w-9 items-center justify-center text-[#4B5563] hover:text-[#2563EB]" aria-label="Increase">
                        <Plus size={15} />
                      </button>
                    </div>
                    <p className="font-display text-base font-bold text-[#111827]">{formatPrice(Number(p.price) * qty)}</p>
                  </div>
                </div>
              </div>
            ))}

            <Link to="/products" className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#E5E7EB] px-5 text-sm font-semibold text-[#374151] transition hover:border-[#2563EB] hover:text-[#2563EB]">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-lg shadow-slate-900/5 lg:sticky lg:top-32">
            <h2 className="font-display text-lg font-bold text-[#111827]">Order Summary</h2>

            {promo ? (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-[#16A34A]">
                  <Check size={15} /> {promo.code} · {promo.pct}% off applied
                </span>
                <button onClick={clearPromo} className="text-[#16A34A] hover:text-[#15803D]" aria-label="Remove promo">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <form onSubmit={submitPromo} className="mt-4">
                <div className="flex overflow-hidden rounded-xl border border-[#E5E7EB] focus-within:border-[#2563EB]">
                  <span className="flex items-center pl-3 text-[#9CA3AF]"><Tag size={15} /></span>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Promo code (try SAVE10)"
                    className="h-11 w-full px-2.5 text-sm outline-none placeholder:text-[#9CA3AF]"
                  />
                  <button className="shrink-0 bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-black">Apply</button>
                </div>
                {promoMsg && <p className="mt-1.5 text-xs font-medium text-red-600">{promoMsg}</p>}
              </form>
            )}

            <div className="mt-5 space-y-2.5 border-t border-[#E5E7EB] pt-5 text-sm">
              <div className="flex justify-between text-[#4B5563]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#111827]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#4B5563]">
                <span>Shipping</span>
                <span className={ship === 0 ? 'font-semibold text-[#16A34A]' : 'font-semibold text-[#111827]'}>
                  {ship === 0 ? 'FREE' : formatPrice(ship)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#16A34A]">
                  <span>Discount ({promo?.code})</span>
                  <span className="font-semibold">−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#E5E7EB] pt-3 font-display text-base font-bold text-[#111827]">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#1D4ED8]"
            >
              Proceed to Checkout <ArrowRight size={17} />
            </button>
            <div className="mt-4 space-y-2 text-xs text-[#6B7280]">
              <p className="flex items-center gap-1.5"><Truck size={14} className="text-[#2563EB]" /> Free shipping on orders over $50</p>
              <p className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#16A34A]" /> Secure 256-bit encrypted checkout</p>
              <p className="flex items-center gap-1.5"><Loader2 size={14} className="hidden" /> </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
