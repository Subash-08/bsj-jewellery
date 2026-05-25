import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function isAuthorized(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_session')
  const expected = process.env.NEXT_PRIVATE_ADMIN_SESSION_TOKEN
  return !!expected && cookie?.value === expected
}

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const adminPassword = process.env.NEXT_PRIVATE_ADMIN_PASSWORD
  const sessionToken = process.env.NEXT_PRIVATE_ADMIN_SESSION_TOKEN

  if (!adminPassword || !sessionToken) {
    return NextResponse.json(
      {
        error:
          'Admin not configured. Add NEXT_PRIVATE_ADMIN_PASSWORD and NEXT_PRIVATE_ADMIN_SESSION_TOKEN to .env.local',
      },
      { status: 500 },
    )
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('admin_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return response
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('admin_session')
  return response
}
