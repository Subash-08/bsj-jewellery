import { getProductByHandle, getCollectionProducts } from '@/lib/shopify/client';
import { productSchema, breadcrumbSchema, webPageSchema } from '@/lib/schema';
import { SITE } from '@/lib/seo.config';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Product } from '@/types/shopify/product';
import type { ReviewSummaryData, JudgeMeReview } from '@/types/review';
import ProductPageClient from '@/components/product/ProductPageClient';
import { getReviews, getReviewSummary, extractNumericProductId } from '@/lib/judgeme';

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
        shortTitle: product.title.replace(/\s*\|\s*Bakya/i, '').slice(0, 60),
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

    // ── Reviews (SSR with timeout — must never block page render) ─────
    const emptyReviews: { reviews: JudgeMeReview[]; summary: ReviewSummaryData } = { reviews: [], summary: { average: 0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } } };
    let reviewData = emptyReviews;
    try {
        const numericId = extractNumericProductId(product.id);
        const timeout = new Promise<typeof emptyReviews>((resolve) =>
            setTimeout(() => resolve(emptyReviews), 3000)
        );
        const fetchReviews = (async () => {
            const [reviewsResult, summaryResult] = await Promise.all([
                getReviews(numericId, 1, 5),
                getReviewSummary(numericId),
            ]);
            
            const finalSummary = summaryResult.average === 0 && summaryResult.count > 0
                ? { ...reviewsResult.summary, count: summaryResult.count }
                : summaryResult;

            return { reviews: reviewsResult.reviews, summary: finalSummary };
        })();
        reviewData = await Promise.race([fetchReviews, timeout]);
    } catch (err) {
        console.error('[Reviews] SSR fetch failed', {
            handle: params.handle,
            productId: product.id,
            error: err instanceof Error ? err.message : String(err),
        });
    }

    // ── JSON-LD Structured Data ────────────────────────────────────────
    const minPrice = product.priceRange.minVariantPrice;
    const productUrl = `${SITE.domain}/products/${product.handle}`;
    const collectionHandle = breadcrumb.collectionHandle
    const collectionTitle = breadcrumb.collectionTitle

    const weightMatch = jewelryMetafields?.['Gross Weight'] ? Number(jewelryMetafields['Gross Weight']) : undefined;
    const gtinMatch = (product.variants[0] as any)?.barcode || jewelryMetafields?.['GTIN'] || undefined;

    const jsonLd = productSchema({
        name: product.title,
        description: product.description,
        images: product.images.map((img: { url: string }) => img.url),
        price: minPrice.amount,
        currency: minPrice.currencyCode,
        sku: product.variants[0]?.sku || product.handle,
        gtin13: gtinMatch,
        weightGrams: weightMatch,
        url: productUrl,
        category: product.productType || collectionTitle,
        availability: product.availableForSale ? 'InStock' : 'OutOfStock',
        ...(reviewData.summary.count > 0
            ? { ratingValue: reviewData.summary.average, reviewCount: reviewData.summary.count }
            : {}),
    })

    const crumbSchema = breadcrumbSchema([
        { name: 'Home', url: SITE.domain },
        { name: 'Silver Jewellery', url: `${SITE.domain}/silver-jewellery` },
        ...(collectionHandle
            ? [{ name: collectionTitle, url: `${SITE.domain}/silver-jewellery/${collectionHandle}` }]
            : []),
        { name: breadcrumb.shortTitle, url: productUrl },
    ])

    const pageSchema = webPageSchema({
        type: 'ItemPage',
        name: product.title,
        description: product.seo?.description || product.description,
        url: productUrl,
    })

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
            />
            <ProductPageClient
                product={product}
                specifications={specifications}
                priceBreakdown={priceBreakdown}
                breadcrumb={breadcrumb}
                relatedProducts={relatedProducts}
                initialReviews={reviewData.reviews}
                initialSummary={reviewData.summary}
            />
        </>
    );
}