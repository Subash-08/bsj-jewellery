'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  slug: string
}

export default function AdminDeleteButton({ slug }: Props) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Move "${slug}" to trash?`)) return
    try {
      const res = await fetch(`/api/admin/blog/${slug}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error ?? 'Failed to move post to trash')
        return
      }
      toast.success('Post moved to trash.')
      router.refresh()
    } catch {
      toast.error('Failed to move post to trash')
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-gray-400 hover:text-red-600 transition-colors"
      title="Move to trash"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
