'use client';

import { useState, useRef } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import StarRating from './StarRating';
import type { ReviewApiResponse, ReviewErrorCode } from '@/types/review';

interface ReviewFormProps {
  productId: string;
  productHandle: string;
  productTitle: string;
  onSuccess?: (status: 'published' | 'pending') => void;
}

interface FormErrors {
  rating?: string;
  name?: string;
  email?: string;
  title?: string;
  body?: string;
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

const ERROR_MESSAGES: Record<ReviewErrorCode, string> = {
  RATE_LIMIT: "You've submitted too many requests. Please wait a minute and try again.",
  DUPLICATE: "You've already reviewed this product. Thank you!",
  VALIDATION: 'Please check the form fields and try again.',
  SPAM: 'Unable to submit your review. Please try again later.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
};

export default function ReviewForm({
  productId,
  productHandle,
  productTitle,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'published' | 'pending' | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (rating < 1 || rating > 5) errs.rating = 'Please select a rating';
    const cleanName = stripHtml(name);
    if (cleanName.length < 1) errs.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Please enter a valid email';
    const cleanTitle = stripHtml(title);
    if (cleanTitle.length < 2) errs.title = 'Title must be at least 2 characters';
    const cleanBody = stripHtml(body);
    if (cleanBody.length < 10) errs.body = 'Review must be at least 10 characters';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || submitted) return;

    setServerError(null);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          handle: productHandle,
          rating: Math.round(rating),
          title: stripHtml(title).slice(0, 200),
          body: stripHtml(body).slice(0, 5000),
          name: stripHtml(name).slice(0, 100),
          email: email.trim().toLowerCase(),
          website: '', // Honeypot — must be empty
        }),
      });

      const data = (await res.json()) as ReviewApiResponse;

      if (!data.success) {
        const errorMsg = ERROR_MESSAGES[data.code] || data.message;
        setServerError(errorMsg);
        console.info('[Reviews] Submit rejected', { event: 'submit_rejected', code: data.code });
        return;
      }

      // Success
      setSubmitted(true);
      setSubmitStatus(data.status);
      onSuccess?.(data.status);

      console.info('[Reviews] Submit success', {
        event: 'submit_success',
        status: data.status,
      });
    } catch (err) {
      setServerError('Network error. Please check your connection and try again.');
      console.error('[Reviews] Submit error', err);
    } finally {
      setSubmitting(false);
    }
  }

  // Success state
  if (submitted) {
    return (
      <div className="bg-white border border-emerald-200 rounded-sm p-6 md:p-8 text-center" role="status">
        <CheckCircle2 size={40} className="text-emerald-600 mx-auto mb-4" strokeWidth={1.5} />
        <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
          Thank You for Your Review!
        </h3>
        <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
          {submitStatus === 'published'
            ? 'Your review is now live. We appreciate you sharing your experience!'
            : 'Your review has been submitted and is pending approval. We appreciate your patience!'}
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white border border-stone-100 rounded-sm p-6 md:p-8 shadow-sm space-y-5"
      noValidate
    >
      <h3 className="font-serif text-lg font-semibold text-stone-900">
        Write a Review for {productTitle}
      </h3>

      {/* Server error */}
      {serverError && (
        <div
          className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-sm"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      {/* Rating */}
      <fieldset>
        <legend className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-2">
          Your Rating <span className="text-red-400">*</span>
        </legend>
        <StarRating
          rating={rating}
          size={28}
          interactive
          onChange={setRating}
        />
        {errors.rating && (
          <p className="text-xs text-red-500 mt-1" role="alert" aria-live="polite">
            {errors.rating}
          </p>
        )}
      </fieldset>

      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="review-name"
            className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1.5 block"
          >
            Name <span className="text-red-400">*</span>
          </label>
          <input
            id="review-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'review-name-error' : undefined}
          />
          {errors.name && (
            <p id="review-name-error" className="text-xs text-red-500 mt-1" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="review-email"
            className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1.5 block"
          >
            Email <span className="text-red-400">*</span>
          </label>
          <input
            id="review-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={254}
            className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
            placeholder="your@email.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'review-email-error' : undefined}
          />
          {errors.email && (
            <p id="review-email-error" className="text-xs text-red-500 mt-1" role="alert">
              {errors.email}
            </p>
          )}
          <p className="text-[10px] text-stone-300 mt-1">Your email will not be published</p>
        </div>
      </div>

      {/* Title */}
      <div>
        <label
          htmlFor="review-title"
          className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1.5 block"
        >
          Review Title <span className="text-red-400">*</span>
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
          placeholder="Summarize your experience"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'review-title-error' : undefined}
        />
        {errors.title && (
          <p id="review-title-error" className="text-xs text-red-500 mt-1" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      {/* Body */}
      <div>
        <label
          htmlFor="review-body"
          className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1.5 block"
        >
          Your Review <span className="text-red-400">*</span>
        </label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={5000}
          rows={4}
          className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors resize-y min-h-[100px]"
          placeholder="Share your experience with this piece..."
          aria-invalid={!!errors.body}
          aria-describedby={errors.body ? 'review-body-error' : undefined}
        />
        {errors.body && (
          <p id="review-body-error" className="text-xs text-red-500 mt-1" role="alert">
            {errors.body}
          </p>
        )}
        <p className="text-[10px] text-stone-300 mt-1 text-right">
          {body.length}/5000
        </p>
      </div>

      {/* Honeypot field — hidden from users, bots fill it */}
      <div className="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="review-website">Website</label>
        <input
          id="review-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-600 text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-700 transition-all duration-200 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
        aria-busy={submitting}
      >
        {submitting ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Submitting…
          </>
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
}
