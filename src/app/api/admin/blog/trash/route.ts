import { NextRequest, NextResponse } from 'next/server'
import {
  getTrashedPosts,
  restorePost,
  permanentlyDeletePost,
  emptyTrash,
} from '@/lib/blog'

function cookieValid(req: NextRequest): boolean {
  const token = req.cookies.get('admin_session')?.value
  return token === process.env.NEXT_PRIVATE_ADMIN_SESSION_TOKEN
}

// GET /api/admin/blog/trash
export async function GET(req: NextRequest) {
  if (!cookieValid(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ posts: getTrashedPosts() })
}

// POST /api/admin/blog/trash — restore or empty
export async function POST(req: NextRequest) {
  if (!cookieValid(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))

  if (body.action === 'empty') {
    const count = emptyTrash()
    return NextResponse.json({ count })
  }

  if (body.action === 'restore' && body.trashFilename) {
    const ok = restorePost(body.trashFilename)
    if (!ok) return NextResponse.json({ error: 'File not found in trash' }, { status: 404 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

// DELETE /api/admin/blog/trash — permanent delete one
export async function DELETE(req: NextRequest) {
  if (!cookieValid(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  if (!body.trashFilename) return NextResponse.json({ error: 'trashFilename required' }, { status: 400 })

  const ok = permanentlyDeletePost(body.trashFilename)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
