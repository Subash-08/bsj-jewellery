import Link from 'next/link'
import { LayoutDashboard, FileText, Plus } from 'lucide-react'
import AdminLogoutButton from '@/components/admin/AdminLogoutButton'

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#230532] text-white flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Bakya</p>
          <p className="font-serif font-semibold text-lg">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            Dashboard
          </Link>
          <Link
            href="/admin/blog"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <FileText className="w-4 h-4 shrink-0" />
            Blog Posts
          </Link>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <Plus className="w-4 h-4 shrink-0" />
            New Post
          </Link>
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
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
    </div>
  )
}
