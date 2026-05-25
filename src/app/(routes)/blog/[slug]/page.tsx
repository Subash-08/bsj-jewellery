import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Calendar } from 'lucide-react'
import { SITE } from '@/lib/seo.config'
import { getPostBySlug, getPublishedPosts, getRelatedPosts } from '@/lib/blog'
import { blogPostingSchema, breadcrumbSchema, faqSchema } from '@/lib/schema'
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
  const imageUrl = post.coverImage.startsWith('http')
    ? post.coverImage
    : `${SITE.domain}${post.coverImage}`

  return {
    title,
    description,
    keywords: post.tags.join(', '),
    // Robots directives — max-snippet/-image allows AI overviews and snippets
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
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
      section: post.category,
      tags: post.tags,
      images: post.coverImage
        ? [{ url: imageUrl, width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.coverImage ? [imageUrl] : undefined,
      site: '@bakya_jewels',
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
  const imageUrl = post.coverImage.startsWith('http')
    ? post.coverImage
    : `${SITE.domain}${post.coverImage}`

  const readingTimeMinutes = parseInt(post.readingTime ?? '0', 10) || undefined

  const postSchema = blogPostingSchema({
    title: post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    url: postUrl,
    image: imageUrl,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    authorName: post.author,
    tags: post.tags,
    category: post.category,
    wordCount: post.wordCount,
    readingTimeMinutes,
  })

  const crumbSchema = breadcrumbSchema([
    { name: 'Home', url: SITE.domain },
    { name: 'Blog', url: `${SITE.domain}/blog` },
    { name: post.title, url: postUrl },
  ])

  // Extract FAQ Schema if FAQ block exists
  let faqSchemaJson = null;
  if (post.blocks) {
    const faqBlocks = post.blocks.filter(b => b.type === 'faq');
    if (faqBlocks.length > 0) {
      const allFaqs: { q: string, a: string }[] = [];
      faqBlocks.forEach(b => {
        try {
          const items = JSON.parse(b.content);
          if (Array.isArray(items)) {
            allFaqs.push(...items);
          }
        } catch (e) { }
      });
      if (allFaqs.length > 0) {
        faqSchemaJson = JSON.stringify(faqSchema(allFaqs));
      }
    }
  }

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
      {faqSchemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqSchemaJson }}
        />
      )}

      <main className="bg-white min-h-screen pt-8 pb-20">
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
            <article className="lg:col-span-9">

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

              {/* Excerpt (Speakable target for AEO) */}
              <div className="post-excerpt text-lg text-gray-600 mb-6 leading-relaxed font-serif italic border-l-2 border-[#D4AF37] pl-4">
                {post.excerpt}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-stone-200">
                <span className="font-medium text-gray-700">{post.author}</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.datePublished}>
                    {new Date(post.datePublished).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readingTime}
                </span>
                {post.wordCount && (
                  <span className="text-xs text-gray-400">{post.wordCount.toLocaleString()} words</span>
                )}
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
                        #{tag}
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
            </article>

            {/* Sidebar */}
            <div className="lg:col-span-3">
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
