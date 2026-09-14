import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, Heart, Minus, Plus, RotateCcw, ShieldCheck, ShoppingCart, Truck, Zap } from 'lucide-react';
import type { Product } from '../lib/types';
import { cx, discountPct, formatPrice } from '../lib/utils';
import { useStore } from '../contexts/StoreContext';
import ProductCard from '../components/ProductCard';
import RatingStars from '../components/RatingStars';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<'info' | 'specs' | 'reviews'>('info');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      setQty(1);
      try {
        if (!slug) return;
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const found: Product = await res.json();
          setProduct(found);
          const relRes = await fetch(`/api/products?category=${encodeURIComponent(found.category)}`);
          if (relRes.ok) {
            const relData: Product[] = await relRes.json();
            setRelated(relData.filter((p) => p.id !== found.id).slice(0, 4));
          }
        } else {
          const resAll = await fetch('/api/products');
          const all: Product[] = await resAll.json();
          const found = all.find((p) => String(p.id) === slug || p.slug === slug);
          if (!found) {
            setError('Product not found');
            return;
          }
          setProduct(found);
          setRelated(all.filter((p) => p.category === found.category && p.id !== found.id).slice(0, 4));
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    })();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-slate-100" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-slate-100" />
            <div className="h-10 w-1/2 animate-pulse rounded bg-slate-100" />
            <div className="h-24 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="font-display text-2xl font-bold text-[#111827]">{error || 'Product not found'}</p>
        <Link to="/products" className="mt-5 inline-flex h-11 items-center rounded-xl bg-[#2563EB] px-6 text-sm font-semibold text-white">
          Back to Products
        </Link>
      </div>
    );
  }

  const title = product.title || product.name;
  const pct = discountPct(product);
  const wished = isWishlisted(product.id);
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 8;
  const reviewsCount = product.reviews_count ?? product.review_count ?? 120;
  const specsEntries = product.specs ? Object.entries(product.specs) : [];

  const handleAdd = async () => {
    await addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = async () => {
    await addToCart(product, qty);
    navigate('/checkout');
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <nav className="flex items-center gap-2 text-[13px] text-[#6B7280]">
          <Link to="/" className="hover:text-[#2563EB]">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#2563EB]">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#2563EB]">
            {product.category}
          </Link>
          <span>/</span>
          <span className="truncate font-medium text-[#111827]">{title}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC]">
              <img
                src={product.image}
                alt={title}
                className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute left-4 top-4 flex gap-2">
                {pct && <span className="rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-bold text-white">-{pct}% OFF</span>}
                {product.badge && <span className="rounded-full bg-[#7C3AED] px-3 py-1 text-xs font-bold text-white">{product.badge}</span>}
              </div>
            </div>
          </div>

          <div>
            {product.brand && <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7C3AED]">{product.brand}</p>}
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">{title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <RatingStars rating={Number(product.rating)} size={17} />
              <span className="text-sm font-semibold text-[#111827]">{Number(product.rating).toFixed(1)}</span>
              <span className="text-sm text-[#9CA3AF]">· {reviewsCount} reviews</span>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <span className="font-display text-4xl font-extrabold text-[#111827]">{formatPrice(product.price)}</span>
              {product.original_price && Number(product.original_price) > Number(product.price) && (
                <span className="pb-1 text-lg text-[#9CA3AF] line-through">{formatPrice(product.original_price)}</span>
              )}
            </div>

            <p className="mt-4 leading-relaxed text-[#4B5563]">{product.description}</p>

            <div className="mt-4 flex items-center gap-2">
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[13px] font-semibold text-[#16A34A]">
                  <Check size={14} /> In Stock{lowStock ? ` · Only ${product.stock} left` : ''}
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1.5 text-[13px] font-semibold text-[#DC2626]">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex h-12 items-center rounded-xl border border-[#E5E7EB]">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-full w-11 items-center justify-center text-[#4B5563] transition hover:text-[#2563EB]" aria-label="Decrease">
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-display text-base font-bold">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))} className="flex h-full w-11 items-center justify-center text-[#4B5563] transition hover:text-[#2563EB]" aria-label="Increase">
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={!inStock}
                className={cx(
                  'flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-[15px] font-semibold text-white transition sm:flex-none sm:px-8',
                  added ? 'bg-[#16A34A]' : 'bg-[#2563EB] shadow-lg shadow-blue-600/25 hover:bg-[#1D4ED8]',
                  !inStock && 'cursor-not-allowed opacity-50',
                )}
              >
                <ShoppingCart size={17} /> {added ? 'Added!' : 'Add to Cart'}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label="Wishlist"
                className={cx(
                  'flex h-12 w-12 items-center justify-center rounded-xl border transition',
                  wished ? 'border-red-200 bg-red-50 text-[#DC2626]' : 'border-[#E5E7EB] text-[#6B7280] hover:border-red-200 hover:text-[#DC2626]',
                )}
              >
                <Heart size={19} className={wished ? 'fill-current' : ''} />
              </button>
            </div>
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F59E0B] text-[15px] font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:bg-[#D97706] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Zap size={17} /> Buy Now
            </button>

            <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 sm:grid-cols-3">
              <div className="flex items-center gap-2.5">
                <Truck size={19} className="shrink-0 text-[#2563EB]" />
                <p className="text-xs leading-snug text-[#4B5563]"><span className="font-semibold text-[#111827]">Free delivery</span><br />orders over $50</p>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw size={19} className="shrink-0 text-[#7C3AED]" />
                <p className="text-xs leading-snug text-[#4B5563]"><span className="font-semibold text-[#111827]">30-day returns</span><br />no questions asked</p>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={19} className="shrink-0 text-[#16A34A]" />
                <p className="text-xs leading-snug text-[#4B5563]"><span className="font-semibold text-[#111827]">1-year warranty</span><br />included free</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <div className="flex gap-1 border-b border-[#E5E7EB]">
            {[
              { k: 'info', label: 'Product Description' },
              { k: 'specs', label: `Specifications (${specsEntries.length})` },
              { k: 'reviews', label: `Customer Reviews (${reviewsCount})` },
            ].map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k as typeof tab)}
                className={cx(
                  'border-b-2 px-4 py-3 text-sm font-semibold transition sm:px-6',
                  tab === t.k ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#6B7280] hover:text-[#111827]',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="max-w-3xl py-6 text-[15px] leading-relaxed text-[#4B5563]">
            {tab === 'info' && <p>{product.details || product.description}</p>}
            {tab === 'specs' && (
              <div className="overflow-hidden rounded-2xl border border-[#E5E7EB]">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {specsEntries.map(([key, val], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-[#F8FAFC]' : 'bg-white'}>
                        <td className="w-1/3 px-4 py-3 font-semibold text-[#111827]">{key}</td>
                        <td className="px-4 py-3 text-[#4B5563]">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {tab === 'reviews' && (
              <div className="space-y-4">
                {[
                  { name: 'David M.', rating: 5, text: 'Awesome product! Works great and matches the specifications perfectly.', date: 'Sep 02, 2026' },
                  { name: 'Sophia L.', rating: 4.8, text: 'Super fast delivery from CodeAlpha store. Product quality is top-notch.', date: 'Aug 21, 2026' },
                  { name: 'Alex T.', rating: 5, text: 'Best purchase this year! Highly recommended.', date: 'Aug 10, 2026' },
                ].map((r) => (
                  <div key={r.name} className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-[#111827]">{r.name}</p>
                      <span className="text-xs text-[#9CA3AF]">{r.date}</span>
                    </div>
                    <RatingStars rating={r.rating} className="mt-1.5" />
                    <p className="mt-2 text-sm">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#111827]">Related Products</h2>
              <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
                View more →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
