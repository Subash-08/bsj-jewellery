import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo.config'
import { getProducts, getCollections } from '@/lib/shopify/client'
import { getProductUrl } from '@/lib/routes/index'
import { getPaginatedPosts } from '@/lib/blog'

import { filterDisplayCollections } from '@/lib/shopify/collections.config'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.domain
  const now = new Date().toISOString()

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/silver-jewellery/anklets`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/silver-jewellery/bracelets`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/silver-jewellery/chains`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/silver-jewellery/pendants`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/silver-jewellery/rings`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/silver-jewellery`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/size-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/live-prices`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/terms-of-service`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/shipping-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/return-refund-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ]

  let productPages: MetadataRoute.Sitemap = []
  try {
    const collections = await getCollections()
    const displayCollections = filterDisplayCollections(collections)
    const collectionHandles = displayCollections
      .map((c: { handle: string }) => c.handle)
      .filter(Boolean)

    let allProducts: any[] = []
    let hasNextPage = true
    let cursor: string | undefined = undefined

    while (hasNextPage) {
      const productResult = await getProducts({ after: cursor })
      allProducts = [...allProducts, ...(productResult.products ?? [])]
      
      hasNextPage = productResult.pageInfo?.hasNextPage ?? false
      cursor = productResult.pageInfo?.endCursor ?? undefined
    }

    productPages = allProducts.map((p: any) => {
      const productCollectionHandle = p.collections?.edges?.[0]?.node?.handle || 'all'
      return {
        url: `${base}${getProductUrl(p.handle, productCollectionHandle)}`,
        lastModified: p.updatedAt ?? now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }
    })
  } catch {
    // fall through with static pages only
  }

  let blogPages: MetadataRoute.Sitemap = [
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ]
  try {
    const { posts } = getPaginatedPosts(1, 1000)
    blogPages = [
      { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
      ...posts.map((p) => ({
        url: `${base}/blog/${p.slug}`,
        lastModified: p.dateModified,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ]
  } catch {
    // fall through with listing page only
  }

  return [...staticPages, ...productPages, ...blogPages]
}
