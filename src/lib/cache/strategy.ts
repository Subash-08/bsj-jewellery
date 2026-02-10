export const CACHE_STRATEGIES = {
    PRODUCT: 'force-cache',
    COLLECTION: 'force-cache',
    CART: 'no-store', // Always fresh
    CHECKOUT: 'no-store',
} as const;

export type CacheStrategy = keyof typeof CACHE_STRATEGIES;