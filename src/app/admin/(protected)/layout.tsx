import Link from 'next/link'
import { LayoutDashboard, FileText, Plus, Star, Trash2, FolderOpen } from 'lucide-react'
import AdminLogoutButton from '@/components/admin/AdminLogoutButton'
import ToastProvider from '@/components/admin/ToastProvider'
import { getDraftCount, getTrashCount } from '@/lib/blog'

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const draftCount = getDraftCount()
  const trashCount = getTrashCount()

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-58 bg-[#230532] text-white flex flex-col shrink-0 sticky top-0 h-screen" style={{ width: '15rem' }}>
        <div className="p-5 border-b border-white/10">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">Bakya Silver</p>
          <p className="font-serif font-semibold text-lg leading-tight">Admin Panel</p>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {/* Dashboard */}
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            Dashboard
          </Link>

          {/* Blog section */}
          <div className="pt-3 pb-1 px-3">
            <span className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">Blog</span>
          </div>

          <Link
            href="/admin/blog"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <FileText className="w-4 h-4 shrink-0" />
            All Posts
          </Link>

          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <Plus className="w-4 h-4 shrink-0" />
            New Post
          </Link>

          <Link
            href="/admin/blog/review"
            className="flex items-center justify-between gap-2.5 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <Star className="w-4 h-4 shrink-0" />
              Review Queue
            </span>
            {draftCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {draftCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin/blog/trash"
            className="flex items-center justify-between gap-2.5 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <Trash2 className="w-4 h-4 shrink-0" />
              Trash
            </span>
            {trashCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {trashCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin/blog/categories"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <FolderOpen className="w-4 h-4 shrink-0" />
            Categories
          </Link>
        </nav>

        <div className="p-3 border-t border-white/10 space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            ← View Site
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto min-h-screen">{children}</main>

      <ToastProvider />
    </div>
  )
}
