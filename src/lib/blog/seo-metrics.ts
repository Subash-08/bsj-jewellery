import type { ContentBlock } from '@/types/blog'
import { stripHtml } from './blocks-to-markdown'

export interface SeoCheckResult {
  id: string
  label: string
  passed: boolean
  required: boolean
}

export interface SeoMetrics {
  score: number
  checks: SeoCheckResult[]
  wordCount: number
  readingTimeMin: number
}

export function calculateSeoMetrics(opts: {
  title: string
  excerpt: string
  blocks: ContentBlock[]
  coverImage: string
  tags: string[]
  category: string
  seoTitle?: string
}): SeoMetrics {
  const { title, excerpt, blocks, coverImage, tags, category, seoTitle } = opts

  const allText = blocks.map((b) => stripHtml(b.content)).join(' ')
  const wordCount = allText.split(/\s+/).filter(Boolean).length
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200))

  const checks: SeoCheckResult[] = [
    {
      id: 'title',
      label: 'Title is present',
      passed: title.trim().length > 0,
      required: true,
    },
    {
      id: 'title_length',
      label: 'Title is 30–70 characters',
      passed: title.trim().length >= 30 && title.trim().length <= 70,
      required: false,
    },
    {
      id: 'excerpt',
      label: 'Excerpt is 130–160 characters',
      passed: excerpt.trim().length >= 130 && excerpt.trim().length <= 160,
      required: true,
    },
    {
      id: 'cover_image',
      label: 'Cover image is set',
      passed: coverImage.trim().length > 0,
      required: true,
    },
    {
      id: 'content_length',
      label: 'Content has 300+ words',
      passed: wordCount >= 300,
      required: true,
    },
    {
      id: 'has_h2',
      label: 'Has at least one H2 heading',
      passed: blocks.some((b) => b.type === 'h2'),
      required: false,
    },
    {
      id: 'category',
      label: 'Category is assigned',
      passed: category.trim().length > 0,
      required: true,
    },
    {
      id: 'tags',
      label: 'At least 3 tags added',
      passed: tags.length >= 3,
      required: false,
    },
    {
      id: 'seo_title',
      label: 'SEO title is under 60 characters',
      passed: !seoTitle || seoTitle.length <= 60,
      required: false,
    },
    {
      id: 'blocks_exist',
      label: 'Has at least one content block',
      passed: blocks.length > 0,
      required: true,
    },
  ]

  const requiredTotal = checks.filter((c) => c.required).length
  const requiredPassed = checks.filter((c) => c.required && c.passed).length
  const optionalTotal = checks.filter((c) => !c.required).length
  const optionalPassed = checks.filter((c) => !c.required && c.passed).length

  const score = Math.round(
    (requiredPassed / requiredTotal) * 70 + (optionalTotal > 0 ? (optionalPassed / optionalTotal) * 30 : 30),
  )

  return { score, checks, wordCount, readingTimeMin }
}
