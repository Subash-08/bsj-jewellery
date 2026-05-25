'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface Props {
  slug: string
}

export default function AdminDeleteButton({ slug }: Props) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/admin/blog/${slug}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error ?? 'Failed to delete post')
        return
      }
      router.refresh()
    } catch {
      alert('Failed to delete post')
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-gray-400 hover:text-red-600 transition-colors"
      title="Delete post"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
