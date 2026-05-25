import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/blog'
import BlogWizard from '@/components/admin/blog/BlogWizard'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function AdminEditPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-serif font-semibold text-[#230532]">Edit Post</h1>
        <p className="text-sm text-gray-500 mt-0.5 font-mono">{slug}</p>
      </div>
      <BlogWizard initialData={post} isEdit />
    </div>
  )
}
