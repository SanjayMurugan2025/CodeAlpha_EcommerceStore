import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Calendar, CheckCircle2, CreditCard, Hash, Package } from 'lucide-react';
import type { Order } from '../lib/types';
import { formatDate, formatPrice } from '../lib/utils';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/orders?id=${id}`);
        const data = await res.json();
        if (data && data.id) setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="bg-[#F8FAFC]">
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <div className="animate-fadeUp rounded-3xl border border-[#E5E7EB] bg-white p-8 text-center shadow-xl shadow-slate-900/5 sm:p-12">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 size={44} className="text-[#16A34A]" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-[#111827]">Order Placed Successfully!</h1>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-[#6B7280]">
            Thank you for shopping with ShopSphere. We've sent a confirmation to your email and will notify you when your order ships.
          </p>

          {loading ? (
            <div className="mx-auto mt-8 h-32 animate-pulse rounded-2xl bg-slate-100" />
          ) : order ? (
            <div className="mt-8 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
              {[
                { icon: Hash, label: 'Order ID', value: `#${String(order.id).padStart(6, '0')}` },
                { icon: Calendar, label: 'Order Date', value: formatDate(order.created_at) },
                { icon: CreditCard, label: 'Total Amount', value: formatPrice(order.total) },
                { icon: Package, label: 'Status', value: order.status },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
                  <Icon size={16} className="text-[#2563EB]" />
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">{label}</p>
                  <p className="mt-0.5 truncate text-sm font-bold text-[#111827]">{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-2xl bg-[#F8FAFC] p-5 text-sm text-[#6B7280]">Order #{id} confirmed. Details will appear in My Orders shortly.</p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/orders"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-8 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#1D4ED8]"
            >
              View Order <ArrowRight size={17} />
            </Link>
            <Link
              to="/products"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-[#E5E7EB] px-8 text-[15px] font-semibold text-[#111827] transition hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
