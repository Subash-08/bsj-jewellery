'use client'

import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import type { ContentBlock, BlogPost } from '@/types/blog'
import { calculateSeoMetrics } from '@/lib/blog/seo-metrics'

interface SeoOverrides {
  metaTitle?: string
  metaDescription?: string
}

interface Props {
  title: string
  excerpt: string
  blocks: ContentBlock[]
  coverImage: string
  tags: BlogPost['tags']
  category: BlogPost['category']
  seo: SeoOverrides
  onSeoChange: (seo: SeoOverrides) => void
  onPublish: () => void
  onSaveDraft: () => void
  publishing?: boolean
}

function ScoreRing({ score }: { score: number }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626'

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={radius} fill="none" stroke="#e7e5e4" strokeWidth="8" />
        <circle
          cx="44" cy="44" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold" style={{ color }}>{score}</div>
        <div className="text-[10px] text-gray-500">/ 100</div>
      </div>
    </div>
  )
}

export default function ReviewStep({
  title, excerpt, blocks, coverImage, tags, category, seo, onSeoChange, onPublish, onSaveDraft, publishing,
}: Props) {
  const metrics = calculateSeoMetrics({
    title,
    excerpt,
    blocks,
    coverImage,
    tags,
    category: category as string,
    seoTitle: seo.metaTitle,
  })

  const serp = {
    title: seo.metaTitle || title,
    description: seo.metaDescription || excerpt,
    url: `bakya.in/blog/${title.toLowerCase().replace(/\s+/g, '-').slice(0, 40)}`,
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* SEO score */}
      <div className="border border-stone-200 p-4 flex gap-6 items-start">
        <ScoreRing score={metrics.score} />
        <div className="flex-1 space-y-1.5">
          <h3 className="text-sm font-semibold text-gray-800">SEO Readiness Score</h3>
          <p className="text-xs text-gray-500">
            {metrics.wordCount.toLocaleString()} words · ~{metrics.readingTimeMin} min read
          </p>
          <div className="space-y-1 mt-2">
            {metrics.checks.map((check) => (
              <div key={check.id} className="flex items-center gap-2 text-xs">
                {check.passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                ) : check.required ? (
                  <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span className={check.passed ? 'text-gray-600' : check.required ? 'text-red-700 font-medium' : 'text-amber-700'}>
                  {check.label}
                </span>
                {check.required && !check.passed && (
                  <span className="text-[10px] text-red-400 ml-auto">required</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SERP preview */}
      <div className="border border-stone-200 p-4 space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Google SERP Preview</h3>
        <div className="bg-white border border-stone-100 p-3 rounded max-w-lg">
          <div className="text-xs text-gray-400 truncate">{serp.url}</div>
          <div className="text-base text-blue-700 hover:underline cursor-pointer truncate">
            {serp.title.slice(0, 60)}{serp.title.length > 60 ? '…' : ''}
          </div>
          <div className="text-sm text-gray-600 leading-snug">
            {serp.description.slice(0, 160)}{serp.description.length > 160 ? '…' : ''}
          </div>
        </div>
      </div>

      {/* SEO overrides */}
      <div className="border border-stone-200 p-4 space-y-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">SEO Overrides (optional)</h3>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-gray-600">Meta Title</label>
            <span className={`text-xs ${(seo.metaTitle ?? '').length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
              {(seo.metaTitle ?? '').length}/60
            </span>
          </div>
          <input
            type="text"
            value={seo.metaTitle ?? ''}
            onChange={(e) => onSeoChange({ ...seo, metaTitle: e.target.value })}
            className="w-full text-sm px-2 py-1.5 border border-stone-300 focus:outline-none focus:border-[#230532]"
            placeholder="Defaults to post title if empty"
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-gray-600">Meta Description</label>
            <span className={`text-xs ${(seo.metaDescription ?? '').length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
              {(seo.metaDescription ?? '').length}/160
            </span>
          </div>
          <textarea
            value={seo.metaDescription ?? ''}
            onChange={(e) => onSeoChange({ ...seo, metaDescription: e.target.value })}
            rows={3}
            className="w-full text-sm px-2 py-1.5 border border-stone-300 focus:outline-none focus:border-[#230532] resize-none"
            placeholder="Defaults to excerpt if empty"
          />
        </div>
      </div>

      {/* publish actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onPublish}
          disabled={publishing}
          className="px-6 py-2 bg-[#230532] text-white text-sm font-medium hover:bg-[#3a0952] disabled:opacity-50 transition-colors"
        >
          {publishing ? 'Publishing…' : 'Publish Post'}
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={publishing}
          className="px-6 py-2 border border-stone-300 text-gray-700 text-sm hover:border-stone-500 disabled:opacity-50 transition-colors"
        >
          Save as Draft
        </button>
      </div>
    </div>
  )
}
