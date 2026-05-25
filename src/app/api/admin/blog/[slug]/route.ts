import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getRawPost, savePostFromData, trashPost } from '@/lib/blog'
import type { BlogPost, ContentBlock } from '@/types/blog'

function isAuthorized(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_session')
  const expected = process.env.NEXT_PRIVATE_ADMIN_SESSION_TOKEN
  return !!expected && cookie?.value === expected
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug } = await params
  const raw = getRawPost(slug)
  if (!raw) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ raw })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug } = await params
  const body = await req.json().catch(() => ({}))

  if (!body.title) return NextResponse.json({ error: 'title is required' }, { status: 400 })

  const targetSlug: string = body.slug ?? slug

  savePostFromData(targetSlug, {
    title: body.title,
    excerpt: body.excerpt ?? '',
    content: '',
    category: body.category,
    tags: body.tags ?? [],
    author: body.author ?? 'Bakya Team',
    coverImage: body.coverImage ?? '',
    status: (body.status ?? 'draft') as BlogPost['status'],
    featured: body.featured ?? false,
    datePublished: body.datePublished,
    dateModified: undefined as unknown as string,
    blocks: (body.blocks ?? []) as ContentBlock[],
    seo: body.seo,
  })

  return NextResponse.json({ ok: true, slug: targetSlug })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug } = await params
  const moved = trashPost(slug)
  if (!moved) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
