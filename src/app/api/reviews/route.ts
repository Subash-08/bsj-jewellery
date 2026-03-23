import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createHash } from 'crypto';
import {
  getReviews,
  getReviewSummary,
  createReview,
  extractNumericProductId,
  hashEmail,
  stripHtml,
} from '@/lib/judgeme';
import type { ReviewApiResponse, ReviewErrorCode } from '@/types/review';

// ── In-Memory Rate Limiter (Redis fallback) ──────────────────────────────
// WARNING: In-memory rate limit does not persist across deploys
// or work across multiple Vercel serverless instances.
// For production, use Redis/Upstash via KV_URL. This is best-effort fallback.

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const inflightSet = new Set<string>();

const RATE_LIMIT_WINDOW_MS = 60_000; // 60 seconds
const RATE_LIMIT_MAX = 5;
const MAP_MAX_SIZE = 1000;

// Prune expired entries every 60s
if (typeof globalThis !== 'undefined') {
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (entry.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }, 60_000);

  // Prevent the interval from blocking Node.js shutdown
  if (interval && typeof interval === 'object' && 'unref' in interval) {
    interval.unref();
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    if (rateLimitMap.size >= MAP_MAX_SIZE) {
      // Evict oldest entry
      const firstKey = rateLimitMap.keys().next().value;
      if (firstKey) rateLimitMap.delete(firstKey);
    }
    rateLimitMap.set(ip, { timestamps: [now] });
    return true;
  }

  // Clean old timestamps
  entry.timestamps = entry.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (entry.timestamps.length >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.timestamps.push(now);
  return true;
}

// ── Pagination Cache ─────────────────────────────────────────────────────
interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const paginationCache = new Map<string, CacheEntry>();

