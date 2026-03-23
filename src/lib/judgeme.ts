import 'server-only';
import { createHash } from 'crypto';
import type {
  JudgeMeReview,
  JudgeMeReviewsResponse,
  ReviewFormData,
  ReviewSummaryData,
} from '@/types/review';

// ── Env Validation ───────────────────────────────────────────────────────
const JUDGEME_API_TOKEN = process.env.JUDGEME_API_TOKEN;
const JUDGEME_SHOP_DOMAIN = process.env.JUDGEME_SHOP_DOMAIN;

if (!JUDGEME_API_TOKEN || !JUDGEME_SHOP_DOMAIN) {
  console.warn(
    '[JudgeMe] Missing JUDGEME_API_TOKEN or JUDGEME_SHOP_DOMAIN in environment. Reviews will be disabled.'
  );
}

const JUDGEME_BASE_URL = 'https://judge.me/api/v1';

// ── Helpers ──────────────────────────────────────────────────────────────

/** Extract numeric ID from Shopify GID: `gid://shopify/Product/123` → `"123"` */
export function extractNumericProductId(gid: string): string {
  const match = gid.match(/\/(\d+)$/);
  if (!match?.[1]) {
    throw new Error(`[JudgeMe] Invalid Shopify GID format: ${gid}`);
  }
  return match[1];
}

/** Hash email for Redis keys — never store raw emails */
export function hashEmail(email: string): string {
  return createHash('sha256').update(email.toLowerCase().trim()).digest('hex').slice(0, 16);
}

/** Strip HTML tags from a string */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

// ── Core Fetch with Retry + Timeout ──────────────────────────────────────

async function judgeMeFetch(
  url: string,
  options?: RequestInit,
  retries = 2,
  timeoutMs = 3000
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      // Only retry on 5xx — never on 4xx
      if (res.status >= 500 && attempt < retries) {
        console.warn(`[JudgeMe] 5xx error (${res.status}), retry ${attempt + 1}/${retries}`);
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }

      return res;
    } catch (err) {
      clearTimeout(timeoutId);

      if (attempt < retries) {
        const isTimeout = err instanceof DOMException && err.name === 'AbortError';
        console.warn(
          `[JudgeMe] ${isTimeout ? 'Timeout' : 'Network error'}, retry ${attempt + 1}/${retries}`
        );
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }

      throw err;
    }
  }

  // Unreachable, but TypeScript needs it
  throw new Error('[JudgeMe] Exhausted retries');
}

// ── API Functions ────────────────────────────────────────────────────────

/**
 * Fetch reviews for a product by its numeric Shopify product ID.
 * Returns reviews (published only) + computed summary.
 */
export async function getReviews(
  numericProductId: string,
  page = 1,
  perPage = 5
): Promise<{ reviews: JudgeMeReview[]; summary: ReviewSummaryData }> {
  if (!JUDGEME_API_TOKEN || !JUDGEME_SHOP_DOMAIN) {
    return { reviews: [], summary: { average: 0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } } };
  }

  const params = new URLSearchParams({
    api_token: JUDGEME_API_TOKEN,
    shop_domain: JUDGEME_SHOP_DOMAIN,
    product_external_id: numericProductId,
    page: String(page),
    per_page: String(perPage),
  });

  const res = await judgeMeFetch(`${JUDGEME_BASE_URL}/reviews?${params.toString()}`);

  if (!res.ok) {
    console.error('[JudgeMe] Failed to fetch reviews', {
      numericProductId,
      status: res.status,
      statusText: res.statusText,
    });
    throw new Error(`[JudgeMe] GET reviews failed with status ${res.status}`);
  }

  const data = (await res.json()) as JudgeMeReviewsResponse;

  // Filter to published reviews only
  const publishedReviews = (data.reviews || []).filter((r) => r.published && !r.hidden);

  // Compute summary from all published reviews on this page
  // Note: This is page-level summary. For full accuracy, Judge.me widget API
  // provides aggregate data — we compute from available data here.
  const summary = computeSummary(publishedReviews);

  return { reviews: publishedReviews, summary };
}

