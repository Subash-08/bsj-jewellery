import type { Metadata } from 'next'
import { SITE, BLOG_CONFIG } from '@/lib/seo.config'
import { getPaginatedPosts, getPublishedPosts } from '@/lib/blog'
import { blogListSchema } from '@/lib/schema'
import BlogGrid from '@/components/blog/BlogGrid'
import BlogPagination from '@/components/blog/BlogPagination'
import BlogCategoryFilter from '@/components/blog/BlogCategoryFilter'
import BlogSidebar from '@/components/blog/BlogSidebar'

export const metadata: Metadata = {
  title: BLOG_CONFIG.title,
  description: BLOG_CONFIG.description,
  alternates: { canonical: `${SITE.domain}/blog` },
  openGraph: {
    title: BLOG_CONFIG.title,
    description: BLOG_CONFIG.description,
    url: `${SITE.domain}/blog`,
    siteName: SITE.name,
    type: 'website',
  },
}

export const revalidate = 3600

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogListPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const { posts, meta } = getPaginatedPosts(page)
  const recentPosts = getPublishedPosts().slice(0, 5)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema()) }}
      />
      <main className="bg-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-[1400px]">

          {/* Page header */}
          <div className="mb-10">
            <p className="text-xs text-amber-700 font-semibold uppercase tracking-widest mb-2">
              From Our Workshop
            </p>
            <h1 className="text-4xl font-serif font-bold text-[#230532] mb-3">
              Bakya Journal
            </h1>
            <p className="text-gray-600 max-w-2xl leading-relaxed">
              Silver care guides, Tamil jewellery traditions, gifting ideas, and stories from our Tirunelveli workshop.
            </p>
          </div>

          {/* Category filter */}
          <div className="mb-8">
            <BlogCategoryFilter />
          </div>

          {/* Grid + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <BlogGrid posts={posts} featuredFirst={page === 1} />
              <BlogPagination meta={meta} basePath="/blog" />
            </div>
            <div className="lg:col-span-4">
              <BlogSidebar recentPosts={recentPosts} />
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
