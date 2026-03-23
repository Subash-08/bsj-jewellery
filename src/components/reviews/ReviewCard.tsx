'use client';

import { useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import StarRating from './StarRating';
import type { JudgeMeReview } from '@/types/review';

interface ReviewCardProps {
  review: JudgeMeReview;
}

function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }

    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isVerifiedBuyer = review.verified === 'buyer';
  const bodyLength = review.body?.length || 0;
  const shouldTruncate = bodyLength > 300 && !isExpanded;

  const displayBody = shouldTruncate
    ? review.body.slice(0, 300) + '…'
    : review.body;

  return (
    <article
      className="bg-white border border-stone-100 rounded-sm p-5 md:p-6 shadow-sm"
      aria-label={`Review by ${review.reviewer?.name || 'Anonymous'}`}
    >
      {/* Header: Stars + Date */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <StarRating rating={review.rating} size={16} />
        <time
          className="text-xs text-stone-400 shrink-0"
          dateTime={review.created_at}
        >
          {formatRelativeDate(review.created_at)}
        </time>
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="font-semibold text-sm text-stone-900 mb-2 leading-snug">
          {review.title}
        </h4>
      )}

      {/* Body */}
      {review.body && (
        <div className="mb-3">
          <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
            {displayBody}
          </p>
          {bodyLength > 300 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-amber-700 font-semibold mt-1 hover:text-amber-800 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm outline-none"
              aria-expanded={isExpanded}
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      {/* Footer: Reviewer */}
      <div className="flex items-center gap-2 pt-3 border-t border-stone-50">
        {/* Avatar initial */}
        <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-stone-500 uppercase">
            {(review.reviewer?.name || 'A').charAt(0)}
          </span>
        </div>

        <span className="text-xs font-semibold text-stone-700">
          {review.reviewer?.name || 'Anonymous'}
        </span>

        {isVerifiedBuyer && (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-sm">
            <BadgeCheck size={10} strokeWidth={2} />
            Verified
          </span>
        )}
      </div>
    </article>
  );
}
