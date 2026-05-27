/**
 * INTERNAL_COLLECTION_HANDLES
 *
 * Collections created for homepage curation — used internally by the site
 * to power specific sections. These must NEVER appear in:
 * - Category slider / nav dropdown
 * - /silver-jewellery listing page
 * - Any "all collections" query result shown to users
 * - Sitemap collection entries
 *
 * To add a new internal collection: add its Shopify handle here.
 * The handle is the URL-safe version of the collection title
 * (e.g. "Best Sellers" → "best-sellers")
 */
export const INTERNAL_COLLECTION_HANDLES = [
  'best-sellers',
  'gifting-edit',
] as const

export type InternalCollectionHandle = typeof INTERNAL_COLLECTION_HANDLES[number]

/**
 * Type guard — returns true if the collection handle is internal
 */
export function isInternalCollection(handle: string): boolean {
  return (INTERNAL_COLLECTION_HANDLES as readonly string[]).includes(handle)
}

/**
 * Filter function — removes internal collections from any array of collections
 * Safe to call even if collections is null/undefined/empty
 */
export function filterDisplayCollections<T extends { handle: string }>(
  collections: T[] | null | undefined
): T[] {
  if (!collections || !Array.isArray(collections)) return []
  return collections.filter(col => !isInternalCollection(col.handle))
}
