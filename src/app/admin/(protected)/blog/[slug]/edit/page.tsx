import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/blog'
import AdminPostForm from '@/components/admin/AdminPostForm'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function AdminEditPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-[#230532] mb-8">
        Edit Post — <span className="font-mono text-lg text-gray-500">{slug}</span>
      </h1>
      <AdminPostForm
        initialData={{
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          tags: post.tags.join(', '),
          author: post.author,
          coverImage: post.coverImage,
          status: post.status,
          featured: post.featured ?? false,
          content: post.content,
        }}
        isEdit
        originalSlug={slug}
      />
    </div>
  )
}