/**
 * Fetch rating summary for a product.
 * Uses the Judge.me widget API for accurate aggregate data.
 */
export async function getReviewSummary(
  numericProductId: string
): Promise<ReviewSummaryData> {
  if (!JUDGEME_API_TOKEN || !JUDGEME_SHOP_DOMAIN) {
    return { average: 0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
  }

  const params = new URLSearchParams({
    api_token: JUDGEME_API_TOKEN,
    shop_domain: JUDGEME_SHOP_DOMAIN,
    product_external_id: numericProductId,
  });

  try {
    const res = await judgeMeFetch(
      `${JUDGEME_BASE_URL}/reviews/count?${params.toString()}`
    );

    if (!res.ok) {
      console.error('[JudgeMe] Failed to fetch review count', {
        numericProductId,
        status: res.status,
      });
      return { average: 0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }

    const data = (await res.json()) as { count: number; average: number; percentage: Record<string, number> };

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    // Judge.me returns percentage — we need counts
    if (data.percentage && data.count > 0) {
      for (let star = 1; star <= 5; star++) {
        const pct = data.percentage[String(star)] || 0;
        distribution[star] = Math.round((pct / 100) * data.count);
      }
    }

    return {
      average: Math.round((data.average || 0) * 10) / 10,
      count: data.count || 0,
      distribution,
    };
  } catch (err) {
    console.error('[JudgeMe] Review summary fetch error', {
      numericProductId,
      error: err instanceof Error ? err.message : String(err),
    });
    return { average: 0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
  }
}

/**
 * Create a new review via the Judge.me API.
 * Returns the created review data including its published status.
 */
export async function createReview(data: {
  numericProductId: string;
  formData: ReviewFormData;
}): Promise<{ review: JudgeMeReview; status: 'published' | 'pending' }> {
  if (!JUDGEME_API_TOKEN || !JUDGEME_SHOP_DOMAIN) {
    throw new Error('[JudgeMe] API credentials not configured');
  }

  const payload = {
    api_token: JUDGEME_API_TOKEN,
    shop_domain: JUDGEME_SHOP_DOMAIN,
    platform: 'shopify',
    id: Number(data.numericProductId),
    email: data.formData.email.trim().toLowerCase(),
    name: stripHtml(data.formData.name),
    rating: Math.min(5, Math.max(1, Math.round(data.formData.rating))),
    title: stripHtml(data.formData.title),
    body: stripHtml(data.formData.body),
  };

  const res = await judgeMeFetch(
    `${JUDGEME_BASE_URL}/reviews`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
    2, // retries
    10000 // custom timeout 10s for POST
  );

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    console.error('[JudgeMe] Failed to create review', {
      numericProductId: data.numericProductId,
      status: res.status,
      error: errorText,
    });
    throw new Error(`[JudgeMe] Create review failed: ${res.status}`);
  }

  const responseData = await res.json() as any;
  console.log('[JudgeMe] Create response:', JSON.stringify(responseData, null, 2));

  // Some Judge.me API endpoints return `{ review: { ... } }`, others return the review object directly
  const reviewPayload = responseData.review ?? responseData;

  // Determine if review was auto-published or is pending moderation
  const reviewStatus = reviewPayload.published ? 'published' : 'pending';

  console.info('[Reviews] Review created', {
    event: 'review_created',
    productId: data.numericProductId,
    rating: data.formData?.rating,
    status: reviewStatus,
  });

  return { review: reviewPayload as JudgeMeReview, status: reviewStatus };
}

// ── Internal Helpers ─────────────────────────────────────────────────────

function computeSummary(reviews: JudgeMeReview[]): ReviewSummaryData {
  if (reviews.length === 0) {
    return { average: 0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
  }

  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRating = 0;

  for (const review of reviews) {
    const star = Math.min(5, Math.max(1, Math.round(review.rating)));
    distribution[star] = (distribution[star] || 0) + 1;
    totalRating += review.rating;
  }

  return {
    average: Math.round((totalRating / reviews.length) * 10) / 10,
    count: reviews.length,
    distribution,
  };
}
