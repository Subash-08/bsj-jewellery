import { NextRequest, NextResponse } from 'next/server'
import { getAdminCategories, saveCategory, deleteCategory } from '@/lib/blog'
import type { BlogCategoryConfig } from '@/types/blog'

function cookieValid(req: NextRequest): boolean {
  const token = req.cookies.get('admin_session')?.value
  return token === process.env.NEXT_PRIVATE_ADMIN_SESSION_TOKEN
}

// GET /api/admin/categories
export async function GET(req: NextRequest) {
  if (!cookieValid(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ categories: getAdminCategories() })
}

// POST /api/admin/categories — create or update
export async function POST(req: NextRequest) {
  if (!cookieValid(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({})) as Partial<BlogCategoryConfig>
  if (!body.slug || !body.name) {
    return NextResponse.json({ error: 'slug and name are required' }, { status: 400 })
  }

  const category: BlogCategoryConfig = {
    slug: body.slug.toLowerCase().replace(/\s+/g, '-'),
    name: body.name,
    description: body.description ?? '',
    postCount: 0,
  }
  saveCategory(category)
  return NextResponse.json({ category })
}

// DELETE /api/admin/categories
export async function DELETE(req: NextRequest) {
  if (!cookieValid(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  if (!body.slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const ok = deleteCategory(body.slug)
  if (!ok) return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
