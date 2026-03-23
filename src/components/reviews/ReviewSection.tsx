'use client';

import { useState, useRef, useCallback } from 'react';
import ReviewSummary from './ReviewSummary';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import type { JudgeMeReview, ReviewSummaryData } from '@/types/review';

interface ReviewSectionProps {
  productId: string;
  productHandle: string;
  productTitle: string;
  initialReviews: JudgeMeReview[];
  initialSummary: ReviewSummaryData;
}

export default function ReviewSection({
  productId,
  productHandle,
  productTitle,
  initialReviews,
  initialSummary,
}: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleWriteReview = useCallback(() => {
    setShowForm(true);
    // Scroll to form after render
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const handleSuccess = useCallback((_status: 'published' | 'pending') => {
    // Form handles its own success state internally.
    // No optimistic append — user sees "pending approval" or "live" message.
  }, []);

  // Determine if there are potentially more reviews
  const hasMore = initialReviews.length >= 5;

  return (
    <div className="py-12 md:py-16 border-t border-stone-100">
      <h2 className="font-serif text-xl font-semibold text-stone-900 mb-8 text-center">
        Customer Reviews
      </h2>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Summary */}
        <ReviewSummary
          summary={initialSummary}
          onWriteReview={handleWriteReview}
        />

        {/* Review Form (toggled) */}
        {showForm && (
          <div ref={formRef}>
            <ReviewForm
              productId={productId}
              productHandle={productHandle}
              productTitle={productTitle}
              onSuccess={handleSuccess}
            />
          </div>
        )}

        {/* Review List */}
        <ReviewList
          reviews={initialReviews}
          productId={productId}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
}
