'use client'

import { useState, useEffect, useCallback } from 'react'
import { FolderOpen, Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import type { BlogCategoryConfig } from '@/types/blog'

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '').slice(0, 60)
}

interface EditState {
  name: string
  description: string
  slug: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<BlogCategoryConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newCat, setNewCat] = useState<EditState>({ name: '', description: '', slug: '' })
  const [editing, setEditing] = useState<string | null>(null)
  const [editState, setEditState] = useState<EditState>({ name: '', description: '', slug: '' })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/categories')
      const data = await res.json()
      setCategories(data.categories ?? [])
    } catch {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function saveCategory(data: EditState, isNew: boolean) {
    if (!data.name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, slug: data.slug || slugify(data.name) }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success(isNew ? 'Category created.' : 'Category updated.')
      setCreating(false)
      setEditing(null)
      setNewCat({ name: '', description: '', slug: '' })
      await load()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function deleteCategory(slug: string, hasPost: boolean) {
    if (hasPost) { toast.error('Cannot delete a category that has posts.'); return }
    if (!confirm('Delete this category?')) return
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Category deleted.')
      await load()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  function startEdit(cat: BlogCategoryConfig) {
    setEditing(cat.slug)
    setEditState({ name: cat.name, description: cat.description, slug: cat.slug })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-serif font-semibold text-[#230532] flex items-center gap-2">
            <FolderOpen className="w-5 h-5" /> Categories
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage blog post categories</p>
        </div>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-[#230532] text-white hover:bg-[#3a0952] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Category
          </button>
        )}
      </div>

      {/* new category form */}
      {creating && (
        <div className="bg-white border border-[#230532] p-4 mb-4 space-y-3">
          <h3 className="text-sm font-semibold text-[#230532]">New Category</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Name *</label>
              <input
                type="text"
                value={newCat.name}
                onChange={(e) => setNewCat((p) => ({ ...p, name: e.target.value, slug: slugify(e.target.value) }))}
                className="w-full text-sm px-2 py-1.5 border border-stone-300 focus:outline-none focus:border-[#230532]"
                placeholder="e.g. Silver Care"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Slug</label>
              <input
                type="text"
                value={newCat.slug}
                onChange={(e) => setNewCat((p) => ({ ...p, slug: slugify(e.target.value) }))}
                className="w-full text-sm px-2 py-1.5 border border-stone-300 focus:outline-none focus:border-[#230532] font-mono"
                placeholder="auto-generated"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Description</label>
            <input
              type="text"
              value={newCat.description}
              onChange={(e) => setNewCat((p) => ({ ...p, description: e.target.value }))}
              className="w-full text-sm px-2 py-1.5 border border-stone-300 focus:outline-none focus:border-[#230532]"
              placeholder="Short description for the category page"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => saveCategory(newCat, true)}
              disabled={saving}
              className="text-sm px-4 py-1.5 bg-[#230532] text-white hover:bg-[#3a0952] disabled:opacity-50 transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => { setCreating(false); setNewCat({ name: '', description: '', slug: '' }) }}
              className="text-sm px-4 py-1.5 border border-stone-300 text-gray-600 hover:border-stone-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <div className="bg-white border border-stone-200">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden lg:table-cell">Description</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 w-16">Posts</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.slug} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                  {editing === cat.slug ? (
                    <>
                      <td className="px-4 py-2" colSpan={4}>
                        <div className="flex flex-wrap gap-2 items-center">
                          <input
                            type="text"
                            value={editState.name}
                            onChange={(e) => setEditState((p) => ({ ...p, name: e.target.value }))}
                            className="text-sm px-2 py-1 border border-stone-300 focus:outline-none focus:border-[#230532] w-40"
                          />
                          <input
                            type="text"
                            value={editState.description}
                            onChange={(e) => setEditState((p) => ({ ...p, description: e.target.value }))}
                            className="text-sm px-2 py-1 border border-stone-300 focus:outline-none focus:border-[#230532] flex-1 min-w-[160px]"
                            placeholder="Description"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => saveCategory(editState, false)}
                            disabled={saving}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-700">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium text-gray-800">{cat.name}</td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs hidden md:table-cell">{cat.slug}</td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell line-clamp-1">{cat.description}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{cat.postCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(cat)}
                            className="text-gray-400 hover:text-[#230532] transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteCategory(cat.slug, cat.postCount > 0)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
