import Link from 'next/link'
import { BLOG_CATEGORIES, categoryToSlug } from '@/types/blog'
import type { BlogListItem } from '@/types/blog'

interface Props {
  recentPosts?: BlogListItem[]
  activeCategorySlug?: string
}

export default function BlogSidebar({ recentPosts = [], activeCategorySlug }: Props) {
  return (
    <aside className="space-y-8 sticky top-36">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold text-[#230532] uppercase tracking-widest mb-4">
          Categories
        </h3>
        <ul className="space-y-2.5">
          <li>
            <Link
              href="/blog"
              className={`text-sm transition-colors ${
                !activeCategorySlug
                  ? 'text-[#230532] font-semibold'
                  : 'text-gray-600 hover:text-[#230532]'
              }`}
            >
              All Posts
            </Link>
          </li>
          {BLOG_CATEGORIES.map((cat) => (
            <li key={cat}>
              <Link
                href={`/blog/category/${categoryToSlug(cat)}`}
                className={`text-sm transition-colors ${
                  activeCategorySlug === categoryToSlug(cat)
                    ? 'text-[#230532] font-semibold'
                    : 'text-gray-600 hover:text-[#230532]'
                }`}
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#230532] uppercase tracking-widest mb-4">
            Recent Posts
          </h3>
          <ul className="space-y-4">
            {recentPosts.slice(0, 5).map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <p className="text-sm font-medium text-gray-800 group-hover:text-[#230532] transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(post.datePublished).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="bg-[#230532] text-white p-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-2">
          Shop Silver Jewellery
        </h3>
        <p className="text-xs text-white/70 mb-4 leading-relaxed">
          BIS Hallmarked 92.5 Silver — Handcrafted in Tirunelveli
        </p>
        <Link
          href="/silver-jewellery"
          className="inline-block text-xs bg-[#D4AF37] text-[#230532] font-semibold px-4 py-2 hover:bg-amber-400 transition-colors"
        >
          Browse Collection
        </Link>
      </div>
    </aside>
  )
}
