import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type {
  BlogPost,
  BlogListItem,
  BlogListResult,
  BlogCategory,
  ContentBlock,
  TrashedPost,
  BlogCategoryConfig,
} from '@/types/blog'
import { serializeBlocksToMarkdown, blocksToWordCount } from './blog/blocks-to-markdown'

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog')
const TRASH_DIR = path.join(process.cwd(), 'content', 'blog', '_trash')
const CATEGORIES_FILE = path.join(process.cwd(), 'content', 'blog', 'categories.json')
const DEFAULT_PER_PAGE = 9

function ensureDir(): void {
  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true })
}

function ensureTrashDir(): void {
  if (!fs.existsSync(TRASH_DIR)) fs.mkdirSync(TRASH_DIR, { recursive: true })
}

// ── Read ──────────────────────────────────────────────────────────────────────

export function getAllSlugs(): string[] {
  ensureDir()
  try {
    return fs
      .readdirSync(POSTS_DIR)
      .filter((f) => (f.endsWith('.mdx') || f.endsWith('.md')) && !f.startsWith('_'))
      .map((f) => f.replace(/\.(mdx|md)$/, ''))
  } catch {
    return []
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  ensureDir()
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`)
  const mdPath = path.join(POSTS_DIR, `${slug}.md`)
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null
  if (!filePath) return null

  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(raw)
    const rt = readingTime(content)

    let blocks: ContentBlock[] | undefined
    if (data.blocks) {
      try {
        blocks = JSON.parse(data.blocks) as ContentBlock[]
      } catch {
        blocks = undefined
      }
    }

    return {
      slug,
      title: data.title ?? '',
      excerpt: data.excerpt ?? '',
      content,
      coverImage: data.coverImage ?? '/blog/images/placeholder.jpg',
      category: (data.category as BlogCategory) ?? 'Jewellery Guide',
      tags: Array.isArray(data.tags) ? data.tags : [],
      author: data.author ?? 'Bakya Team',
      authorBio: data.authorBio,
      authorImage: data.authorImage,
      datePublished: data.datePublished ?? new Date().toISOString(),
      dateModified: data.dateModified ?? data.datePublished ?? new Date().toISOString(),
      status: data.status ?? 'draft',
      readingTime: rt.text,
      featured: data.featured ?? false,
      blocks,
      wordCount: data.wordCount,
      seo: data.seo,
    }
  } catch {
    return null
  }
}

export function getRawPost(slug: string): string | null {
  ensureDir()
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`)
  const mdPath = path.join(POSTS_DIR, `${slug}.md`)
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null
  if (!filePath) return null
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return null
  }
}

// ── Write ─────────────────────────────────────────────────────────────────────

export function savePost(slug: string, raw: string): void {
  ensureDir()
  fs.writeFileSync(path.join(POSTS_DIR, `${slug}.mdx`), raw, 'utf8')
}

export function savePostFromData(
  slug: string,
  data: Omit<BlogPost, 'readingTime' | 'slug'> & { blocks?: ContentBlock[] },
): void {
  ensureDir()
  const today = new Date().toISOString().split('T')[0]
  const tags = data.tags ?? []
  const wordCount = data.blocks ? blocksToWordCount(data.blocks) : undefined
  const bodyMarkdown = data.blocks
    ? serializeBlocksToMarkdown(data.blocks)
    : data.content

  const fm: Record<string, unknown> = {
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    tags: tags,
    author: data.author,
    coverImage: data.coverImage,
    status: data.status,
    featured: data.featured ?? false,
    datePublished: data.datePublished ?? today,
    dateModified: today,
  }
  if (wordCount !== undefined) fm.wordCount = wordCount
  if (data.blocks) fm.blocks = JSON.stringify(data.blocks)
  if (data.seo) fm.seo = data.seo

  const raw = matter.stringify(bodyMarkdown, fm)
  fs.writeFileSync(path.join(POSTS_DIR, `${slug}.mdx`), raw, 'utf8')
}

