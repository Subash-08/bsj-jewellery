import { getSearchResults } from '@/lib/shopify/client';
import { generateSeo } from '@/lib/seo/metadata';
import InfiniteProductGrid from '@/components/collection/InfiniteProductGrid';
import FilterSidebar from '@/components/filters/FilterSidebar';
import { ActiveFilterBar } from '@/components/filters/ActiveFilterBar';
import { SortDropdown } from '@/components/filters/SortDropdown';
import { buildSearchQuery, sanitizeSearchInput } from '@/lib/shopify/search-query';
import type { Metadata } from 'next';
import type { PageInfo, ProductFilter } from '@/types/shopify/product';
import { Suspense } from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const searchParams = await props.searchParams;
    const rawQuery = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q;

    if (rawQuery) {
        return generateSeo({
            title: `Search: "${rawQuery}" | BSJ Jewellers`,
            description: `Search results for "${rawQuery}" at BSJ Jewellers. Browse our collection of fine jewellery.`,
        });
    }

    return generateSeo({
        title: 'Search | BSJ Jewellers',
        description: 'Search our collection of gold and silver jewellery.',
    });
}

// Ignored params — not filters
const SKIP_PARAMS = new Set(['sort', 'q', 'page', 'after']);

function parseFilters(searchParams: { [key: string]: string | string[] | undefined }): ProductFilter[] {
    const filters: ProductFilter[] = [];

    for (const [key, value] of Object.entries(searchParams)) {
        if (SKIP_PARAMS.has(key) || !value) continue;

        // Price: ?price=1000-5000
        if (key === 'price') {
            const priceStr = Array.isArray(value) ? value[0] : value;
            if (priceStr?.includes('-')) {
                const [minStr, maxStr] = priceStr.split('-');
                const min = Number(minStr);
                const max = Number(maxStr);
                const priceFilter: { min?: number; max?: number } = {};
                if (!isNaN(min) && min > 0) priceFilter.min = min;
                if (!isNaN(max) && max > 0) priceFilter.max = max;
                if (Object.keys(priceFilter).length > 0) {
                    filters.push({ price: priceFilter });
                }
            }
            continue;
        }

        const values = Array.isArray(value) ? value : [value];

        for (const val of values) {
            if (!val) continue;

            if (key === 'available') {
                filters.push({ available: val === 'true' });
            } else if (key === 'productType') {
                filters.push({ productType: val });
            } else if (key === 'tag') {
                filters.push({ tag: val });
            } else if (key === 'vendor') {
                filters.push({ productVendor: val });
            } else if (key.startsWith('option_')) {
                const optionName = key.slice('option_'.length);
                filters.push({ variantOption: { name: optionName, value: val } });
            }
            // Unknown params are silently skipped — no invalid filters sent to Shopify
        }
    }

    return filters;
}

const SUGGESTED_SEARCHES = ['Diamond Ring', 'Gold Chain', 'Silver Bracelet', 'Temple Jewellery', 'Bridal Necklace'];
const EXCLUDED_COLLECTION_HANDLES = new Set(['frontpage', 'all', 'automated-collection']);

