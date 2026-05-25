import Link from 'next/link'
import { getAllPostsForAdmin } from '@/lib/blog'
import { FileText, Plus, Eye } from 'lucide-react'

export default function AdminDashboardPage() {
  const posts = getAllPostsForAdmin()
  const published = posts.filter((p) => p.status === 'published').length
  const drafts = posts.filter((p) => p.status === 'draft').length

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-[#230532] mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-stone-200 p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Total Posts</p>
          <p className="text-3xl font-serif font-bold text-[#230532]">{posts.length}</p>
        </div>
        <div className="bg-white border border-stone-200 p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Published</p>
          <p className="text-3xl font-serif font-bold text-green-700">{published}</p>
        </div>
        <div className="bg-white border border-stone-200 p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Drafts</p>
          <p className="text-3xl font-serif font-bold text-amber-700">{drafts}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-[#230532] text-white px-5 py-2.5 text-sm font-medium hover:bg-purple-900 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
        <Link
          href="/admin/blog"
          className="flex items-center gap-2 border border-stone-300 text-gray-700 px-5 py-2.5 text-sm font-medium hover:border-[#230532] hover:text-[#230532] transition-colors"
        >
          <FileText className="w-4 h-4" />
          Manage Posts
        </Link>
        <Link
          href="/blog"
          target="_blank"
          className="flex items-center gap-2 border border-stone-300 text-gray-700 px-5 py-2.5 text-sm font-medium hover:border-[#230532] hover:text-[#230532] transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Blog
        </Link>
      </div>

      {/* Recent posts */}
      {posts.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-4">Recent Posts</h2>
          <div className="bg-white border border-stone-200 divide-y divide-stone-100">
            {posts.slice(0, 5).map((post) => (
              <div key={post.slug} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{post.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {post.category} ·{' '}
                    {new Date(post.dateModified).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] px-2 py-0.5 uppercase tracking-wider font-semibold ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {post.status}
                  </span>
                  <Link
                    href={`/admin/blog/${post.slug}/edit`}
                    className="text-xs text-[#230532] hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
