import { getCollection, getCollectionProducts } from '@/lib/shopify/client';
import { generateSeo } from '@/lib/seo/metadata';
import FilterSidebar from '@/components/filters/FilterSidebar';
import InfiniteProductGrid from '@/components/collection/InfiniteProductGrid';
import { ActiveFilterBar } from '@/components/filters/ActiveFilterBar';
import { SortDropdown } from '@/components/filters/SortDropdown';
import type { Metadata } from 'next';
import { Suspense } from 'react';

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ collection: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    try {
        const collection = await getCollection(params.collection);
        if (!collection) return {};

        return generateSeo({
            title: `${collection.seo.title || collection.title} | BSJ Jewellers`,
            description: collection.seo.description || collection.description,
            image: collection.image?.url,
        });
    } catch (e) {
        return {};
    }
}

function parseFilters(searchParams: { [key: string]: string | string[] | undefined }) {
    const filters: any[] = [];

    const ignoreParams = ['sort', 'q', 'page', 'after'];

    for (const [key, value] of Object.entries(searchParams)) {
        if (ignoreParams.includes(key) || !value) continue;

        if (key === 'price') {
            const priceStr = Array.isArray(value) ? value[0] : value;
            if (priceStr && priceStr.includes('-')) {
                const [min, max] = priceStr.split('-');
                const priceFilter: any = {};
                if (min && !isNaN(Number(min))) priceFilter.min = Number(min);
                if (max && !isNaN(Number(max))) priceFilter.max = Number(max);
                if (Object.keys(priceFilter).length > 0) {
                    filters.push({ price: priceFilter });
                }
            }
            continue;
        }

        const values = Array.isArray(value) ? value : value.split(',');

        for (const val of values) {
            filters.push({
                productMetafield: {
                    namespace: 'custom',
                    key: key,
                    value: val
                }
            });
        }
    }

    return filters;
}

export default async function CollectionPage(props: Props) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    // Parse filters from URL
    const filters = parseFilters(searchParams);

    // Parse sort key
    const sortParam = Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort;
    let sortKey = 'COLLECTION_DEFAULT';
    let reverse = false;

    if (sortParam === 'price-asc') {
        sortKey = 'PRICE';
        reverse = false;
    } else if (sortParam === 'price-desc') {
        sortKey = 'PRICE';
        reverse = true;
    } else if (sortParam === 'newest') {
        sortKey = 'CREATED_AT';
        reverse = true;
    } else if (sortParam === 'best-selling') {
        sortKey = 'BEST_SELLING';
        reverse = false;
    }

    // Fetch products with native Shopify filtering
    const collectionData = await getCollectionProducts({
        handle: params.collection,
        filters: filters.length > 0 ? filters : undefined,
        sortKey,
        reverse
    });

    return (
        <div className="collection-page min-h-screen bg-[#FAF8F5] pt-32 pb-24">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10 lg:gap-12 items-start">
                    {/* Filters sidebar */}
                    {collectionData?.filters && collectionData.filters.length > 0 && (
                        <FilterSidebar
                            filters={collectionData.filters}
                            currentParams={searchParams}
                        />
                    )}

                    {/* Product Grid */}
                    <main className="product-grid flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-stone-200 gap-4">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-serif font-semibold tracking-tight text-stone-900 capitalize mb-1">
                                    {params.collection} Collection
                                </h1>
                                <p className="text-stone-400 text-sm">
                                    Showing {collectionData?.products.length || 0} {collectionData?.pageInfo.hasNextPage ? 'of many' : ''} products
                                </p>
                            </div>
                            <SortDropdown />
                        </div>

                        <ActiveFilterBar />

                        <Suspense fallback={<div>Loading styles...</div>}>
                            {!collectionData || collectionData.products.length === 0 ? (
                                <div className="bg-white border border-stone-100 rounded-xl p-10 text-center shadow-sm flex flex-col items-center">
                                    <p className="text-stone-500 mb-6 text-base">No products match your selected filters.</p>
                                    <a href={`/collections/${params.collection}`} className="inline-block bg-amber-600 text-white px-8 py-3 rounded-md text-xs uppercase tracking-widest font-semibold hover:bg-amber-700 transition">
                                        Reset All Filters
                                    </a>
                                </div>
                            ) : (
                                <>
                                    {/* Structured Data for Collection */}
                                    <script
                                        type="application/ld+json"
                                        dangerouslySetInnerHTML={{
                                            __html: JSON.stringify({
                                                '@context': 'https://schema.org',
                                                '@type': 'ItemList',
                                                'itemListElement': collectionData.products.map((product: any, index: number) => ({
                                                    '@type': 'ListItem',
                                                    position: index + 1,
                                                    url: `https://www.bsjjewellers.com/products/${product.handle}`
                                                }))
                                            })
                                        }}
                                    />
                                    <InfiniteProductGrid
                                        initialProducts={collectionData.products}
                                        initialPageInfo={collectionData.pageInfo}
                                        collectionHandle={params.collection}
                                    />
                                </>
                            )}
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
    );
}