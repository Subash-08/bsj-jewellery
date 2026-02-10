export const CACHE_TAGS = {
    products: 'products',
    collections: 'collections',
    cart: 'cart',
    pages: 'pages',
    settings: 'settings',
};

export function getProductTag(handle: string) {
    return `product-${handle}`;
}

export function getCollectionTag(handle: string) {
    return `collection-${handle}`;
}