import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { BlogPost, BlogListItem, BlogListResult, BlogCategory } from '@/types/blog'

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog')
const DEFAULT_PER_PAGE = 9

function ensureDir(): void {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true })
  }
}

export function getAllSlugs(): string[] {
  ensureDir()
  try {
    return fs
      .readdirSync(POSTS_DIR)
      .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
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

export function savePost(slug: string, raw: string): void {
  ensureDir()
  fs.writeFileSync(path.join(POSTS_DIR, `${slug}.mdx`), raw, 'utf8')
}

export function deletePost(slug: string): void {
  ensureDir()
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`)
  const mdPath = path.join(POSTS_DIR, `${slug}.md`)
  if (fs.existsSync(mdxPath)) fs.unlinkSync(mdxPath)
  else if (fs.existsSync(mdPath)) fs.unlinkSync(mdPath)
}

function toListItem(post: BlogPost): BlogListItem {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content, authorBio, authorImage, seo, ...rest } = post
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
