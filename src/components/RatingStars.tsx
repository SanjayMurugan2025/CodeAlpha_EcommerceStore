import { Star, StarHalf } from 'lucide-react';
import { cx } from '../lib/utils';

export default function RatingStars({ rating, size = 14, className }: { rating: number; size?: number; className?: string }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.4;
  return (
    <span className={cx('inline-flex items-center gap-0.5', className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <Star key={i} size={size} className="fill-amber-400 text-amber-400" />;
        if (i === full && half)
          return (
            <span key={i} className="relative inline-flex" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-amber-400" />
              <StarHalf size={size} className="absolute inset-0 fill-amber-400 text-amber-400" />
            </span>
          );
        return <Star key={i} size={size} className="text-slate-300" />;
      })}
    </span>
  );
}
