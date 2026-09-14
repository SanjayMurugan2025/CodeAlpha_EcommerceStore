import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import type { Product } from '../lib/types';
import ProductCard from '../components/ProductCard';
import { cx } from '../lib/utils';

const CATS = [
  'All',
  'Mobiles & Tablets',
  'Laptops & Computers',
  'Electronics',
  'Fashion & Clothing',
  'Footwear & Shoes',
  'Home & Kitchen',
  'Gaming & Consoles',
];

const SORTS = [
  { v: '', label: 'Sort: Featured' },
  { v: 'price_asc', label: 'Price: Low to High' },
  { v: 'price_desc', label: 'Price: High to Low' },
  { v: 'rating', label: 'Top Rated' },
  { v: 'newest', label: 'Newest' },
];

const PAGE_SIZE = 12;

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const search = params.get('search') || '';
  const category = params.get('category') || 'All';
  const sort = params.get('sort') || '';
  const minPrice = params.get('min_price') || '';
  const maxPrice = params.get('max_price') || '';
  const minRating = params.get('min_rating') || '';
  const [searchInput, setSearchInput] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);

  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const qs = new URLSearchParams();
        if (search) qs.set('search', search);
        if (category && category !== 'All') qs.set('category', category);
        if (sort) qs.set('sort', sort);
        if (minPrice) qs.set('min_price', minPrice);
        if (maxPrice) qs.set('max_price', maxPrice);
        if (minRating) qs.set('min_rating', minRating);
        const res = await fetch(`/api/products?${qs.toString()}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
          setPage(1);
        } else throw new Error(data.error || 'Failed to load');
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    })();
  }, [search, category, sort, minPrice, maxPrice, minRating]);

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (!v) next.delete(k);
    else next.set(k, v);
    setParams(next);
  };

  const clearAll = () => setParams({});

  const hasFilters = search || (category && category !== 'All') || sort || minPrice || maxPrice || minRating;

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    set('search', searchInput.trim());
  };

  // Pagination calculations
  const totalPages = Math.ceil(products.length / PAGE_SIZE) || 1;
  const paginatedProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold text-[#111827]">Category</h4>
        <div className="mt-3 space-y-1">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => set('category', c === 'All' ? '' : c)}
              className={cx(
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition',
                (category || 'All') === c ? 'bg-blue-50 font-bold text-[#2563EB]' : 'text-[#4B5563] hover:bg-slate-50',
              )}
            >
              <span className="truncate">{c}</span>
              {(category || 'All') === c && <span className="h-2 w-2 shrink-0 rounded-full bg-[#2563EB]" />}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-bold text-[#111827]">Price Range</h4>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            placeholder="Min ($)"
            value={minPrice}
            min={0}
            onChange={(e) => set('min_price', e.target.value)}
            className="h-9 w-full rounded-lg border border-[#E5E7EB] px-3 text-xs outline-none focus:border-[#2563EB]"
          />
          <span className="text-[#9CA3AF]">–</span>
          <input
            type="number"
            placeholder="Max ($)"
            value={maxPrice}
            min={0}
            onChange={(e) => set('max_price', e.target.value)}
            className="h-9 w-full rounded-lg border border-[#E5E7EB] px-3 text-xs outline-none focus:border-[#2563EB]"
          />
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {[
            { label: 'Under $100', min: '', max: '100' },
            { label: '$100–$500', min: '100', max: '500' },
            { label: '$500+', min: '500', max: '' },
          ].map((r) => (
            <button
              key={r.label}
              onClick={() => {
                const next = new URLSearchParams(params);
                if (!r.min) next.delete('min_price');
                else next.set('min_price', r.min);
                if (!r.max) next.delete('max_price');
                else next.set('max_price', r.max);
                setParams(next);
              }}
              className="rounded-full border border-[#E5E7EB] px-2.5 py-1 text-[11px] font-medium text-[#4B5563] transition hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-bold text-[#111827]">Rating</h4>
        <div className="mt-3 space-y-1">
          {[
            { v: '', label: 'All ratings' },
            { v: '4.5', label: '4.5 & up' },
            { v: '4', label: '4.0 & up' },
            { v: '3.5', label: '3.5 & up' },
          ].map((r) => (
            <button
              key={r.label}
              onClick={() => set('min_rating', r.v)}
              className={cx(
                'flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition',
                minRating === r.v || (!minRating && r.v === '') ? 'bg-blue-50 font-bold text-[#2563EB]' : 'text-[#4B5563] hover:bg-slate-50',
              )}
            >
              <span className="text-amber-400">★</span> {r.label}
            </button>
          ))}
        </div>
      </div>
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#6B7280] transition hover:border-red-200 hover:text-[#DC2626]"
        >
          <X size={14} /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white">
      <div className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">Catalog</p>
          <h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">Explore Products</h1>
          <p className="mt-1.5 max-w-xl text-[14px] text-[#6B7280]">Browse through 100+ premium Amazon & Flipkart style products with live filter & search.</p>
          <form onSubmit={submitSearch} className="mt-5 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search over 100+ products…"
                className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <button className="h-11 shrink-0 rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-[#6B7280]">
            {loading ? 'Loading products…' : (
              <>Showing <span className="font-bold text-[#111827]">{paginatedProducts.length}</span> of <span className="font-bold text-[#111827]">{products.length}</span> products</>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="flex h-9 items-center gap-2 rounded-xl border border-[#E5E7EB] px-3.5 text-xs font-semibold text-[#374151] lg:hidden"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => set('sort', e.target.value)}
              className="h-9 rounded-xl border border-[#E5E7EB] bg-white px-3 text-xs font-semibold text-[#374151] outline-none focus:border-[#2563EB]"
            >
              {SORTS.map((s) => (
                <option key={s.label} value={s.v}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {filtersOpen && (
          <div className="mt-4 rounded-2xl border border-[#E5E7EB] bg-white p-5 lg:hidden">{filterPanel}</div>
        )}

        <div className="mt-6 grid gap-8 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-[#E5E7EB] bg-white p-5">{filterPanel}</div>
          </aside>
          <div>
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                <p className="font-semibold text-red-700">Something went wrong</p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-[#F8FAFC] p-12 text-center">
                <p className="font-display text-lg font-bold text-[#111827]">No products found</p>
                <p className="mt-1 text-sm text-[#6B7280]">Try adjusting your search query or filters.</p>
                {hasFilters && (
                  <button onClick={clearAll} className="mt-4 rounded-xl bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white">
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {/* Pagination bar */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-between border-t border-[#E5E7EB] pt-6">
                    <p className="text-xs text-[#6B7280]">
                      Page <span className="font-bold text-[#111827]">{page}</span> of <span className="font-bold text-[#111827]">{totalPages}</span>
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setPage((p) => Math.max(1, p - 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={page === 1}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#374151] transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:opacity-40"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pNum) => (
                        <button
                          key={pNum}
                          onClick={() => {
                            setPage(pNum);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={cx(
                            'h-9 min-w-9 rounded-xl text-xs font-semibold transition',
                            page === pNum ? 'bg-[#2563EB] text-white shadow-sm' : 'border border-[#E5E7EB] text-[#374151] hover:bg-slate-50',
                          )}
                        >
                          {pNum}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setPage((p) => Math.min(totalPages, p + 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={page === totalPages}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#374151] transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:opacity-40"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
