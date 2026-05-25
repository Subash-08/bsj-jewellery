'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'

interface Props {
  src: string
  altText: string
  caption: string
  onChange: (src: string, altText: string, caption: string) => void
}

export default function ImageBlock({ src, altText, caption, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError('')
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large (max 5 MB)')
      return
    }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      onChange(data.url, altText, caption)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      {src ? (
        <div className="relative">
          <div className="relative aspect-video bg-stone-100 overflow-hidden">
            <Image src={src} alt={altText || 'Block image'} fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={() => onChange('', altText, caption)}
            className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const file = e.dataTransfer.files[0]
            if (file) handleFile(file)
          }}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-stone-300 hover:border-[#230532] transition-colors rounded p-8 text-center cursor-pointer"
        >
          {uploading ? (
            <p className="text-sm text-gray-500">Uploading...</p>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Drop image here or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 5 MB</p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Alt text *</label>
          <input
            type="text"
            value={altText}
            onChange={(e) => onChange(src, e.target.value, caption)}
            className="w-full text-sm px-2 py-1.5 border border-stone-300 focus:outline-none focus:border-[#230532]"
            placeholder="Describe the image for SEO"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Caption (optional)</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => onChange(src, altText, e.target.value)}
            className="w-full text-sm px-2 py-1.5 border border-stone-300 focus:outline-none focus:border-[#230532]"
            placeholder="Image caption"
          />
        </div>
      </div>

      {/* URL fallback */}
      {!src && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Or enter image URL</label>
          <input
            type="url"
            onBlur={(e) => {
              if (e.target.value.startsWith('http')) onChange(e.target.value, altText, caption)
            }}
            className="w-full text-sm px-2 py-1.5 border border-stone-300 focus:outline-none focus:border-[#230532]"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      )}
    </div>
  )
}
