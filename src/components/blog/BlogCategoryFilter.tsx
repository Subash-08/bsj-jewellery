import Link from 'next/link'
import { BLOG_CATEGORIES, categoryToSlug } from '@/types/blog'
import type { BlogCategory } from '@/types/blog'

interface Props {
  active?: BlogCategory
}

export default function BlogCategoryFilter({ active }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={`px-4 py-1.5 text-sm border transition-colors ${
          !active
            ? 'bg-[#230532] text-white border-[#230532]'
            : 'border-stone-300 text-gray-700 hover:border-[#230532] hover:text-[#230532]'
        }`}
      >
        All
      </Link>
      {BLOG_CATEGORIES.map((cat) => (
        <Link
          key={cat}
          href={`/blog/category/${categoryToSlug(cat)}`}
          className={`px-4 py-1.5 text-sm border transition-colors ${
            active === cat
              ? 'bg-[#230532] text-white border-[#230532]'
              : 'border-stone-300 text-gray-700 hover:border-[#230532] hover:text-[#230532]'
          }`}
        >
          {cat}
        </Link>
      ))}
    </div>
  )
}
