import type { Product } from '@/types/shopify/product';

export function toJsonLd(product: Product): string {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.featuredImage?.url,
        offers: product.variants.map((variant) => {
            return {
                '@type': 'Offer',
                availability: variant.availableForSale
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
                price: variant.price.amount,
                priceCurrency: variant.price.currencyCode,
                sku: variant.sku || variant.id, 
            };
        }),
    };

    return JSON.stringify(schema);
}