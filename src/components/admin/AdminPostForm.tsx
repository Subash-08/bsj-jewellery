'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BLOG_CATEGORIES } from '@/types/blog'
import type { BlogCategory, BlogStatus } from '@/types/blog'

interface PostFormData {
  slug: string
  title: string
  excerpt: string
  category: BlogCategory
  tags: string
  author: string
  coverImage: string
  status: BlogStatus
  featured: boolean
  content: string
}

interface Props {
  initialData?: Partial<PostFormData>
  isEdit?: boolean
  originalSlug?: string
}

function buildMDX(data: PostFormData): string {
  const tags = data.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  const today = new Date().toISOString().split('T')[0]
  const fm = [
    '---',
    `title: "${data.title.replace(/"/g, '\\"')}"`,
    `excerpt: "${data.excerpt.replace(/"/g, '\\"')}"`,
    `category: "${data.category}"`,
    `tags: [${tags.map((t) => `"${t}"`).join(', ')}]`,
    `author: "${data.author}"`,
    `coverImage: "${data.coverImage}"`,
    `status: "${data.status}"`,
    `featured: ${data.featured}`,
    `datePublished: "${today}"`,
    `dateModified: "${today}"`,
    '---',
  ].join('\n')
  return `${fm}\n\n${data.content}`
}

export default function AdminPostForm({ initialData, isEdit, originalSlug }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState<PostFormData>({
    slug: initialData?.slug ?? '',
    title: initialData?.title ?? '',
    excerpt: initialData?.excerpt ?? '',
    category: initialData?.category ?? 'Jewellery Guide',
    tags: initialData?.tags ?? '',
    author: initialData?.author ?? 'Bakya Team',
    coverImage: initialData?.coverImage ?? '/blog/images/',
    status: initialData?.status ?? 'draft',
    featured: initialData?.featured ?? false,
    content: initialData?.content ?? '',
  })

  function setField<K extends keyof PostFormData>(key: K, value: PostFormData[K]) {
    if (key === 'title' && !isEdit) {
      const slug = (value as string)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 60)
      setForm((prev) => ({ ...prev, title: value as string, slug }))
    } else {
      setForm((prev) => ({ ...prev, [key]: value }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.slug) { setError('Slug is required'); return }
    setLoading(true)
    setError('')
    try {
      const url = isEdit ? `/api/admin/blog/${originalSlug}` : '/api/admin/blog'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: form.slug, raw: buildMDX(form) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to save post')
      router.push('/admin/blog')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const input = 'w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#230532] bg-white'
  const label = 'block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className={label}>Title *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            className={input}
            placeholder="How to Care for Your Silver Kolusu"
          />
        </div>
        <div>
          <label className={label}>Slug *</label>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => setField('slug', e.target.value)}
            className={`${input} font-mono ${isEdit ? 'bg-stone-50 text-gray-400' : ''}`}
            placeholder="how-to-care-for-silver-kolusu"
            disabled={isEdit}
          />
        </div>
      </div>

      <div>
        <label className={label}>Excerpt *</label>
        <textarea
          required
          value={form.excerpt}
          onChange={(e) => setField('excerpt', e.target.value)}
          className={input}
          rows={2}
          placeholder="Short description shown on cards and in meta tags"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className={label}>Category *</label>
          <select
            value={form.category}
            onChange={(e) => setField('category', e.target.value as BlogCategory)}
            className={input}
          >
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Tags (comma-separated)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setField('tags', e.target.value)}
            className={input}
            placeholder="silver care, kolusu, Tamil Nadu"
          />
        </div>
        <div>
          <label className={label}>Author</label>
          <input
            type="text"
            value={form.author}
            onChange={(e) => setField('author', e.target.value)}
            className={input}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className={label}>Cover Image Path</label>
          <input
            type="text"
            value={form.coverImage}
            onChange={(e) => setField('coverImage', e.target.value)}
            className={input}
            placeholder="/blog/images/my-article.jpg"
          />
          <p className="text-xs text-gray-400 mt-1">
            Place images in <code className="bg-stone-100 px-1">public/blog/images/</code>
          </p>
        </div>
        <div className="flex gap-6">
          <div>
            <label className={label}>Status</label>
            <select
              value={form.status}
              onChange={(e) => setField('status', e.target.value as BlogStatus)}
              className={input}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 mt-6 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setField('featured', e.target.checked)}
              className="w-4 h-4 accent-[#230532]"
            />
            Featured post
          </label>
        </div>
      </div>

      <div>
        <label className={label}>Content (Markdown / MDX) *</label>
        <textarea
          required
          value={form.content}
          onChange={(e) => setField('content', e.target.value)}
          className={`${input} font-mono text-xs leading-relaxed`}
          rows={24}
          placeholder="## Introduction&#10;&#10;Write your article content here in Markdown...&#10;&#10;## Section Heading&#10;&#10;Paragraph content..."
        />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#230532] text-white px-6 py-2.5 text-sm font-medium hover:bg-purple-900 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/blog')}
          className="px-6 py-2.5 text-sm border border-stone-300 text-gray-700 hover:border-[#230532] hover:text-[#230532] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
