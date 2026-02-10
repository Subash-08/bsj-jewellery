import { getProducts, getCollections } from '@/lib/shopify/client';

export async function getSitemapData() {
    const [products, collections] = await Promise.all([
        getProducts({}),
        getCollections(),
    ]);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const productUrls = products.map((product) => ({
        url: `${baseUrl}/products/${product.handle}`,
        lastModified: product.updatedAt,
    }));

    const collectionUrls = collections.map((collection) => ({
        url: `${baseUrl}${collection.path}`,
        lastModified: collection.updatedAt,
    }));

    return [...productUrls, ...collectionUrls];
}