// ── Trash ─────────────────────────────────────────────────────────────────────

export function trashPost(slug: string): boolean {
  ensureDir()
  ensureTrashDir()
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`)
  const mdPath = path.join(POSTS_DIR, `${slug}.md`)
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null
  if (!filePath) return false
  const trashFilename = `${slug}_${Date.now()}.mdx`
  fs.renameSync(filePath, path.join(TRASH_DIR, trashFilename))
  return true
}

export function getTrashedPosts(): TrashedPost[] {
  ensureTrashDir()
  try {
    return fs
      .readdirSync(TRASH_DIR)
      .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
      .map((filename): TrashedPost | null => {
        const raw = fs.readFileSync(path.join(TRASH_DIR, filename), 'utf8')
        const { data } = matter(raw)
        const timestampStr = filename.replace(/^.+_(\d+)\.mdx?$/, '$1')
        const trashedAt = isNaN(Number(timestampStr))
          ? new Date().toISOString()
          : new Date(Number(timestampStr)).toISOString()
        const originalSlug = filename.replace(/_\d+\.mdx?$/, '')

        return {
          slug: originalSlug,
          title: data.title ?? originalSlug,
          excerpt: data.excerpt ?? '',
          coverImage: data.coverImage ?? '',
          category: (data.category as BlogCategory) ?? 'Jewellery Guide',
          tags: Array.isArray(data.tags) ? data.tags : [],
          author: data.author ?? 'Bakya Team',
          datePublished: data.datePublished ?? trashedAt,
          dateModified: data.dateModified ?? trashedAt,
          status: (data.status ?? 'draft') as 'draft' | 'published',
          readingTime: '',
          featured: data.featured ?? false,
          trashedAt,
          trashFilename: filename,
        }
      })
      .filter((p): p is TrashedPost => p !== null)
      .sort((a, b) => new Date(b.trashedAt).getTime() - new Date(a.trashedAt).getTime())
  } catch {
    return []
  }
}

export function restorePost(trashFilename: string): boolean {
  ensureTrashDir()
  const trashPath = path.join(TRASH_DIR, trashFilename)
  if (!fs.existsSync(trashPath)) return false
  const slug = trashFilename.replace(/_\d+\.mdx?$/, '')
  let destSlug = slug
  // Avoid slug collision
  if (fs.existsSync(path.join(POSTS_DIR, `${destSlug}.mdx`))) {
    destSlug = `${slug}-restored`
  }
  fs.renameSync(trashPath, path.join(POSTS_DIR, `${destSlug}.mdx`))
  return true
}

export function permanentlyDeletePost(trashFilename: string): boolean {
  ensureTrashDir()
  const trashPath = path.join(TRASH_DIR, trashFilename)
  if (!fs.existsSync(trashPath)) return false
  fs.unlinkSync(trashPath)
  return true
}

export function emptyTrash(): number {
  ensureTrashDir()
  const files = fs
    .readdirSync(TRASH_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
  files.forEach((f) => fs.unlinkSync(path.join(TRASH_DIR, f)))
  return files.length
}

export function getTrashCount(): number {
  ensureTrashDir()
  try {
    return fs
      .readdirSync(TRASH_DIR)
      .filter((f) => f.endsWith('.mdx') || f.endsWith('.md')).length
  } catch {
    return 0
  }
}

// ── Categories ────────────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES: BlogCategoryConfig[] = [
  { slug: 'silver-care', name: 'Silver Care', description: 'How to clean and maintain silver jewellery', postCount: 0 },
  { slug: 'jewellery-guide', name: 'Jewellery Guide', description: 'Expert guides on buying and wearing silver jewellery', postCount: 0 },
  { slug: 'tamil-culture', name: 'Tamil Culture', description: 'Silver jewellery in Tamil culture and tradition', postCount: 0 },
  { slug: 'gifting', name: 'Gifting', description: 'Silver jewellery gift ideas for every occasion', postCount: 0 },
  { slug: 'style-tips', name: 'Style Tips', description: 'How to style silver jewellery for every look', postCount: 0 },
  { slug: 'behind-the-craft', name: 'Behind the Craft', description: 'Stories from our Tirunelveli workshop', postCount: 0 },
]

export function getAdminCategories(): BlogCategoryConfig[] {
  if (!fs.existsSync(CATEGORIES_FILE)) {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(DEFAULT_CATEGORIES, null, 2))
    return DEFAULT_CATEGORIES
  }
  try {
    const categories = JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf8')) as BlogCategoryConfig[]
    const allPosts = getAllPostsForAdmin()
    return categories.map((cat) => ({
      ...cat,
      postCount: allPosts.filter(
        (p) => p.category.toLowerCase().replace(/\s+/g, '-') === cat.slug,
      ).length,
    }))
  } catch {
    return DEFAULT_CATEGORIES
  }
}

export function saveCategory(category: BlogCategoryConfig): void {
  const categories = getAdminCategories()
  const idx = categories.findIndex((c) => c.slug === category.slug)
  if (idx >= 0) {
    categories[idx] = { ...category, postCount: categories[idx].postCount }
  } else {
    categories.push({ ...category, postCount: 0 })
  }
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2))
}

export function deleteCategory(slug: string): boolean {
  const categories = getAdminCategories()
  const filtered = categories.filter((c) => c.slug !== slug)
  if (filtered.length === categories.length) return false
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(filtered, null, 2))
  return true
}

// ── List helpers ──────────────────────────────────────────────────────────────

function toListItem(post: BlogPost): BlogListItem {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content, authorBio, authorImage, seo, blocks, ...rest } = post
  return rest
}

export function getPublishedPosts(): BlogListItem[] {
  return getAllSlugs()
    .map(getPostBySlug)
    .filter((p): p is BlogPost => p !== null && p.status === 'published')
    .sort(
      (a, b) =>
        new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime(),
    )
    .map(toListItem)
}

export function getAllPostsForAdmin(): BlogListItem[] {
  return getAllSlugs()
    .map(getPostBySlug)
    .filter((p): p is BlogPost => p !== null)
    .sort(
      (a, b) =>
        new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime(),
    )
    .map(toListItem)
}

export function getDraftCount(): number {
  return getAllSlugs()
    .map(getPostBySlug)
    .filter((p): p is BlogPost => p !== null && p.status === 'draft').length
}

export function getFeaturedPost(): BlogListItem | null {
  const posts = getPublishedPosts()
  return posts.find((p) => p.featured) ?? posts[0] ?? null
}

export function getPaginatedPosts(
  page = 1,
  perPage = DEFAULT_PER_PAGE,
): BlogListResult {
  const all = getPublishedPosts()
  const total = all.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const posts = all.slice((safePage - 1) * perPage, safePage * perPage)
  return { posts, meta: { page: safePage, perPage, total, totalPages } }
}

export function getPostsByCategory(
  category: BlogCategory,
  page = 1,
  perPage = DEFAULT_PER_PAGE,
): BlogListResult {
  const all = getPublishedPosts().filter((p) => p.category === category)
  const total = all.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const posts = all.slice((safePage - 1) * perPage, safePage * perPage)
  return { posts, meta: { page: safePage, perPage, total, totalPages } }
}

export function getRelatedPosts(slug: string, limit = 3): BlogListItem[] {
  const current = getPostBySlug(slug)
  if (!current) return []
  return getPublishedPosts()
    .filter(
      (p) =>
        p.slug !== slug &&
        (p.category === current.category ||
          p.tags.some((t) => current.tags.includes(t))),
    )
    .slice(0, limit)
}

export function getAllBlogCategories(): BlogCategory[] {
  const set = new Set(getPublishedPosts().map((p) => p.category))
  return Array.from(set)
}
