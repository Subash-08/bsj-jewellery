// ── Judge.me Review Types ────────────────────────────────────────────────

export interface JudgeMeReviewer {
  id: number;
  email: string;
  name: string;
  phone: string;
}

export interface JudgeMeReview {
  id: number;
  title: string;
  body: string;
  rating: number;
  product_external_id: number;
  reviewer: JudgeMeReviewer;
  source: string;
  curated: string;
  published: boolean;
  hidden: boolean;
  verified: string; // "buyer" | "not-buyer" | etc.
  featured: boolean;
  created_at: string;
  updated_at: string;
  has_published_pictures: boolean;
  has_published_videos: boolean;
}

export interface JudgeMeReviewsResponse {
  reviews: JudgeMeReview[];
  current_page: number;
  per_page: number;
}

export interface ReviewSummaryData {
  average: number;
  count: number;
  distribution: { [key: number]: number };
}

export interface ReviewFormData {
  rating: number;
  title: string;
  body: string;
  name: string;
  email: string;
}

export type ReviewErrorCode =
  | 'RATE_LIMIT'
  | 'DUPLICATE'
  | 'VALIDATION'
  | 'SPAM'
  | 'SERVER_ERROR';

export type ReviewApiResponse =
  | { success: true; message: string; status: 'published' | 'pending' }
  | { success: false; code: ReviewErrorCode; message: string };
