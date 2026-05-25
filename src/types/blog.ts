export type BlogStatus = 'draft' | 'published'

export type BlogCategory =
  | 'Silver Care'
  | 'Jewellery Guide'
  | 'Tamil Culture'
  | 'Gifting'
  | 'Style Tips'
  | 'Behind the Craft'

export const BLOG_CATEGORIES: BlogCategory[] = [
  'Silver Care',
  'Jewellery Guide',
  'Tamil Culture',
  'Gifting',
  'Style Tips',
  'Behind the Craft',
]

export function categoryToSlug(cat: BlogCategory): string {
  return cat.toLowerCase().replace(/\s+/g, '-')
}

export function slugToCategory(slug: string): BlogCategory | null {
  return BLOG_CATEGORIES.find((c) => categoryToSlug(c) === slug) ?? null
}

// ── Block types ───────────────────────────────────────────────────────────────

export type BlockType =
  | 'paragraph'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'image'
  | 'quote'
  | 'code'
  | 'list'
  | 'faq'
  | 'divider'
  | 'callout'

export interface ContentBlock {
  id: string
  type: BlockType
  /** HTML for text blocks; src URL for image; JSON string for list/faq; raw text for code */
  content: string
  anchorId?: string
  language?: string
  caption?: string
  altText?: string
  calloutType?: 'info' | 'warning' | 'tip'
}

export interface ExtractedLink {
  text: string
  href: string
  blockId: string
  isExternal: boolean
  isNofollow: boolean
}

// ── Post types ────────────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: BlogCategory
  tags: string[]
  author: string
  authorBio?: string
  authorImage?: string
  datePublished: string
  dateModified: string
  status: BlogStatus
  readingTime: string
  featured?: boolean
  blocks?: ContentBlock[]
  wordCount?: number
  seo?: {
    metaTitle?: string
    metaDescription?: string
    canonicalUrl?: string
  }
}

export interface BlogListItem
  extends Omit<BlogPost, 'content' | 'authorBio' | 'authorImage' | 'seo' | 'blocks'> {}

export interface BlogPaginationMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface BlogListResult {
  posts: BlogListItem[]
  meta: BlogPaginationMeta
}

// ── Categories ────────────────────────────────────────────────────────────────

export interface BlogCategoryConfig {
  slug: string
  name: string
  description: string
  postCount: number
}

// ── Trash ─────────────────────────────────────────────────────────────────────

export interface TrashedPost extends BlogListItem {
  trashedAt: string
  trashFilename: string
}

// ── Admin form ────────────────────────────────────────────────────────────────

export type AdminFormStep = 1 | 2 | 3
