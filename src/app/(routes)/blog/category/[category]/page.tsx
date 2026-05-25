import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/seo.config'
import { getPostsByCategory } from '@/lib/blog'
import { slugToCategory } from '@/types/blog'
import BlogGrid from '@/components/blog/BlogGrid'
import BlogPagination from '@/components/blog/BlogPagination'
import BlogCategoryFilter from '@/components/blog/BlogCategoryFilter'
import BlogSidebar from '@/components/blog/BlogSidebar'
import BlogBreadcrumb from '@/components/blog/BlogBreadcrumb'

export const revalidate = 3600

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const category = slugToCategory(slug)
  if (!category) return {}

  const title = `${category} — Bakya Journal`
  const description = `All articles about ${category} from the Bakya Journal — silver jewellery guides from Tirunelveli.`
  const url = `${SITE.domain}/blog/category/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
  }
}

export default async function BlogCategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params
  const category = slugToCategory(slug)
  if (!category) notFound()

  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const { posts, meta } = getPostsByCategory(category, page)

  return (
    <main className="bg-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-[1400px]">

        {/* Breadcrumb */}
        <div className="mb-6">
          <BlogBreadcrumb
            crumbs={[
              { label: 'Blog', href: '/blog' },
              { label: category },
            ]}
          />
        </div>

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs text-amber-700 font-semibold uppercase tracking-widest mb-2">
            Category
          </p>
          <h1 className="text-4xl font-serif font-bold text-[#230532] mb-3">
            {category}
          </h1>
          <p className="text-gray-600">
            {meta.total} {meta.total === 1 ? 'article' : 'articles'} in this category
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <BlogCategoryFilter active={category} />
        </div>

        {/* Grid + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <BlogGrid posts={posts} />
            <BlogPagination meta={meta} basePath={`/blog/category/${slug}`} />
          </div>
          <div className="lg:col-span-4">
            <BlogSidebar activeCategorySlug={slug} />
          </div>
        </div>

      </div>
    </main>
  )
}
