import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAllPostsForAdmin, savePostFromData } from '@/lib/blog'
import type { BlogPost, ContentBlock } from '@/types/blog'

function isAuthorized(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_session')
  const expected = process.env.NEXT_PRIVATE_ADMIN_SESSION_TOKEN
  return !!expected && cookie?.value === expected
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ posts: getAllPostsForAdmin() })
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { slug } = body as { slug?: string }

  if (!slug) return NextResponse.json({ error: 'slug is required' }, { status: 400 })
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Slug must be lowercase letters, digits, and hyphens' }, { status: 400 })
  }
  if (!body.title) return NextResponse.json({ error: 'title is required' }, { status: 400 })

  savePostFromData(slug, {
    title: body.title,
    excerpt: body.excerpt ?? '',
    content: '',
    category: body.category,
    tags: body.tags ?? [],
    author: body.author ?? 'Bakya Team',
    coverImage: body.coverImage ?? '',
    status: (body.status ?? 'draft') as BlogPost['status'],
    featured: body.featured ?? false,
    datePublished: undefined as unknown as string,
    dateModified: undefined as unknown as string,
    blocks: (body.blocks ?? []) as ContentBlock[],
    seo: body.seo,
  })

  return NextResponse.json({ ok: true, slug }, { status: 201 })
}
