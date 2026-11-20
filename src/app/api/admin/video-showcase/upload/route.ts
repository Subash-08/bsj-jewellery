import { NextRequest, NextResponse } from 'next/server'
import { shopifyAdmin } from '@/lib/shopify/admin'

export const runtime = 'nodejs'

function authorized(req: NextRequest) {
  const expected = process.env.NEXT_PRIVATE_ADMIN_SESSION_TOKEN
  return Boolean(expected && req.cookies.get('admin_session')?.value === expected)
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  if (!body || (body.action !== 'stage' && body.action !== 'finalize')) {
    return NextResponse.json({ error: 'Invalid upload request' }, { status: 400 })
  }
  try {
    if (body.action === 'stage') {
      const { filename, mimeType, size } = body
      const image = body.kind === 'thumbnail'
      const allowed = image ? ['image/jpeg', 'image/png', 'image/webp'] : ['video/mp4', 'video/quicktime', 'video/webm']
      if (typeof filename !== 'string' || filename.length > 150 || /[\/\\]/.test(filename) ||
        !allowed.includes(mimeType) || !Number.isInteger(size) || size < 1 || size > (image ? 2 : 25) * 1024 * 1024) {
        return NextResponse.json({ error: image ? 'Use JPEG, PNG or WebP up to 2 MB' : 'Use MP4, MOV or WebM up to 25 MB' }, { status: 400 })
      }
      const data = await shopifyAdmin<{ stagedUploadsCreate: { stagedTargets: Array<{ url: string; resourceUrl: string; parameters: Array<{ name: string; value: string }> }>; userErrors: Array<{ message: string }> } }>(`mutation StageVideo($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) { stagedTargets { url resourceUrl parameters { name value } } userErrors { message } }
      }`, { input: [{ filename, mimeType, fileSize: String(size), resource: image ? 'IMAGE' : 'VIDEO', httpMethod: 'POST' }] })
      const result = data.stagedUploadsCreate
      if (result.userErrors.length || !result.stagedTargets[0]) throw new Error(result.userErrors[0]?.message ?? 'Shopify did not return an upload target')
      return NextResponse.json({ target: result.stagedTargets[0] })
    }
    const { resourceUrl, title } = body
    if (typeof resourceUrl !== 'string' || !resourceUrl.startsWith('https://') || typeof title !== 'string' || !title.trim() || title.length > 100) {
      return NextResponse.json({ error: 'Invalid video details' }, { status: 400 })
    }
    const data = await shopifyAdmin<{ fileCreate: { files: Array<{ id: string; fileStatus: string }>; userErrors: Array<{ message: string }> } }>(`mutation CreateVideo($files: [FileCreateInput!]!) {
      fileCreate(files: $files) { files { id fileStatus } userErrors { message } }
    }`, { files: [{ originalSource: resourceUrl, contentType: body.kind === 'thumbnail' ? 'IMAGE' : 'VIDEO', alt: title.trim() }] })
    const result = data.fileCreate
    if (result.userErrors.length || !result.files[0]) throw new Error(result.userErrors[0]?.message ?? 'Shopify did not create the video')
    return NextResponse.json({ video: { id: result.files[0].id, title: title.trim(), status: result.files[0].fileStatus } })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Shopify upload failed' }, { status: 502 })
  }
}
