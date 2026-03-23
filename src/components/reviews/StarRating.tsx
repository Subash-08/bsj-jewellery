'use client';

import { useState, useCallback } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export default function StarRating({
  rating,
  size = 20,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, starValue: number) => {
      if (!interactive || !onChange) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        const newRating = Math.min(5, starValue + 1);
        onChange(newRating);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        const newRating = Math.max(1, starValue - 1);
        onChange(newRating);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onChange(starValue);
      }
    },
    [interactive, onChange]
  );

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={interactive ? 'Rating selection' : `Rating: ${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isFilled = starValue <= displayRating;

        return interactive ? (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={starValue === rating}
            aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            tabIndex={starValue === rating || (rating === 0 && starValue === 1) ? 0 : -1}
            className={cn(
              'p-0.5 transition-all duration-150 ease-out outline-none rounded-sm',
              'focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1',
              'hover:scale-110 active:scale-95'
            )}
            onClick={() => onChange?.(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            onKeyDown={(e) => handleKeyDown(e, starValue)}
          >
            <Star
              size={size}
              className={cn(
                'transition-colors duration-150',
                isFilled
                  ? 'text-amber-500 fill-amber-500'
                  : 'text-stone-200'
              )}
              strokeWidth={1.5}
            />
          </button>
        ) : (
          <Star
            key={starValue}
            size={size}
            className={cn(
              isFilled
                ? 'text-amber-500 fill-amber-500'
                : 'text-stone-200'
            )}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
