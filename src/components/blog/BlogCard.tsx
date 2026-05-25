import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import type { BlogListItem } from '@/types/blog'

interface Props {
  post: BlogListItem
  featured?: boolean
}

export default function BlogCard({ post, featured = false }: Props) {
  const href = `/blog/${post.slug}`
  const date = new Date(post.datePublished).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  if (featured) {
    return (
      <Link
        href={href}
        className="group block overflow-hidden bg-white border border-stone-200 hover:shadow-lg transition-shadow"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-4 left-4 bg-[#230532] text-white text-xs px-3 py-1 uppercase tracking-wider">
            {post.category}
          </span>
        </div>
        <div className="p-6 lg:p-8">
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-3 group-hover:text-[#230532] transition-colors">
            {post.title}
          </h2>
          <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed">{post.excerpt}</p>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="font-medium text-gray-700">{post.author}</span>
            <span>·</span>
            <span>{date}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden bg-white border border-stone-200 hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] overflow-hidden shrink-0">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-[#230532] text-white text-[10px] px-2 py-0.5 uppercase tracking-wider">
          {post.category}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-base font-serif font-semibold text-gray-900 mb-2 group-hover:text-[#230532] transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto">
          <span>{date}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTime}
          </span>
        </div>
      </div>
    </Link>
  )
}
