import { getProducts, getCollections } from '@/lib/shopify/client';
import { getProductUrl, getCollectionUrl } from '@/lib/routes';

export async function getSitemapData() {
    const [products, collections] = await Promise.all([
        getProducts({}),
        getCollections(),
    ]);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const productUrls = products.map((product) => ({
        url: `${baseUrl}${getProductUrl(product.handle)}`,
        lastModified: product.updatedAt,
    }));

    const collectionUrls = collections.map((collection) => ({
        url: `${baseUrl}${getCollectionUrl(collection.handle)}`,
        lastModified: collection.updatedAt,
    }));

    return [...productUrls, ...collectionUrls];
}