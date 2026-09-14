import { Link } from 'react-router-dom';
import { Eye, Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '../lib/types';
import { cx, discountPct, formatPrice } from '../lib/utils';
import { useStore } from '../contexts/StoreContext';
import RatingStars from './RatingStars';
import { useState } from 'react';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [added, setAdded] = useState(false);
  const wished = isWishlisted(product.id);
  const pct = discountPct(product);
  const title = product.title || product.name || 'Product';
  const reviewsCount = product.reviews_count ?? product.review_count ?? 0;
  const linkPath = `/products/${product.id}`;

  const handleAdd = async () => {
    await addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/8">
      <div className="relative overflow-hidden bg-[#F8FAFC]">
        <Link to={linkPath}>
          <img
            src={product.image}
            alt={title}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80';
            }}
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {pct && (
            <span className="rounded-full bg-[#F59E0B] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              -{pct}%
            </span>
          )}
          {product.badge && (
            <span className="rounded-full bg-[#7C3AED] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              {product.badge}
            </span>
          )}
        </div>
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label="Add to wishlist"
          className={cx(
            'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition',
            wished ? 'bg-[#DC2626] text-white' : 'bg-white text-[#6B7280] hover:text-[#DC2626]',
          )}
        >
          <Heart size={17} className={wished ? 'fill-current' : ''} />
        </button>
        <Link
          to={linkPath}
          className="absolute bottom-3 left-1/2 flex h-9 -translate-x-1/2 translate-y-14 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#111827]/90 px-4 text-xs font-semibold text-white opacity-0 backdrop-blur transition-all duration-300 hover:bg-[#111827] group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Eye size={14} /> View Details
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7C3AED]">{product.category}</p>
        <Link to={linkPath} className="mt-1 line-clamp-1 font-display text-[15px] font-semibold text-[#111827] transition hover:text-[#2563EB]">
          {title}
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5">
          <RatingStars rating={Number(product.rating)} />
          <span className="text-xs text-[#9CA3AF]">({reviewsCount})</span>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-lg font-bold text-[#111827]">{formatPrice(product.price)}</span>
          {product.original_price && Number(product.original_price) > Number(product.price) && (
            <span className="text-sm text-[#9CA3AF] line-through">{formatPrice(product.original_price)}</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          className={cx(
            'mt-3.5 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition',
            added
              ? 'bg-[#16A34A] text-white'
              : 'bg-[#2563EB] text-white shadow-md shadow-blue-600/20 hover:bg-[#1D4ED8]',
          )}
        >
          <ShoppingCart size={16} />
          {added ? 'Added to Cart!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
