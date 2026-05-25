import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getRawPost, savePost, deletePost } from '@/lib/blog'

function isAuthorized(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_session')
  const expected = process.env.NEXT_PRIVATE_ADMIN_SESSION_TOKEN
  return !!expected && cookie?.value === expected
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { slug } = await params
  const raw = getRawPost(slug)
  if (!raw) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ raw })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { slug } = await params
  const body = await req.json()
  const { slug: newSlug, raw } = body as { slug?: string; raw?: string }

  if (!raw) {
    return NextResponse.json({ error: 'raw is required' }, { status: 400 })
  }

  const targetSlug = newSlug ?? slug
  savePost(targetSlug, raw)
  return NextResponse.json({ ok: true, slug: targetSlug })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { slug } = await params
  deletePost(slug)
  return NextResponse.json({ ok: true })
}
