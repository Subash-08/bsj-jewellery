'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function AdminLogoutButton() {
  const router = useRouter()

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-white transition-colors w-full text-left"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  )
}
