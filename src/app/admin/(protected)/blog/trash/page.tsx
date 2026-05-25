'use client'

import { useState, useEffect, useCallback } from 'react'
import { Trash2, RotateCcw, X, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import type { TrashedPost } from '@/types/blog'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function TrashPage() {
  const [posts, setPosts] = useState<TrashedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/blog/trash')
      const data = await res.json()
      setPosts(data.posts ?? [])
    } catch {
      toast.error('Failed to load trash')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function restore(trashFilename: string) {
    setActionId(trashFilename)
    try {
      const res = await fetch('/api/admin/blog/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore', trashFilename }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Post restored.')
      await load()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Restore failed')
    } finally {
      setActionId(null)
    }
  }

  async function deletePermanently(trashFilename: string) {
    if (!confirm('Permanently delete this post? This cannot be undone.')) return
    setActionId(trashFilename)
    try {
      const res = await fetch('/api/admin/blog/trash', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trashFilename }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Post permanently deleted.')
      await load()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setActionId(null)
    }
  }

  async function emptyTrash() {
    if (!confirm(`Empty trash and permanently delete all ${posts.length} post(s)?`)) return
    setActionId('empty')
    try {
      const res = await fetch('/api/admin/blog/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'empty' }),
      })
      const data = await res.json()
      toast.success(`Emptied trash (${data.count} post${data.count !== 1 ? 's' : ''} deleted)`)
      await load()
    } catch {
      toast.error('Failed to empty trash')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-serif font-semibold text-[#230532] flex items-center gap-2">
            <Trash2 className="w-5 h-5" /> Trash
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Deleted posts are kept here for 30 days.</p>
        </div>
        {posts.length > 0 && (
          <button
            onClick={emptyTrash}
            disabled={actionId === 'empty'}
            className="text-sm px-3 py-1.5 border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            Empty Trash ({posts.length})
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Trash2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Trash is empty.</p>
        </div>
      ) : (
        <div className="border border-stone-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Post</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">Trashed</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.trashFilename} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800 line-clamp-1">{post.title}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">{post.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{post.category}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                    {formatDate(post.trashedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => restore(post.trashFilename)}
                        disabled={actionId === post.trashFilename}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Restore
                      </button>
                      <button
                        onClick={() => deletePermanently(post.trashFilename)}
                        disabled={actionId === post.trashFilename}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        Permanently deleted posts cannot be recovered.
      </div>
    </div>
  )
}