export default async function SearchPage(props: Props) {
    const searchParams = await props.searchParams;

    const rawQuery = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q;
    const cleanDisplayQuery = rawQuery ? sanitizeSearchInput(rawQuery) : undefined;

    const dslQuery = rawQuery ? buildSearchQuery(rawQuery) : undefined;

    // Parse sort
    const sortParam = Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort;
    let sortKey = 'RELEVANCE';
    let reverse = false;

    if (sortParam === 'price-asc') { sortKey = 'PRICE'; reverse = false; }
    else if (sortParam === 'price-desc') { sortKey = 'PRICE'; reverse = true; }
    else if (sortParam === 'newest') { sortKey = 'CREATED_AT'; reverse = true; }
    else if (sortParam === 'best-selling') { sortKey = 'BEST_SELLING'; reverse = false; }

    // Build productFilters from URL params (no collection filter — not supported by search API)
    const productFilters = parseFilters(searchParams);

    // Fetch search results
    let products: any[] = [];
    let pageInfo: PageInfo = { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null };
    let filters: any[] = [];

    if (dslQuery) {
        try {
            const data = await getSearchResults({
                query: dslQuery,
                productFilters: productFilters.length > 0 ? productFilters : undefined,
                sortKey,
                reverse,
            });
            products = data.products;
            pageInfo = data.pageInfo;
            filters = data.filters;
        } catch (e) {
            console.error('Search error:', e);
        }
    }

    // Build collection list from returned product data (navigation links, not filters)
    const collectionMap = new Map<string, { handle: string; title: string; count: number }>();
    products.forEach(p => {
        p.collections?.edges?.forEach((edge: any) => {
            const coll = edge.node;
            if (!coll?.handle || EXCLUDED_COLLECTION_HANDLES.has(coll.handle)) return;
            const existing = collectionMap.get(coll.handle);
            if (existing) {
                existing.count++;
            } else {
                collectionMap.set(coll.handle, {
                    handle: coll.handle,
                    title: coll.title || coll.handle.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
                    count: 1,
                });
            }
        });
    });

    const collections = Array.from(collectionMap.values()).sort((a, b) => b.count - a.count);

    const showSidebar = products.length > 0 && (filters.length > 0 || collections.length > 0);

    // Serialize filters for pagination (InfiniteProductGrid needs this to re-fetch with same filters)
    const serializedFilters = JSON.stringify(productFilters);
    // No query provided — show search landing
    if (!cleanDisplayQuery) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 pb-24">
                <div className="max-w-4xl mx-auto px-4 text-center py-20">
                    <h1 className="text-4xl font-serif text-gray-900 mb-4">Search Jewellery</h1>
                    <p className="text-gray-500 mb-10">Use the search bar above to find your perfect piece</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {SUGGESTED_SEARCHES.map(term => (
                            <Link
                                key={term}
                                href={`/search?q=${encodeURIComponent(term)}`}
                                className="px-5 py-2.5 bg-white border border-stone-200 rounded-full text-sm text-stone-600 hover:border-rose-300 hover:text-rose-600 transition-colors shadow-sm"
                            >
                                {term}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="search-page min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`grid ${showSidebar ? 'grid-cols-1 md:grid-cols-[260px_1fr]' : 'grid-cols-1'} gap-8 items-start`}>

                    {showSidebar && (
                        <FilterSidebar
                            filters={filters}
                            collections={collections}
                            currentParams={searchParams as Record<string, string | string[] | undefined>}
                        />
                    )}

                    <main className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b gap-4">
                            <div>
                                <h1 className="text-4xl font-serif text-gray-900 mb-2">
                                    Search results for &ldquo;{cleanDisplayQuery}&rdquo;
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    Showing {products.length || 0} {pageInfo.hasNextPage ? 'of many' : ''} products
                                </p>
                            </div>
                            <SortDropdown />
                        </div>

                        <ActiveFilterBar />

                        <Suspense fallback={<div>Loading...</div>}>
                            {products.length === 0 ? (
                                <div className="text-center py-24 bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col items-center">
                                    <p className="text-gray-500 mb-2 text-lg">
                                        No products found for &ldquo;{cleanDisplayQuery}&rdquo;
                                    </p>
                                    <p className="text-gray-400 text-sm mb-8">
                                        Try adjusting your filters or searching for something else
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                                        {SUGGESTED_SEARCHES.map(term => (
                                            <Link
                                                key={term}
                                                href={`/search?q=${encodeURIComponent(term)}`}
                                                className="px-4 py-2 bg-stone-100 rounded-full text-sm text-stone-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                            >
                                                {term}
                                            </Link>
                                        ))}
                                    </div>
                                    <Link
                                        href="/"
                                        className="inline-block bg-rose-600 text-white px-8 py-3 rounded-full hover:bg-rose-700 transition font-medium"
                                    >
                                        Browse All Products
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <script
                                        type="application/ld+json"
                                        dangerouslySetInnerHTML={{
                                            __html: JSON.stringify({
                                                '@context': 'https://schema.org',
                                                '@type': 'ItemList',
                                                'itemListElement': products.map((product: any, index: number) => ({
                                                    '@type': 'ListItem',
                                                    position: index + 1,
                                                    url: `https://www.bsjjewellers.com/products/${product.handle}`
                                                }))
                                            })
                                        }}
                                    />
                                    <InfiniteProductGrid
                                        initialProducts={products}
                                        initialPageInfo={pageInfo}
                                        searchQuery={dslQuery}
                                        serializedFilters={serializedFilters}
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