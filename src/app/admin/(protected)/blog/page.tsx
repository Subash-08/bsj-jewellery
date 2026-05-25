import Link from 'next/link'
import { getAllPostsForAdmin } from '@/lib/blog'
import { Plus, Eye, Pencil } from 'lucide-react'
import AdminDeleteButton from '@/components/admin/AdminDeleteButton'

export default function AdminBlogListPage() {
  const posts = getAllPostsForAdmin()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#230532]">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-[#230532] text-white px-5 py-2.5 text-sm font-medium hover:bg-purple-900 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200">
          <p className="text-gray-500 mb-4">No posts yet.</p>
          <Link href="/admin/blog/new" className="text-sm text-[#230532] hover:underline">
            Create your first post →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-stone-200">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-3 border-b border-stone-200 bg-stone-50">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</span>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-stone-100">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{post.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono">{post.slug}</p>
                </div>
                <span className="text-xs text-gray-600">{post.category}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 uppercase tracking-wider font-semibold ${
                    post.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {post.status}
                </span>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(post.dateModified).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <div className="flex items-center gap-3">
                  {post.status === 'published' && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="text-gray-400 hover:text-[#230532] transition-colors"
                      title="View post"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/blog/${post.slug}/edit`}
                    className="text-gray-400 hover:text-[#230532] transition-colors"
                    title="Edit post"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <AdminDeleteButton slug={post.slug} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
