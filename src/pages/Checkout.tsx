import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Loader2, Lock, MapPin, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { useAuth } from '../contexts/AuthContext';
import type { ShippingInfo } from '../lib/types';
import { cx, formatPrice, shippingCost } from '../lib/utils';

const inputCls = 'h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100';

export default function Checkout() {
  const { lines, subtotal, promo, clearCart } = useStore();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [form, setForm] = useState<ShippingInfo>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: 'United States',
    payment: 'card',
  });
  const [touched, setTouched] = useState(false);

  const ship = shippingCost(subtotal);
  const discount = promo ? (subtotal * promo.pct) / 100 : 0;
  const total = Math.max(0, subtotal - discount + ship);

  const set = (k: keyof ShippingInfo, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const invalid: Partial<Record<keyof ShippingInfo, string>> = {};
  if (!form.fullName.trim()) invalid.fullName = 'Full name is required';
  if (!form.email.includes('@')) invalid.email = 'Valid email is required';
  if (!form.phone.trim()) invalid.phone = 'Phone is required';
  if (!form.address.trim()) invalid.address = 'Address is required';
  if (!form.city.trim()) invalid.city = 'City is required';
  if (!form.zip.trim()) invalid.zip = 'ZIP code is required';

  const field = (k: keyof ShippingInfo, label: string, placeholder: string, type = 'text', span = false) => (
    <div className={span ? 'sm:col-span-2' : ''}>
      <label className="mb-1.5 block text-sm font-semibold text-[#111827]">{label}</label>
      <input type={type} value={form[k]} onChange={(e) => set(k, e.target.value)} placeholder={placeholder} className={cx(inputCls, touched && invalid[k] && 'border-red-400 focus:border-red-500 focus:ring-red-100')} />
      {touched && invalid[k] && <p className="mt-1 text-xs font-medium text-red-600">{invalid[k]}</p>}
    </div>
  );

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setErr('');
    if (Object.keys(invalid).length > 0) return;
    if (lines.length === 0) {
      setErr('Your cart is empty.');
      return;
    }
    if (!token) {
      setErr('Please sign in or register to place your order.');
      navigate('/login');
      return;
    }

    setBusy(true);
    try {
      const items = lines.map((l) => ({
        product_id: l.product.id,
        title: l.product.title || l.product.name,
        image: l.product.image,
        price: Number(l.product.price),
        quantity: l.qty,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          subtotal,
          discount,
          shipping_fee: ship,
          total_amount: total,
          shipping_address: form,
          payment_method: form.payment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');

      await clearCart();
      navigate(`/order-success/${data.order.id}`);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Failed to place order. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (lines.length === 0 && !busy) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <ShoppingBag size={34} className="text-[#2563EB]" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-extrabold text-[#111827]">Nothing to check out</h1>
        <p className="mt-2 text-[15px] text-[#6B7280]">Your cart is empty. Add some products first.</p>
        <Link to="/products" className="mt-7 inline-flex h-12 items-center rounded-xl bg-[#2563EB] px-8 text-[15px] font-semibold text-white">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">Checkout</h1>
        <p className="mt-1.5 text-[15px] text-[#6B7280]">Almost there — review your details and place your order.</p>

        <form onSubmit={placeOrder} className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-7">
              <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-[#111827]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50"><User size={16} className="text-[#2563EB]" /></span>
                Shipping Information
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {field('fullName', 'Full Name', 'Jane Cooper')}
                {field('email', 'Email Address', 'you@example.com', 'email')}
                {field('phone', 'Phone Number', '+1 (555) 000-1234', 'tel')}
                {field('country', 'Country', 'United States')}
                {field('address', 'Street Address', '548 Market Street, Apt 4B', 'text', true)}
                {field('city', 'City', 'San Francisco')}
                {field('zip', 'ZIP / Postal Code', '94104')}
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-7">
              <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-[#111827]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50"><CreditCard size={16} className="text-[#7C3AED]" /></span>
                Payment Method
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { v: 'card', label: 'Credit Card', sub: 'Visa, Mastercard' },
                  { v: 'paypal', label: 'PayPal', sub: 'Fast checkout' },
                  { v: 'cod', label: 'Cash on Delivery', sub: 'Pay at door' },
                ].map((m) => (
                  <button
                    type="button"
                    key={m.v}
                    onClick={() => set('payment', m.v)}
                    className={cx(
                      'rounded-xl border-2 p-4 text-left transition',
                      form.payment === m.v ? 'border-[#2563EB] bg-blue-50/50' : 'border-[#E5E7EB] hover:border-[#9CA3AF]',
                    )}
                  >
                    <p className="text-sm font-bold text-[#111827]">{m.label}</p>
                    <p className="text-xs text-[#6B7280]">{m.sub}</p>
                  </button>
                ))}
              </div>
              {form.payment === 'card' && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-[#111827]">Card Number</label>
                    <input placeholder="4242 4242 4242 4242" inputMode="numeric" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#111827]">Expiry</label>
                    <input placeholder="MM / YY" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#111827]">CVC</label>
                    <input placeholder="123" inputMode="numeric" className={inputCls} />
                  </div>
                </div>
              )}
              <p className="mt-4 flex items-center gap-1.5 text-xs text-[#6B7280]">
                <Lock size={13} className="text-[#16A34A]" /> Demo checkout — encrypted with Express backend.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-lg shadow-slate-900/5 lg:sticky lg:top-32">
            <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-[#111827]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50"><MapPin size={16} className="text-[#F59E0B]" /></span>
              Order Summary
            </h2>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {lines.map(({ product: p, qty }) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img src={p.image} alt={p.title || p.name} className="h-14 w-14 rounded-xl object-cover" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#111827] px-1 text-[10px] font-bold text-white">
                      {qty}
                    </span>
                  </div>
                  <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-[#374151]">{p.title || p.name}</p>
                  <p className="text-[13px] font-bold text-[#111827]">{formatPrice(Number(p.price) * qty)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2.5 border-t border-[#E5E7EB] pt-4 text-sm">
              <div className="flex justify-between text-[#4B5563]"><span>Subtotal</span><span className="font-semibold text-[#111827]">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-[#4B5563]">
                <span>Shipping</span>
                <span className={ship === 0 ? 'font-semibold text-[#16A34A]' : 'font-semibold text-[#111827]'}>{ship === 0 ? 'FREE' : formatPrice(ship)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#16A34A]"><span>Discount</span><span className="font-semibold">−{formatPrice(discount)}</span></div>
              )}
              <div className="flex justify-between border-t border-[#E5E7EB] pt-3 font-display text-base font-bold text-[#111827]">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
            {err && <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-700">{err}</p>}
            <button
              disabled={busy}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#1D4ED8] disabled:opacity-60"
            >
              {busy && <Loader2 size={17} className="animate-spin" />}
              {busy ? 'Placing Order…' : `Place Order · ${formatPrice(total)}`}
            </button>
            <Link to="/cart" className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#374151] transition hover:border-[#2563EB] hover:text-[#2563EB]">
              <ArrowLeft size={15} /> Back to Cart
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
