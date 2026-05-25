'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Login failed')
      router.push('/admin')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Bakya Admin"
            width={80}
            height={80}
            className="mx-auto mb-4 object-contain"
          />
          <h1 className="text-2xl font-serif font-bold text-[#230532]">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">Bakya Content Management</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-[#230532]"
              placeholder="Enter admin password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#230532] text-white py-2.5 text-sm font-medium hover:bg-purple-900 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Set <code className="bg-stone-100 px-1">NEXT_PRIVATE_ADMIN_PASSWORD</code> in .env.local
        </p>
      </div>
    </main>
  )
}
