import Link from 'next/link'
import { Star, CheckCircle2, XCircle, AlertCircle, Pencil } from 'lucide-react'
import { getAllPostsForAdmin, getPostBySlug } from '@/lib/blog'
import { calculateSeoMetrics } from '@/lib/blog/seo-metrics'
import type { BlogListItem } from '@/types/blog'

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-bold ${score >= 80 ? 'text-green-700' : score >= 50 ? 'text-amber-700' : 'text-red-700'}`}>
        {score}
      </span>
    </div>
  )
}

export default function ReviewQueuePage() {
  const drafts = getAllPostsForAdmin().filter((p) => p.status === 'draft') as BlogListItem[]

  const withMetrics = drafts.map((post) => {
    const full = getPostBySlug(post.slug)
    const metrics = calculateSeoMetrics({
      title: post.title,
      excerpt: post.excerpt,
      blocks: full?.blocks ?? [],
      coverImage: post.coverImage,
      tags: post.tags,
      category: post.category as string,
    })
    return { post, metrics }
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-serif font-semibold text-[#230532] flex items-center gap-2">
          <Star className="w-5 h-5" /> Review Queue
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {drafts.length} draft{drafts.length !== 1 ? 's' : ''} waiting for review
        </p>
      </div>

      {withMetrics.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-400 opacity-60" />
          <p className="text-sm">No drafts. All clear!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {withMetrics.map(({ post, metrics }) => (
            <div key={post.slug} className="bg-white border border-stone-200 p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h2 className="font-medium text-gray-800">{post.title}</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono">{post.slug}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/blog/${post.slug}/edit`}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 border border-[#230532] text-[#230532] hover:bg-[#230532] hover:text-white transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </Link>
                </div>
              </div>

              {/* SEO score bar */}
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">SEO Score</div>
                <ScoreBar score={metrics.score} />
              </div>

              {/* checklist */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {metrics.checks.map((check) => (
                  <div key={check.id} className="flex items-center gap-1.5 text-xs">
                    {check.passed ? (
                      <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                    ) : check.required ? (
                      <XCircle className="w-3 h-3 text-red-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                    )}
                    <span className={check.passed ? 'text-gray-500' : check.required ? 'text-red-700 font-medium' : 'text-amber-700'}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-400 mt-3 pt-3 border-t border-stone-100">
                {metrics.wordCount.toLocaleString()} words · ~{metrics.readingTimeMin} min read · {post.category}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
