// Route utilities for safe semantic migration
// Centralizes all route string generation to prevent scattered hardcoded paths.

const PLURAL_MAP: Record<string, string> = {
    'anklet': 'anklets',
    'ring': 'rings',
    'earring': 'earrings',
    'necklace': 'necklaces',
    'bracelet': 'bracelets',
    'pendant': 'pendants',
    'chain': 'chains',
    'bangle': 'bangles',
    'mangalsutra': 'mangalsutras',
    'nose-pin': 'nose-pins',
    'nose-ring': 'nose-rings',
    'toe-ring': 'toe-rings',
    'coin': 'coins',
    'set': 'sets'
};

const SINGULAR_MAP: Record<string, string> = Object.entries(PLURAL_MAP).reduce((acc, [singular, plural]) => {
    acc[plural] = singular;
    return acc;
}, {} as Record<string, string>);

/**
 * Converts a Shopify collection handle (usually singular or mixed) 
 * to a semantic frontend category slug (plural, lowercase, kebab-case).
 */
export function getCategorySlug(shopifyHandle: string): string {
    if (!shopifyHandle || shopifyHandle === 'all') return 'all';
    
    let normalized = shopifyHandle.toLowerCase().trim();
    
    // Check if we have a direct mapping
    if (PLURAL_MAP[normalized]) {
        return PLURAL_MAP[normalized];
    }
    
    // If it's already a plural in our map, return it
    if (SINGULAR_MAP[normalized]) {
        return normalized;
    }

    // Basic fallback logic
    if (!normalized.endsWith('s')) {
        normalized += 's';
    }
    
    return normalized;
}

/**
 * Converts a frontend category slug back to a Shopify collection handle.
 */
export function getShopifyHandle(categorySlug: string): string {
    if (!categorySlug || categorySlug === 'all') return 'all';
    
    const normalized = categorySlug.toLowerCase().trim();
    
    if (SINGULAR_MAP[normalized]) {
        return SINGULAR_MAP[normalized];
    }
    
    // Fallback: strip 's' if not found in map, but be careful with words like 'glass' (not applicable here usually)
    if (normalized.endsWith('s')) {
        return normalized.slice(0, -1);
    }
    
    return normalized;
}

/**
 * Generates the URL for a category hub page.
 */
export function getCollectionUrl(shopifyHandle: string): string {
    if (!shopifyHandle || shopifyHandle === 'all') return '/silver-jewellery';
    const slug = getCategorySlug(shopifyHandle);
    return `/silver-jewellery/${slug}`;
}

/**
 * Generates the strictly canonical URL for a product.
 * Requires the collection handle to build the semantic path.
 * If no collection is provided, it attempts to default to 'all' or a generic path.
 */
export function getProductUrl(productHandle: string, collectionHandle?: string): string {
    if (!collectionHandle || collectionHandle === 'all') {
        // Fallback if we truly don't have context, though we should avoid this.
        // For now, map to a default generic category or keep it safe.
        // The safest fallback that maintains the semantic structure:
        return `/silver-jewellery/all/${productHandle}`; 
    }
    const categorySlug = getCategorySlug(collectionHandle);
    return `/silver-jewellery/${categorySlug}/${productHandle}`;
}

/**
 * Generates search URLs safely
 */
export function getSearchUrl(query: string, collectionHandle?: string): string {
    let url = `/search?q=${encodeURIComponent(query.trim())}`;
    if (collectionHandle && collectionHandle !== 'all') {
        url += `&collection=${encodeURIComponent(collectionHandle)}`;
    }
    return url;
}
