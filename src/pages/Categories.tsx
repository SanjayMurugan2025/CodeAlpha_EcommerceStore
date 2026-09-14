import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Category } from '../lib/types';

export default function Categories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [cRes, pRes] = await Promise.all([fetch('/api/categories'), fetch('/api/products')]);
        const [c, p] = await Promise.all([cRes.json(), pRes.json()]);
        if (Array.isArray(c)) setCats(c);
        if (Array.isArray(p)) {
          const map: Record<string, number> = {};
          p.forEach((x: { category: string }) => {
            map[x.category] = (map[x.category] || 0) + 1;
          });
          setCounts(map);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="bg-white">
      <div className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">Browse</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">Shop by Category</h1>
          <p className="mt-2 max-w-xl text-[15px] text-[#6B7280]">Four curated departments, hundreds of quality products.</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-3xl bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {cats.map((c) => (
              <Link
                key={c.id}
                to={`/products?category=${encodeURIComponent(c.name)}`}
                className="group relative overflow-hidden rounded-3xl border border-[#E5E7EB] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10"
              >
                <img src={c.image} alt={c.name} className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-72" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6">
                  <div>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
                      {counts[c.name] || 0} products
                    </span>
                    <h2 className="mt-2 font-display text-2xl font-extrabold text-white">{c.name}</h2>
                    <p className="mt-1 max-w-sm text-sm text-white/80">{c.description}</p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#111827] transition group-hover:bg-[#2563EB] group-hover:text-white">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
