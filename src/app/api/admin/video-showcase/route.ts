import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getShowcaseConfig, resolveShowcaseVideos, saveShowcaseConfig, type ShowcaseConfig } from '@/lib/video-showcase'

export const runtime = 'nodejs'

function authorized(req: NextRequest) {
  const expected = process.env.NEXT_PRIVATE_ADMIN_SESSION_TOKEN
  return Boolean(expected && req.cookies.get('admin_session')?.value === expected)
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { config, compareDigest } = await getShowcaseConfig()
    const videos = await resolveShowcaseVideos(config.videos)
    return NextResponse.json({ config, videos, compareDigest })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load videos' }, { status: 502 })
  }
}

export async function PUT(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null) as Partial<ShowcaseConfig> | null
  if (!body || typeof body.enabled !== 'boolean' || typeof body.title !== 'string' || !body.title.trim() || body.title.length > 100 ||
    typeof body.subtitle !== 'string' || body.subtitle.length > 250 || !Array.isArray(body.videos) || body.videos.length > 12 ||
    body.videos.some((v) => !v || typeof v.id !== 'string' || !/^gid:\/\/shopify\/Video\/\d+$/.test(v.id) || typeof v.title !== 'string' || !v.title.trim() || v.title.length > 100) ||
    new Set(body.videos.map((v) => v.id)).size !== body.videos.length) {
    return NextResponse.json({ error: 'Invalid showcase settings' }, { status: 400 })
  }
  try {
    const current = await getShowcaseConfig()
    await saveShowcaseConfig({ enabled: body.enabled, title: body.title.trim(), subtitle: body.subtitle.trim(), videos: body.videos }, current.ownerId, current.compareDigest)
    revalidatePath('/')
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to save videos' }, { status: 502 })
  }
}
