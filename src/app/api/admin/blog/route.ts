import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAllPostsForAdmin, savePost } from '@/lib/blog'

function isAuthorized(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_session')
  const expected = process.env.NEXT_PRIVATE_ADMIN_SESSION_TOKEN
  return !!expected && cookie?.value === expected
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const posts = getAllPostsForAdmin()
  return NextResponse.json({ posts })
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { slug, raw } = body as { slug?: string; raw?: string }

  if (!slug || !raw) {
    return NextResponse.json({ error: 'slug and raw are required' }, { status: 400 })
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: 'Slug must be lowercase letters, digits, and hyphens only' },
      { status: 400 },
    )
  }

  savePost(slug, raw)
  return NextResponse.json({ ok: true, slug }, { status: 201 })
}
