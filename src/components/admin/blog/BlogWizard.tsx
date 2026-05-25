'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { BlogPost, ContentBlock, AdminFormStep } from '@/types/blog'
import { BLOG_CATEGORIES } from '@/types/blog'
import StepIndicator from './StepIndicator'
import BasicInfoStep from './create-steps/BasicInfoStep'
import ContentStep from './create-steps/ContentStep'
import ReviewStep from './create-steps/ReviewStep'

type BasicFields = {
  title: string
  slug: string
  excerpt: string
  category: BlogPost['category']
  tags: string[]
  author: string
  coverImage: string
  status: BlogPost['status']
  featured: boolean
}

type SeoOverrides = {
  metaTitle?: string
  metaDescription?: string
}

interface Props {
  initialData?: Partial<BlogPost> & { slug?: string }
  isEdit?: boolean
}

function defaultBasic(): BasicFields {
  return {
    title: '',
    slug: '',
    excerpt: '',
    category: BLOG_CATEGORIES[0],
    tags: [],
    author: 'Bakya Team',
    coverImage: '',
    status: 'draft',
    featured: false,
  }
}

export default function BlogWizard({ initialData, isEdit = false }: Props) {
  const router = useRouter()

  const [step, setStep] = useState<AdminFormStep>(1)
  const [saving, setSaving] = useState(false)

  const [basic, setBasic] = useState<BasicFields>(() => ({
    title: initialData?.title ?? '',
    slug: initialData?.slug ?? '',
    excerpt: initialData?.excerpt ?? '',
    category: initialData?.category ?? BLOG_CATEGORIES[0],
    tags: initialData?.tags ?? [],
    author: initialData?.author ?? 'Bakya Team',
    coverImage: initialData?.coverImage ?? '',
    status: initialData?.status ?? 'draft',
    featured: initialData?.featured ?? false,
  }))

  const [blocks, setBlocks] = useState<ContentBlock[]>(() => initialData?.blocks ?? [])

  const [seo, setSeo] = useState<SeoOverrides>(() => ({
    metaTitle: initialData?.seo?.metaTitle ?? '',
    metaDescription: initialData?.seo?.metaDescription ?? '',
  }))

  // ── Validation ────────────────────────────────────────────────────────────────

  function validateStep1(): string | null {
    if (!basic.title.trim()) return 'Post title is required.'
    if (!basic.slug.trim()) return 'URL slug is required.'
    if (!basic.excerpt.trim()) return 'Excerpt is required.'
    return null
  }

  function validateStep2(): string | null {
    if (blocks.length === 0) return 'Add at least one content block.'
    return null
  }

  // ── Navigation ────────────────────────────────────────────────────────────────

  function goNext() {
    if (step === 1) {
      const err = validateStep1()
      if (err) { toast.error(err); return }
    }
    if (step === 2) {
      const err = validateStep2()
      if (err) { toast.error(err); return }
    }
    setStep((s) => Math.min(3, s + 1) as AdminFormStep)
  }

  function goBack() {
    setStep((s) => Math.max(1, s - 1) as AdminFormStep)
  }

  // ── Save ──────────────────────────────────────────────────────────────────────

  async function submit(status: BlogPost['status']) {
    const err = validateStep1()
    if (err) { toast.error(err); setStep(1); return }

    setSaving(true)
    try {
      const payload = {
        title: basic.title,
        slug: basic.slug,
        excerpt: basic.excerpt,
        category: basic.category,
        tags: basic.tags,
        author: basic.author,
        coverImage: basic.coverImage,
        status,
        featured: basic.featured,
        blocks,
        seo: {
          metaTitle: seo.metaTitle || undefined,
          metaDescription: seo.metaDescription || undefined,
        },
      }

      let res: Response
      if (isEdit && initialData?.slug) {
        res = await fetch(`/api/admin/blog/${initialData.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/admin/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed')

      toast.success(status === 'published' ? 'Post published!' : 'Draft saved.')
      router.push('/admin/blog')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveDraft() { await submit('draft') }
  async function handlePublish() { await submit('published') }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div>
      <StepIndicator current={step} onSaveDraft={handleSaveDraft} saving={saving} />

      {step === 1 && (
        <BasicInfoStep data={basic} onChange={setBasic} />
      )}
      {step === 2 && (
        <ContentStep blocks={blocks} onChange={setBlocks} />
      )}
      {step === 3 && (
        <ReviewStep
          title={basic.title}
          excerpt={basic.excerpt}
          blocks={blocks}
          coverImage={basic.coverImage}
          tags={basic.tags}
          category={basic.category}
          seo={seo}
          onSeoChange={setSeo}
          onPublish={handlePublish}
          onSaveDraft={handleSaveDraft}
          publishing={saving}
        />
      )}

      {/* nav buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-200">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1 || saving}
          className="px-4 py-2 text-sm border border-stone-300 text-gray-600 hover:border-stone-500 disabled:opacity-30 transition-colors"
        >
          ← Back
        </button>
        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={saving}
            className="px-5 py-2 text-sm bg-[#230532] text-white hover:bg-[#3a0952] disabled:opacity-50 transition-colors"
          >
            Continue →
          </button>
        ) : (
          <span className="text-xs text-gray-400">Use the buttons above to publish or save.</span>
        )}
      </div>
    </div>
  )
}
