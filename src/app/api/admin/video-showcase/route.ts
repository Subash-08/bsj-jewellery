import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getShowcaseConfig, resolveShowcaseVideos, saveShowcaseConfig } from '@/lib/video-showcase'
import { videoConfigSchema } from '@/types/video-showcase'

export const runtime = 'nodejs'
function authorized(req: NextRequest) {
  const expected = process.env.NEXT_PRIVATE_ADMIN_SESSION_TOKEN
  return Boolean(expected && req.cookies.get('admin_session')?.value === expected)
}
export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { config, compareDigest } = await getShowcaseConfig()
    return NextResponse.json({ config, videos: await resolveShowcaseVideos(config.library), compareDigest })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load videos' }, { status: 502 })
  }
}
export async function PUT(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  const parsed = videoConfigSchema.safeParse(body?.config)
  if (!parsed.success || !(body.compareDigest === null || typeof body.compareDigest === 'string'))
    return NextResponse.json({ error: 'Invalid video library or section settings' }, { status: 400 })
  try {
    const current = await getShowcaseConfig()
    if (current.compareDigest !== body.compareDigest)
      return NextResponse.json({ error: 'Settings changed in another tab. Refresh before saving.' }, { status: 409 })
    await saveShowcaseConfig(parsed.data, current.ownerId, body.compareDigest)
    revalidatePath('/')
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to save videos' }, { status: 502 })
  }
}
