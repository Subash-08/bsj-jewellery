'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, Tag } from 'lucide-react'
import { BLOG_CATEGORIES } from '@/types/blog'
import type { BlogPost, BlogStatus } from '@/types/blog'

type BasicFields = Pick<
  BlogPost,
  'title' | 'excerpt' | 'category' | 'tags' | 'author' | 'coverImage' | 'status' | 'featured'
> & { slug: string }

interface Props {
  data: BasicFields
  onChange: (data: BasicFields) => void
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export default function BasicInfoStep({ data, onChange }: Props) {
  const [tagInput, setTagInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function patch(partial: Partial<BasicFields>) {
    onChange({ ...data, ...partial })
  }

  function handleTitleChange(title: string) {
    if (!slugManual) {
      patch({ title, slug: slugify(title) })
    } else {
      patch({ title })
    }
  }

  function handleSlugChange(slug: string) {
    setSlugManual(true)
    patch({ slug: slugify(slug) })
  }

  function addTag(raw: string) {
    const tag = raw.trim().toLowerCase()
    if (!tag || data.tags.includes(tag)) return
    patch({ tags: [...data.tags, tag] })
  }

  function removeTag(tag: string) {
    patch({ tags: data.tags.filter((t) => t !== tag) })
  }

  async function handleFile(file: File) {
    setUploadError('')
    if (file.size > 5 * 1024 * 1024) { setUploadError('Max 5 MB'); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Upload failed')
      patch({ coverImage: json.url })
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* title */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Post Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full text-lg px-3 py-2 border border-stone-300 focus:outline-none focus:border-[#230532] font-semibold"
          placeholder="e.g. How to Clean Your Silver Jewellery at Home"
        />
      </div>

      {/* slug */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">URL Slug</label>
        <div className="flex items-center border border-stone-300 focus-within:border-[#230532]">
          <span className="px-2 text-xs text-gray-400 border-r border-stone-300 py-2 bg-stone-50 shrink-0">
            /blog/
          </span>
          <input
            type="text"
            value={data.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="flex-1 text-sm px-2 py-2 focus:outline-none"
            placeholder="auto-generated-from-title"
          />
        </div>
      </div>

      {/* excerpt */}
      <div>
        <div className="flex justify-between mb-1">
          <label className="text-xs font-medium text-gray-700">
            Excerpt <span className="text-red-500">*</span>
          </label>
          <span className={`text-xs ${data.excerpt.length > 160 ? 'text-amber-600' : 'text-gray-400'}`}>
            {data.excerpt.length}/160
          </span>
        </div>
        <textarea
          value={data.excerpt}
          onChange={(e) => patch({ excerpt: e.target.value })}
          rows={3}
          className="w-full text-sm px-3 py-2 border border-stone-300 focus:outline-none focus:border-[#230532] resize-none"
          placeholder="1-2 sentence summary shown on blog listing and in search results…"
        />
      </div>

      {/* category + author */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
          <select
            value={data.category}
            onChange={(e) => patch({ category: e.target.value as BlogPost['category'] })}
            className="w-full text-sm px-2 py-2 border border-stone-300 focus:outline-none focus:border-[#230532] bg-white"
          >
            {BLOG_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Author</label>
          <input
            type="text"
            value={data.author}
            onChange={(e) => patch({ author: e.target.value })}
            className="w-full text-sm px-2 py-2 border border-stone-300 focus:outline-none focus:border-[#230532]"
            placeholder="Bakya Team"
          />
        </div>
      </div>

      {/* tags */}
      <div>
        <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
          <Tag className="w-3 h-3" /> Tags
        </label>
        <div className="flex flex-wrap gap-1.5 min-h-[34px] border border-stone-300 focus-within:border-[#230532] px-2 py-1.5">
          {data.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-xs bg-[#230532] text-white px-2 py-0.5 rounded">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-300">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                addTag(tagInput)
                setTagInput('')
              }
              if (e.key === 'Backspace' && !tagInput && data.tags.length > 0) {
                removeTag(data.tags[data.tags.length - 1])
              }
            }}
            onBlur={() => { if (tagInput) { addTag(tagInput); setTagInput('') } }}
            className="flex-1 min-w-[100px] text-sm focus:outline-none"
            placeholder={data.tags.length === 0 ? 'Add tags, press Enter…' : ''}
          />
        </div>
      </div>

      {/* cover image */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Cover Image</label>
        {data.coverImage && !data.coverImage.includes('placeholder') ? (
          <div className="relative">
            <div className="relative aspect-video w-full bg-stone-100 overflow-hidden max-w-sm">
              <Image src={data.coverImage} alt="Cover" fill className="object-cover" />
            </div>
            <button
              type="button"
              onClick={() => patch({ coverImage: '' })}
              className="absolute top-2 left-2 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
            className="border-2 border-dashed border-stone-300 hover:border-[#230532] transition-colors p-6 text-center cursor-pointer max-w-sm"
          >
            {uploading ? (
              <p className="text-sm text-gray-500">Uploading…</p>
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-sm text-gray-500">Drop or click to upload</p>
                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP — max 5 MB</p>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          </div>
        )}
        {uploadError && <p className="text-xs text-red-600 mt-1">{uploadError}</p>}
      </div>

      {/* status + featured */}
      <div className="flex items-center gap-6 pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm text-gray-700">Status:</span>
          <div className="relative inline-flex">
            <select
              value={data.status}
              onChange={(e) => patch({ status: e.target.value as BlogStatus })}
              className="text-sm px-2 py-1.5 border border-stone-300 focus:outline-none focus:border-[#230532] bg-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.featured ?? false}
            onChange={(e) => patch({ featured: e.target.checked })}
            className="accent-[#230532]"
          />
          <span className="text-sm text-gray-700">Featured post</span>
        </label>
      </div>
    </div>
  )
}
