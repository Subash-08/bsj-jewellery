'use client';

import StarRating from './StarRating';
import type { ReviewSummaryData } from '@/types/review';

interface ReviewSummaryProps {
  summary: ReviewSummaryData;
  onWriteReview: () => void;
}

export default function ReviewSummary({ summary, onWriteReview }: ReviewSummaryProps) {
  const maxCount = Math.max(...Object.values(summary.distribution), 1);

  return (
    <div className="bg-white border border-stone-100 rounded-sm p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">

        {/* Left: Average + Stars */}
        <div className="flex flex-col items-center text-center min-w-[140px]">
          <span className="font-serif text-5xl font-bold text-stone-900">
            {summary.count > 0 ? summary.average.toFixed(1) : '—'}
          </span>
          <div className="mt-2">
            <StarRating rating={Math.round(summary.average)} size={22} />
          </div>
          <p className="text-xs text-stone-400 mt-2 tracking-wide uppercase font-semibold">
            {summary.count} {summary.count === 1 ? 'Review' : 'Reviews'}
          </p>
        </div>

        {/* Right: Distribution Bars */}
        <div className="flex-1 w-full space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.distribution[star] || 0;
            const percentage = summary.count > 0 ? (count / maxCount) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-stone-500 w-3 text-right">
                  {star}
                </span>
                <StarRating rating={1} size={12} className="shrink-0 opacity-60" />
                <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-stone-400 w-6 text-right tabular-nums">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6 pt-6 border-t border-stone-100 text-center">
        <button
          onClick={onWriteReview}
          className="inline-flex items-center px-8 py-3 border border-amber-600 text-amber-700 text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-600 hover:text-white transition-all duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          aria-label="Write a review for this product"
        >
          Write a Review
        </button>
      </div>
    </div>
  );
}
