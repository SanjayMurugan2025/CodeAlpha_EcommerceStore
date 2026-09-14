import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Eye, Loader2, PackageSearch, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Order } from '../lib/types';
import { cx, formatDate, formatPrice } from '../lib/utils';

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-blue-50 text-blue-700 border-blue-200',
  Shipped: 'bg-purple-50 text-purple-700 border-purple-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
};

function badge(status: string) {
  const cls = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold', cls)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export default function Orders() {
  const { user, token, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) setOrders(data);
        else throw new Error(data.error || 'Failed to load orders');
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    })();
  }, [user, token, authLoading]);

  if (!authLoading && !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-50">
          <PackageSearch size={34} className="text-[#7C3AED]" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-extrabold text-[#111827]">Sign in to view orders</h1>
        <p className="mt-2 text-[15px] text-[#6B7280]">Your order history lives here once you're logged in.</p>
        <div className="mt-7 flex justify-center gap-3">
          <Link to="/login" className="inline-flex h-12 items-center rounded-xl bg-[#2563EB] px-8 text-[15px] font-semibold text-white">Sign In</Link>
          <Link to="/register" className="inline-flex h-12 items-center rounded-xl border border-[#E5E7EB] px-8 text-[15px] font-semibold text-[#111827]">Create Account</Link>
        </div>
      </div>
    );
  }

  const visible = filter === 'All' ? orders : orders.filter((o) => (o.order_status || o.status) === filter);

  return (
    <div className="bg-[#F8FAFC]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">My Orders</h1>
        <p className="mt-1.5 text-[15px] text-[#6B7280]">Track, review and manage all your purchases in one place.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cx(
                'h-10 rounded-full border px-4 text-sm font-semibold transition',
                filter === s ? 'border-[#2563EB] bg-[#2563EB] text-white shadow-md shadow-blue-600/20' : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[#2563EB] hover:text-[#2563EB]',
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {loading || authLoading ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white p-14 text-[#6B7280]">
              <Loader2 size={20} className="animate-spin text-[#2563EB]" /> Loading your orders…
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="font-semibold text-red-700">Something went wrong</p>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-14 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <ShoppingBag size={28} className="text-[#2563EB]" />
              </span>
              <p className="mt-4 font-display text-lg font-bold text-[#111827]">No orders yet</p>
              <p className="mt-1 text-sm text-[#6B7280]">When you place orders, they'll show up here.</p>
              <Link to="/products" className="mt-5 inline-flex h-11 items-center rounded-xl bg-[#2563EB] px-6 text-sm font-semibold text-white">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {visible.map((o) => {
                const open = expanded === o.id;
                const totalAmt = o.total_amount || o.total;
                const status = o.order_status || o.status || 'Processing';
                const itemsList = o.items || [];
                const addr = typeof o.shipping_address === 'object' ? o.shipping_address : o.shipping_info;

                return (
                  <div key={o.id} className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition hover:shadow-lg hover:shadow-slate-900/5">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 p-5 sm:px-6">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Order</p>
                        <p className="font-display text-[15px] font-bold text-[#111827]">{o.order_number || `#${String(o.id).padStart(6, '0')}`}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Date</p>
                        <p className="text-sm font-semibold text-[#374151]">{formatDate(o.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Items</p>
                        <p className="text-sm font-semibold text-[#374151]">{itemsList.length} items</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Total</p>
                        <p className="font-display text-[15px] font-bold text-[#2563EB]">{formatPrice(totalAmt)}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        {badge(status)}
                        <button
                          onClick={() => setExpanded(open ? null : o.id)}
                          className="flex h-9 items-center gap-1.5 rounded-full border border-[#E5E7EB] px-3.5 text-[13px] font-semibold text-[#374151] transition hover:border-[#2563EB] hover:text-[#2563EB]"
                        >
                          <Eye size={14} /> {open ? 'Hide' : 'View Details'}
                          <ChevronDown size={14} className={cx('transition-transform', open && 'rotate-180')} />
                        </button>
                      </div>
                    </div>
                    {open && (
                      <div className="animate-fadeUp border-t border-[#E5E7EB] bg-[#F8FAFC] p-5 sm:px-6">
                        <div className="grid gap-5 md:grid-cols-2">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Items in this order</p>
                            <div className="mt-3 space-y-3">
                              {itemsList.map((it: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-2.5">
                                  <img src={it.image} alt={it.name || it.title} className="h-12 w-12 rounded-lg object-cover" />
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-[13px] font-semibold text-[#111827]">{it.name || it.title}</p>
                                    <p className="text-xs text-[#6B7280]">Qty {it.quantity} × {formatPrice(it.price)}</p>
                                  </div>
                                  <p className="text-[13px] font-bold text-[#111827]">{formatPrice(Number(it.price) * it.quantity)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Delivery & totals</p>
                            <div className="mt-3 rounded-xl border border-[#E5E7EB] bg-white p-4 text-sm">
                              <p className="font-semibold text-[#111827]">{addr?.fullName || user.name}</p>
                              <p className="mt-1 text-[13px] text-[#6B7280]">
                                {addr?.address ? `${addr.address}, ${addr.city} ${addr.zip}` : 'Standard Shipping'}
                              </p>
                              <div className="mt-3 space-y-1.5 border-t border-[#E5E7EB] pt-3 text-[13px]">
                                <div className="flex justify-between text-[#4B5563]"><span>Subtotal</span><span>{formatPrice(o.subtotal)}</span></div>
                                <div className="flex justify-between text-[#4B5563]"><span>Shipping</span><span>{Number(o.shipping_fee || o.shipping) === 0 ? 'FREE' : formatPrice(o.shipping_fee || o.shipping)}</span></div>
                                {Number(o.discount) > 0 && <div className="flex justify-between text-[#16A34A]"><span>Discount</span><span>−{formatPrice(o.discount)}</span></div>}
                                <div className="flex justify-between pt-1 font-display text-[15px] font-bold text-[#111827]"><span>Total</span><span>{formatPrice(totalAmt)}</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
