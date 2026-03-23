'use client';

import { useState, useCallback } from 'react';
import { Loader2, Star } from 'lucide-react';
import ReviewCard from './ReviewCard';
import type { JudgeMeReview } from '@/types/review';

interface ReviewListProps {
  reviews: JudgeMeReview[];
  productId: string;
  hasMore: boolean;
}

// Skeleton for loading state
function ReviewCardSkeleton() {
  return (
    <div className="bg-white border border-stone-100 rounded-sm p-5 md:p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={16} className="text-stone-100" strokeWidth={1.5} />
          ))}
        </div>
        <div className="h-3 w-16 bg-stone-100 rounded" />
      </div>
      <div className="h-4 w-3/4 bg-stone-100 rounded mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-stone-50 rounded" />
        <div className="h-3 w-5/6 bg-stone-50 rounded" />
        <div className="h-3 w-2/3 bg-stone-50 rounded" />
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-stone-50">
        <div className="w-7 h-7 rounded-full bg-stone-100" />
        <div className="h-3 w-20 bg-stone-100 rounded" />
      </div>
    </div>
  );
}

export default function ReviewList({ reviews: initialReviews, productId, hasMore: initialHasMore }: ReviewListProps) {
  const [reviews, setReviews] = useState<JudgeMeReview[]>(initialReviews);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const params = new URLSearchParams({
        productId,
        page: String(nextPage),
        perPage: '5',
      });

      const res = await fetch(`/api/reviews?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load reviews');

      const data = await res.json() as { reviews: JudgeMeReview[] };
      const newReviews = data.reviews || [];

      if (newReviews.length === 0) {
        setHasMore(false);
      } else {
        setReviews((prev) => [...prev, ...newReviews]);
        setPage(nextPage);
        // If we got fewer than perPage, no more pages
        if (newReviews.length < 5) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error('[Reviews] Pagination error:', err);
      // Don't remove hasMore so user can retry
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, productId]);

  // Empty state
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mb-6">
          <Star size={32} className="text-stone-200" strokeWidth={1} />
        </div>
        <p className="font-serif text-lg text-stone-700 mb-2">No Reviews Yet</p>
        <p className="text-sm text-stone-400 max-w-xs leading-relaxed">
          Be the first to share your experience — trusted by thousands of happy customers
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}

        {/* Loading skeletons */}
        {loading && (
          <>
            <ReviewCardSkeleton />
            <ReviewCardSkeleton />
          </>
        )}
      </div>

      {/* Show More button */}
      {hasMore && !loading && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 border border-stone-300 text-stone-700 text-xs uppercase tracking-[0.15em] font-bold hover:border-amber-400 hover:text-amber-700 transition-all duration-200 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
            aria-busy={loading}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Show More Reviews
          </button>
        </div>
      )}
    </div>
  );
}
