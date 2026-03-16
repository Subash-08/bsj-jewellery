import { getProductByHandle, getCollectionProducts } from '@/lib/shopify/client';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Product } from '@/types/shopify/product';
import ProductPageClient from '@/components/product/ProductPageClient';

export const revalidate = 3600;

type Props = {
    params: Promise<{ handle: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const product = await getProductByHandle(params.handle);
    if (!product) return {};
    return {
        title: product.seo?.title || product.title,
        description: product.seo?.description || product.description,
    };
}

export default async function ProductPage(props: Props) {
    const params = await props.params;
    const product = await getProductByHandle(params.handle);

    if (!product) {
        notFound();
    }

    const { jewelryMetafields } = product;

    // ── Specifications ──────────────────────────────────────────────────
    const specifications = [
        { label: 'Metal Type', value: jewelryMetafields?.['Metal Type'] },
        { label: 'Purity', value: jewelryMetafields?.['Purity Percentage'] ? `${jewelryMetafields['Purity Percentage']}%` : (jewelryMetafields?.['Purity'] || null) },
        { label: 'Gross Weight', value: jewelryMetafields?.['Gross Weight'] ? `${jewelryMetafields['Gross Weight']} g` : null },
        { label: 'Net Weight', value: jewelryMetafields?.['Net Weight'] ? `${jewelryMetafields['Net Weight']} g` : null },
        { label: 'Stone Weight', value: jewelryMetafields?.['Stone Weight'] ? `${jewelryMetafields['Stone Weight']} carats` : null },
        { label: 'Stone Type', value: jewelryMetafields?.['Stone Type'] },
        { label: 'Stone Shape', value: jewelryMetafields?.['Stone Shape'] },
        { label: 'Stone Color', value: jewelryMetafields?.['Stone Color'] },
        { label: 'Category', value: jewelryMetafields?.['Jewellery Category'] },
        { label: 'Occasion', value: jewelryMetafields?.['Occasion'] },
        { label: 'Gender', value: jewelryMetafields?.['Gender'] },
        { label: 'Certification', value: jewelryMetafields?.['Certification Available'] ? 'Certified' : null },
        { label: 'Hallmark', value: jewelryMetafields?.['Hallmark Type'] },
        { label: 'Metal Color', value: jewelryMetafields?.['Metal Color'] },
        { label: 'Country of Origin', value: jewelryMetafields?.['Country of Origin'] },
    ].filter(spec => spec.value);

    // ── Price Breakdown ────────────────────────────────────────────────
    const priceBreakdown = {
        metalRate: jewelryMetafields?.['Metal Rate'] ? String(jewelryMetafields['Metal Rate']) : undefined,
        makingCharges: jewelryMetafields?.['Making Charge Value'] ? String(jewelryMetafields['Making Charge Value']) : undefined,
        gst: jewelryMetafields?.['GST Percentage'] ? String(jewelryMetafields['GST Percentage']) : undefined,
        gstAmount: jewelryMetafields?.['GST Amount'] ? String(jewelryMetafields['GST Amount']) : undefined,
    };

    // ── Breadcrumb ─────────────────────────────────────────────────────
    const firstCollection = product.collections?.edges?.[0]?.node;
    const breadcrumb = {
        collectionTitle: firstCollection?.title || product.productType || '',
        collectionHandle: firstCollection?.handle || '',
        shortTitle: product.title.replace(/\s*\|\s*BSJ Jewellery/i, '').slice(0, 60),
    };

    // ── Related Products ───────────────────────────────────────────────
    let relatedProducts: Product[] = [];
    try {
        const collectionHandle = firstCollection?.handle;
        if (collectionHandle) {
            const result = await getCollectionProducts({ handle: collectionHandle });
            if (result?.products) {
                relatedProducts = result.products
                    .filter((p) => p.id !== product.id)
                    .slice(0, 4);
            }
        }
    } catch {
        // Related products failure must not block the page
    }

    // ── JSON-LD Structured Data ────────────────────────────────────────
    const minPrice = product.priceRange.minVariantPrice;
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.images.map((img) => img.url),
        sku: product.variants[0]?.sku || product.handle,
        brand: {
            '@type': 'Brand',
            name: 'BSJ Jewellery',
        },
        offers: {
            '@type': 'Offer',
            url: `https://bsjjewellery.com/products/${product.handle}`,
            priceCurrency: minPrice.currencyCode,
            price: minPrice.amount,
            availability: product.availableForSale
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            seller: {
                '@type': 'Organization',
                name: 'BSJ Jewellery',
            },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductPageClient
                product={product}
                specifications={specifications}
                priceBreakdown={priceBreakdown}
                breadcrumb={breadcrumb}
                relatedProducts={relatedProducts}
            />
        </>
    );
}