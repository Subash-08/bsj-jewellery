import 'server-only'
import { shopifyAdmin } from '@/lib/shopify/admin'

export type ShowcaseVideo = { id: string; title: string }
export type ShowcaseConfig = {
  enabled: boolean
  title: string
  subtitle: string
  videos: ShowcaseVideo[]
}
export type ResolvedVideo = ShowcaseVideo & { status: string; url: string | null; poster: string | null }

const DEFAULT_CONFIG: ShowcaseConfig = {
  enabled: false,
  title: 'Stories in Silver',
  subtitle: 'A closer look at the pieces and people behind Bakya.',
  videos: [],
}

type ShopMetafield = { shop: { id: string; metafield: { value: string; compareDigest: string } | null } }

export async function getShowcaseConfig(): Promise<{ config: ShowcaseConfig; ownerId: string; compareDigest: string | null }> {
  const data = await shopifyAdmin<ShopMetafield>(`query ShowcaseConfig {
    shop { id metafield(namespace: "bakya", key: "home_video_showcase") { value compareDigest } }
  }`)
  let config = DEFAULT_CONFIG
  try {
    if (data.shop.metafield?.value) {
      const parsed = JSON.parse(data.shop.metafield.value) as Partial<ShowcaseConfig>
      config = {
        enabled: parsed.enabled === true,
        title: typeof parsed.title === 'string' ? parsed.title : DEFAULT_CONFIG.title,
        subtitle: typeof parsed.subtitle === 'string' ? parsed.subtitle : DEFAULT_CONFIG.subtitle,
        videos: Array.isArray(parsed.videos) ? parsed.videos.filter((v): v is ShowcaseVideo =>
          typeof v?.id === 'string' && /^gid:\/\/shopify\/Video\/\d+$/.test(v.id) && typeof v.title === 'string'
        ).slice(0, 12) : [],
      }
    }
  } catch {
    // A malformed value should never break the public home page.
  }
  return { config, ownerId: data.shop.id, compareDigest: data.shop.metafield?.compareDigest ?? null }
}

export async function saveShowcaseConfig(config: ShowcaseConfig, ownerId: string, compareDigest: string | null) {
  const data = await shopifyAdmin<{ metafieldsSet: { userErrors: { message: string }[] } }>(`mutation SaveShowcase($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) { userErrors { message } }
  }`, { metafields: [{ ownerId, namespace: 'bakya', key: 'home_video_showcase', type: 'json', value: JSON.stringify(config), compareDigest }] })
  if (data.metafieldsSet.userErrors.length) throw new Error(data.metafieldsSet.userErrors.map((e) => e.message).join('; '))
}

export async function resolveShowcaseVideos(videos: ShowcaseVideo[]): Promise<ResolvedVideo[]> {
  if (!videos.length) return []
  const data = await shopifyAdmin<{ nodes: Array<{ id: string; fileStatus: string; sources: { url: string; format: string; mimeType: string }[]; preview: { image: { url: string } | null } | null } | null> }>(`query ShowcaseVideos($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Video { id fileStatus sources { url format mimeType } preview { image { url } } }
    }
  }`, { ids: videos.map((video) => video.id) })
  return videos.map((video, index) => {
    const node = data.nodes[index]
    const source = node?.sources?.find((item) => item.mimeType === 'video/mp4') ?? node?.sources?.[0]
    return { ...video, status: node?.fileStatus ?? 'MISSING', url: source?.url ?? null, poster: node?.preview?.image?.url ?? null }
  })
}