function getCached(key: string): unknown | null {
  const entry = paginationCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    paginationCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown, ttlMs = 60_000): void {
  if (paginationCache.size >= MAP_MAX_SIZE) {
    const firstKey = paginationCache.keys().next().value;
    if (firstKey) paginationCache.delete(firstKey);
  }
  paginationCache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

// ── Helpers ──────────────────────────────────────────────────────────────

function errorResponse(code: ReviewErrorCode, message: string, status: number): NextResponse {
  const body: ReviewApiResponse = { success: false, code, message };
  return NextResponse.json(body, { status });
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

const HANDLE_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

// ── GET /api/reviews ─────────────────────────────────────────────────────
// Used for client-side "Show More" pagination

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const pageParam = searchParams.get('page');
    const perPageParam = searchParams.get('perPage');

    if (!productId) {
      return errorResponse('VALIDATION', 'productId is required', 400);
    }

    let numericId: string;
    try {
      numericId = extractNumericProductId(productId);
    } catch {
      return errorResponse('VALIDATION', 'Invalid product ID format', 400);
    }

    // Clamp pagination values
    const page = Math.max(1, Math.min(Number(pageParam) || 1, 10));
    const perPage = Math.max(1, Math.min(Number(perPageParam) || 5, 10));

    // Check pagination cache
    const cacheKey = `${numericId}_${page}_${perPage}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const [reviewData, summary] = await Promise.all([
      getReviews(numericId, page, perPage),
      page === 1 ? getReviewSummary(numericId) : Promise.resolve(null),
    ]);

    const responseData = {
      reviews: reviewData.reviews,
      summary: summary || reviewData.summary,
      page,
      perPage,
    };

    // Cache the result for 60s
    setCache(cacheKey, responseData);

    return NextResponse.json(responseData);
  } catch (err) {
    console.error('[Reviews API] GET error', {
      error: err instanceof Error ? err.message : String(err),
    });
    return errorResponse('SERVER_ERROR', 'Failed to fetch reviews', 500);
  }
}

// ── POST /api/reviews ────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return errorResponse('VALIDATION', 'Invalid request body', 400);
    }

    // 1. Honeypot check — if website field is filled, it's a bot
    if (body.website && typeof body.website === 'string' && body.website.trim().length > 0) {
      // Silent reject — looks like success to the bot
      console.info('[Reviews] Spam rejected (honeypot)', { event: 'spam_blocked' });
      return NextResponse.json({
        success: true,
        message: 'Your review has been submitted and is pending approval.',
        status: 'pending',
      } satisfies ReviewApiResponse);
    }

    // 2. Sanitize BEFORE validation
    const sanitized = {
      productId: typeof body.productId === 'string' ? body.productId.trim() : '',
      handle: typeof body.handle === 'string' ? body.handle.trim().toLowerCase() : '',
      rating: typeof body.rating === 'number' ? body.rating : 0,
      title: typeof body.title === 'string' ? stripHtml(body.title).slice(0, 200) : '',
      body: typeof body.body === 'string' ? stripHtml(body.body).slice(0, 5000) : '',
      name: typeof body.name === 'string' ? stripHtml(body.name).slice(0, 100) : '',
      email: typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 254) : '',
    };

    // 3. Validate sanitized data
    const errors: string[] = [];
    if (!sanitized.productId) errors.push('productId is required');
    if (!sanitized.handle || !HANDLE_REGEX.test(sanitized.handle)) errors.push('Invalid product handle');
    if (sanitized.rating < 1 || sanitized.rating > 5) errors.push('Rating must be between 1 and 5');
    if (sanitized.title.length < 2) errors.push('Title must be at least 2 characters');
    if (sanitized.body.length < 10) errors.push('Review must be at least 10 characters');
    if (sanitized.name.length < 1) errors.push('Name is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized.email)) errors.push('Valid email is required');

    if (errors.length > 0) {
      return errorResponse('VALIDATION', errors.join('; '), 400);
    }

    // 4. Origin check (secondary layer — not primary security)
    const origin = req.headers.get('origin');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    if (origin && !siteUrl.includes('localhost')) {
      const allowedOrigin = new URL(siteUrl).origin;
      if (origin !== allowedOrigin) {
        console.warn('[Reviews] Origin mismatch', { origin, expected: allowedOrigin });
        // Don't block — just log. CORS handles browser enforcement.
      }
    }

    // 5. Rate limit
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      console.info('[Reviews] Rate limited', { event: 'rate_limited', ip: ip.slice(0, 8) + '...' });
      return errorResponse('RATE_LIMIT', 'Too many requests. Please try again in a minute.', 429);
    }

    // 6. Extract numeric product ID
    let numericId: string;
    try {
      numericId = extractNumericProductId(sanitized.productId);
    } catch {
      return errorResponse('VALIDATION', 'Invalid product ID format', 400);
    }

    // 7. Inflight lock (in-memory — prevents same request racing)
    const emailHash = hashEmail(sanitized.email);
    const inflightKey = `${emailHash}:${numericId}`;

    if (inflightSet.has(inflightKey)) {
      return errorResponse('DUPLICATE', 'Your review is already being processed.', 409);
    }

    inflightSet.add(inflightKey);

    try {
      // 8. Create review via Judge.me
      const result = await createReview({
        numericProductId: numericId,
        formData: {
          rating: Math.round(sanitized.rating),
          title: sanitized.title,
          body: sanitized.body,
          name: sanitized.name,
          email: sanitized.email,
        },
      });

      // 9. Revalidate the product page cache
      try {
        revalidatePath(`/products/${sanitized.handle}`);
      } catch (revalErr) {
        console.warn('[Reviews] revalidatePath failed', {
          handle: sanitized.handle,
          error: revalErr instanceof Error ? revalErr.message : String(revalErr),
        });
      }

      // 10. Determine response based on review status
      const message =
        result.status === 'published'
          ? 'Your review is now live. Thank you!'
          : 'Your review has been submitted and is pending approval. Thank you!';

      console.info('[Reviews] Review submitted successfully', {
        event: 'review_submitted',
        productId: numericId,
        rating: sanitized.rating,
        status: result.status,
      });

      const response: ReviewApiResponse = {
        success: true,
        message,
        status: result.status,
      };

      return NextResponse.json(response, { status: 201 });
    } finally {
      // ALWAYS clean up inflight lock
      inflightSet.delete(inflightKey);
    }
  } catch (err) {
    console.error('[Reviews API] POST error', {
      event: 'review_error',
      error: err instanceof Error ? err.message : String(err),
    });
    return errorResponse('SERVER_ERROR', 'Something went wrong. Please try again.', 500);
  }
}
