import { Link } from 'react-router-dom';
import { ArrowRight, Award, Headset, Lock, Truck, BadgeCheck, Sparkles, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Category, Product } from '../lib/types';
import ProductCard from '../components/ProductCard';
import RatingStars from '../components/RatingStars';
import { formatPrice } from '../lib/utils';
import { useStore } from '../contexts/StoreContext';

function SectionHead({ eyebrow, title, sub, linkTo, linkLabel }: { eyebrow: string; title: string; sub?: string; linkTo?: string; linkLabel?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
      <div className="max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">{eyebrow}</p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">{title}</h2>
        {sub && <p className="mt-2 text-[15px] text-[#6B7280]">{sub}</p>}
      </div>
      {linkTo && (
        <Link to={linkTo} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
          {linkLabel || 'View all'}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deal, setDeal] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useStore();

  useEffect(() => {
    (async () => {
      try {
        const [fRes, cRes, dRes] = await Promise.all([
          fetch('/api/products?featured=true&limit=8'),
          fetch('/api/categories'),
          fetch('/api/products?limit=12'),
        ]);
        const [f, c, all] = await Promise.all([fRes.json(), cRes.json(), dRes.json()]);
        if (Array.isArray(f)) setFeatured(f);
        if (Array.isArray(c)) setCategories(c);
        if (Array.isArray(all)) {
          const discounted = all
            .filter((p: Product) => p.original_price && Number(p.original_price) > Number(p.price))
            .sort(
              (a: Product, b: Product) =>
                (Number(b.original_price) - Number(b.price)) / Number(b.original_price) -
                (Number(a.original_price) - Number(a.price)) / Number(a.original_price),
            )[0];
          setDeal(discounted || all[0] || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const heroProducts = featured.slice(0, 3);

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-purple-100/70 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-amber-100/50 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:pb-20 lg:pt-16">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-[#2563EB]">
              <Sparkles size={13} /> New season collection is live
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-[#111827] sm:text-5xl lg:text-[3.4rem]">
              Shop Smarter.
              <br />
              <span className="text-[#2563EB]">Live Better.</span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[#6B7280] sm:text-lg">
              Discover quality products, amazing deals and everything you need in one place.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#2563EB] px-7 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#1D4ED8]"
              >
                Shop Now <ArrowRight size={17} />
              </Link>
              <Link
                to="/products"
                className="inline-flex h-12 items-center rounded-xl border border-[#E5E7EB] bg-white px-7 text-[15px] font-semibold text-[#111827] transition hover:border-[#2563EB] hover:text-[#2563EB]"
              >
                Explore Products
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6">
              <div>
                <p className="font-display text-2xl font-bold text-[#111827]">50K+</p>
                <p className="text-xs text-[#6B7280]">Happy customers</p>
              </div>
              <div className="h-9 w-px bg-[#E5E7EB]" />
              <div>
                <p className="font-display text-2xl font-bold text-[#111827]">4.9/5</p>
                <p className="text-xs text-[#6B7280]">Average rating</p>
              </div>
              <div className="h-9 w-px bg-[#E5E7EB]" />
              <div>
                <p className="font-display text-2xl font-bold text-[#111827]">1200+</p>
                <p className="text-xs text-[#6B7280]">Quality products</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-blue-50 via-purple-50 to-amber-50" />
            <div className="relative grid grid-cols-2 gap-4 p-6 sm:p-10">
              {loading ? (
                <div className="col-span-2 flex h-72 items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#2563EB]" />
                </div>
              ) : (
                <>
                  <div className="col-span-2 overflow-hidden rounded-2xl border border-white bg-white shadow-xl shadow-slate-900/8">
                    {heroProducts[0] && (
                      <Link to={`/products/${heroProducts[0].slug}`} className="group flex items-center gap-4 p-4">
                        <img src={heroProducts[0].image} alt={heroProducts[0].name} className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#7C3AED]">{heroProducts[0].category}</p>
                          <p className="truncate font-display text-base font-bold text-[#111827]">{heroProducts[0].name}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-base font-bold text-[#2563EB]">{formatPrice(heroProducts[0].price)}</span>
                            <RatingStars rating={Number(heroProducts[0].rating)} />
                          </div>
                        </div>
                        <span className="ml-auto hidden shrink-0 rounded-full bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white sm:block">Shop</span>
                      </Link>
                    )}
                  </div>
                  {heroProducts.slice(1, 3).map((p) => (
                    <Link
                      key={p.id}
                      to={`/products/${p.slug}`}
                      className="group overflow-hidden rounded-2xl border border-white bg-white p-3 shadow-lg shadow-slate-900/8"
                    >
                      <img src={p.image} alt={p.name} className="aspect-square w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105" />
                      <p className="mt-2.5 truncate text-sm font-semibold text-[#111827]">{p.name}</p>
                      <p className="text-sm font-bold text-[#2563EB]">{formatPrice(p.price)}</p>
                    </Link>
                  ))}
                  <div className="flex flex-col justify-center rounded-2xl bg-[#111827] p-5 text-white shadow-lg">
                    <Zap size={20} className="text-amber-400" />
                    <p className="mt-2 font-display text-lg font-bold leading-tight">Up to 40% off electronics</p>
                    <Link to="/products?category=Electronics" className="mt-2 text-xs font-semibold text-amber-400 hover:text-amber-300">
                      Shop the sale →
                    </Link>
                  </div>
                  <div className="flex flex-col justify-center rounded-2xl bg-[#7C3AED] p-5 text-white shadow-lg">
                    <BadgeCheck size={20} className="text-white/90" />
                    <p className="mt-2 font-display text-lg font-bold leading-tight">Premium quality guaranteed</p>
                    <Link to="/about" className="mt-2 text-xs font-semibold text-white/80 hover:text-white">
                      Our promise →
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <SectionHead eyebrow="Categories" title="Shop by Category" sub="Find exactly what you need, organized the way you shop." linkTo="/categories" linkLabel="All categories" />
          {loading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {categories.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  to={`/products?category=${encodeURIComponent(c.name)}`}
                  className="group overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/8"
                >
                  <div className="relative h-36 overflow-hidden sm:h-44">
                    <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-4 font-display text-lg font-bold text-white">{c.name}</span>
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 text-[13px] leading-relaxed text-[#6B7280]">{c.description}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-[#2563EB]">
                      Shop now <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <SectionHead eyebrow="Handpicked" title="Featured Products" sub="Our most loved products, rated highly by thousands of shoppers." linkTo="/products" linkLabel="View all products" />
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SPECIAL OFFER */}
      <section className="bg-white pb-16 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-[#F8FAFC]">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />
            <div className="relative grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center rounded-full bg-[#F59E0B]/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#B45309]">
                  Limited time · Up to 40% off
                </span>
                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">
                  Big Deals. <span className="text-[#7C3AED]">Better Prices.</span>
                </h2>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#6B7280]">
                  {deal ? (
                    <>Save big on the <span className="font-semibold text-[#111827]">{deal.name}</span> and hundreds of other top-rated picks. Extra 10% off with code <span className="rounded bg-white px-1.5 py-0.5 font-mono font-bold text-[#2563EB]">SAVE10</span>.</>
                  ) : (
                    <>Save big on top-rated picks across electronics, fashion and home. Extra 10% off with code SAVE10.</>
                  )}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/products?sort=price_asc" className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#7C3AED] px-7 text-[15px] font-semibold text-white shadow-lg shadow-purple-600/25 transition hover:bg-[#6D28D9]">
                    Shop Deals <ArrowRight size={17} />
                  </Link>
                  {deal && (
                    <button
                      onClick={() => addToCart(deal, 1)}
                      className="inline-flex h-12 items-center rounded-xl border border-[#E5E7EB] bg-white px-7 text-[15px] font-semibold text-[#111827] transition hover:border-[#7C3AED] hover:text-[#7C3AED]"
                    >
                      Add {formatPrice(deal.price)} deal
                    </button>
                  )}
                </div>
              </div>
              <div className="relative">
                {deal && (
                  <Link to={`/products/${deal.slug}`} className="group block overflow-hidden rounded-2xl border border-white bg-white shadow-xl shadow-slate-900/8">
                    <img src={deal.image} alt={deal.name} className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">Deal of the week</p>
                        <p className="font-display font-bold text-[#111827]">{deal.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#2563EB]">{formatPrice(deal.price)}</p>
                        {deal.original_price && <p className="text-xs text-[#9CA3AF] line-through">{formatPrice(deal.original_price)}</p>}
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-t border-[#E5E7EB] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {[
            { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping on orders over $50', bg: 'bg-blue-50', fg: 'text-[#2563EB]' },
            { icon: Lock, title: 'Secure Payments', desc: '256-bit encrypted checkout', bg: 'bg-purple-50', fg: 'text-[#7C3AED]' },
            { icon: Award, title: 'Quality Products', desc: 'Curated & quality-checked', bg: 'bg-amber-50', fg: 'text-[#F59E0B]' },
            { icon: Headset, title: '24/7 Support', desc: 'Always here to help you', bg: 'bg-emerald-50', fg: 'text-[#16A34A]' },
          ].map(({ icon: Icon, title, desc, bg, fg }) => (
            <div key={title} className="flex items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-5 transition hover:shadow-lg hover:shadow-slate-900/5">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg} ${fg}`}>
                <Icon size={22} />
              </span>
              <div>
                <p className="font-display text-[15px] font-bold text-[#111827]">{title}</p>
                <p className="text-[13px] text-[#6B7280]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
