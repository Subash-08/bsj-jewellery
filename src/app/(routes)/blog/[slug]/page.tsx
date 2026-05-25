import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Calendar } from 'lucide-react'
import { SITE } from '@/lib/seo.config'
import { getPostBySlug, getPublishedPosts, getRelatedPosts } from '@/lib/blog'
import { blogPostingSchema, breadcrumbSchema } from '@/lib/schema'
import BlogPostContent from '@/components/blog/BlogPostContent'
import BlogSidebar from '@/components/blog/BlogSidebar'
import BlogBreadcrumb from '@/components/blog/BlogBreadcrumb'
import RelatedPosts from '@/components/blog/RelatedPosts'
import ShareButtons from '@/components/blog/ShareButtons'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post || post.status !== 'published') return {}

  const title = post.seo?.metaTitle ?? post.title
  const description = post.seo?.metaDescription ?? post.excerpt
  const url = post.seo?.canonicalUrl ?? `${SITE.domain}/blog/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: 'article',
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      authors: [post.author],
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  }
}

export async function generateStaticParams() {
  return getPublishedPosts().map((p) => ({ slug: p.slug }))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post || post.status !== 'published') notFound()

  const related = getRelatedPosts(slug)
  const recentPosts = getPublishedPosts().slice(0, 5)
  const postUrl = `${SITE.domain}/blog/${slug}`

  const postSchema = blogPostingSchema({
    title: post.title,
    description: post.excerpt,
    url: postUrl,
    image: post.coverImage.startsWith('http')
      ? post.coverImage
      : `${SITE.domain}${post.coverImage}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    authorName: post.author,
    tags: post.tags,
  })

  const crumbSchema = breadcrumbSchema([
    { name: 'Blog', url: `${SITE.domain}/blog` },
    { name: post.title, url: postUrl },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }}
      />

      <main className="bg-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-[1400px]">

          {/* Breadcrumb */}
          <div className="mb-6">
            <BlogBreadcrumb
              crumbs={[
                { label: 'Blog', href: '/blog' },
                { label: post.title },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Main content */}
            <div className="lg:col-span-8">

              {/* Category tag */}
              <Link
                href={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-block text-xs bg-[#230532] text-white px-3 py-1 uppercase tracking-wider mb-5 hover:bg-purple-900 transition-colors"
              >
                {post.category}
              </Link>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#230532] mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-stone-200">
                <span className="font-medium text-gray-700">{post.author}</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.datePublished).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readingTime}
                </span>
              </div>

              {/* Cover image */}
              {post.coverImage && (
                <div className="relative aspect-[16/9] overflow-hidden mb-8">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <BlogPostContent content={post.content} />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-stone-200">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 bg-stone-100 text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-8 pt-6 border-t border-stone-200">
                <ShareButtons url={postUrl} title={post.title} />
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div className="mt-12 pt-10 border-t border-stone-200">
                  <RelatedPosts posts={related} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <BlogSidebar
                recentPosts={recentPosts}
                activeCategorySlug={post.category.toLowerCase().replace(/\s+/g, '-')}
              />
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
