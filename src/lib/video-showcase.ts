import 'server-only'
import { shopifyAdmin } from '@/lib/shopify/admin'
import { videoConfigSchema, type VideoConfig, type LibraryVideo, type ResolvedLibraryVideo } from '@/types/video-showcase'

export async function getShowcaseConfig() {
  const data = await shopifyAdmin<{ shop: { id: string; metafield: { value: string; compareDigest: string } | null } }>(`query ShowcaseConfig {
    shop { id metafield(namespace: "bakya", key: "home_video_showcase") { value compareDigest } }
  }`)
  let config: VideoConfig = { version: 2, library: [], sections: [] }
  if (data.shop.metafield) {
    const raw = JSON.parse(data.shop.metafield.value)
    if (raw.version === 2) config = videoConfigSchema.parse(raw)
    else {
      // Migrate the existing single section in memory. Nothing is written until Save.
      config = videoConfigSchema.parse({
        version: 2,
        library: raw.videos || [],
        sections: [{ id: 'original', title: raw.title || 'Stories in Silver', subtitle: raw.subtitle || '',
          enabled: raw.enabled === true, layout: 'reels', marginTop: 0, marginBottom: 0,
          videoIds: (raw.videos || []).map((v: { id: string }) => v.id) }],
      })
    }
  }
  return { config, ownerId: data.shop.id, compareDigest: data.shop.metafield?.compareDigest ?? null }
}

export async function saveShowcaseConfig(config: VideoConfig, ownerId: string, compareDigest: string | null) {
  const data = await shopifyAdmin<{ metafieldsSet: { userErrors: { message: string }[] } }>(`mutation SaveShowcase($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) { userErrors { message } }
  }`, { metafields: [{ ownerId, namespace: 'bakya', key: 'home_video_showcase', type: 'json', value: JSON.stringify(config), compareDigest }] })
  if (data.metafieldsSet.userErrors.length) throw new Error(data.metafieldsSet.userErrors.map(e => e.message).join('; '))
}

export async function resolveShowcaseVideos(videos: LibraryVideo[]): Promise<ResolvedLibraryVideo[]> {
  if (!videos.length) return []
  const thumbnails = videos.flatMap(v => v.thumbnailId ? [v.thumbnailId] : [])
  const images = thumbnails.length ? await shopifyAdmin<{ nodes: Array<{ id: string; image: { url: string } | null } | null> }>(`query VideoThumbnails($ids: [ID!]!) {
    nodes(ids: $ids) { ... on MediaImage { id image { url } } }
  }`, { ids: [...new Set(thumbnails)] }) : { nodes: [] }
  const data = await shopifyAdmin<{ nodes: Array<{ fileStatus: string; duration: number | null; sources: { url: string; mimeType: string }[]; preview: { image: { url: string } | null } | null } | null> }>(`query ShowcaseVideos($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Video { fileStatus duration sources { url mimeType } preview { image { url } } }
    }
  }`, { ids: videos.map(v => v.id) })
  return videos.map((video, index) => {
    const node = data.nodes[index]
    const source = node?.sources?.find(s => s.mimeType === 'video/mp4') ?? node?.sources?.[0]
    return { ...video, status: node?.fileStatus ?? 'MISSING', duration: node?.duration ?? null,
      url: source?.url ?? null, poster: images.nodes.find(n => n?.id === video.thumbnailId)?.image?.url || video.thumbnail || node?.preview?.image?.url || null }
  })
}
