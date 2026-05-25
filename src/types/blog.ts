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
  seo?: {
    metaTitle?: string
    metaDescription?: string
    canonicalUrl?: string
  }
}

export interface BlogListItem
  extends Omit<BlogPost, 'content' | 'authorBio' | 'authorImage' | 'seo'> {}

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
