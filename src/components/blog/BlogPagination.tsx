import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { BlogPaginationMeta } from '@/types/blog'

interface Props {
  meta: BlogPaginationMeta
  basePath: string
}

export default function BlogPagination({ meta, basePath }: Props) {
  const { page, totalPages } = meta
  if (totalPages <= 1) return null

  const pageUrl = (p: number) => (p === 1 ? basePath : `${basePath}?page=${p}`)

  return (
    <nav aria-label="Blog pagination" className="flex items-center justify-center gap-2 mt-12">
      {page > 1 && (
        <Link
          href={pageUrl(page - 1)}
          className="flex items-center gap-1 px-4 py-2 border border-stone-300 text-gray-700 hover:border-[#230532] hover:text-[#230532] transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={pageUrl(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`w-10 h-10 flex items-center justify-center text-sm border transition-colors ${
            p === page
              ? 'bg-[#230532] text-white border-[#230532]'
              : 'border-stone-300 text-gray-700 hover:border-[#230532] hover:text-[#230532]'
          }`}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link
          href={pageUrl(page + 1)}
          className="flex items-center gap-1 px-4 py-2 border border-stone-300 text-gray-700 hover:border-[#230532] hover:text-[#230532] transition-colors text-sm"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </nav>
  )
}
