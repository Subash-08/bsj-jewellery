import { getCollection, getCollectionProducts } from '@/lib/shopify/client';
import { generateSeo } from '@/lib/seo/metadata';
import FilterSidebar from '@/components/filters/FilterSidebar';
import InfiniteProductGrid from '@/components/collection/InfiniteProductGrid';
import { ActiveFilterBar } from '@/components/filters/ActiveFilterBar';
import { SortDropdown } from '@/components/filters/SortDropdown';
import type { Metadata } from 'next';
import { Suspense } from 'react';

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
                if (Object.keys(priceFilter).length > 0) filters.push({ price: priceFilter });
            }
            continue;
        }
        const values = Array.isArray(value) ? value : value.split(',');
        for (const val of values) {
            filters.push({ productMetafield: { namespace: 'custom', key, value: val } });
        }
    }
    return filters;
}

export default async function CollectionPage(props: Props) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const filters = parseFilters(searchParams);

    const sortParam = Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort;
    let sortKey = 'COLLECTION_DEFAULT';
    let reverse = false;

    if (sortParam === 'price-asc') { sortKey = 'PRICE'; reverse = false; }
    else if (sortParam === 'price-desc') { sortKey = 'PRICE'; reverse = true; }
    else if (sortParam === 'newest') { sortKey = 'CREATED_AT'; reverse = true; }
    else if (sortParam === 'best-selling') { sortKey = 'BEST_SELLING'; reverse = false; }

    const collectionData = await getCollectionProducts({
        handle: params.collection,
        filters: filters.length > 0 ? filters : undefined,
        sortKey,
        reverse,
    });

    const hasFilters = collectionData?.filters && collectionData.filters.length > 0;
    const productCount = collectionData?.products.length || 0;
    const hasMore = collectionData?.pageInfo.hasNextPage;

    // Format collection title nicely
    const collectionTitle = params.collection
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    return (
        <>
            <div
                className="collection-page min-h-screen pb-24"
                style={{ background: '#FAF8F5', paddingTop: '7rem' }}
            >
                <div
                    style={{
                        maxWidth: 1400,
                        margin: '0 auto',
                        padding: '0 clamp(1rem, 3vw, 2rem)',
                    }}
                >
                    {/* ── Page header ── */}
                    <div
                        style={{
                            paddingBottom: '1.5rem',
                            marginBottom: '1.5rem',
                            borderBottom: '1px solid #EDE8E0',
                        }}
                    >
                        {/* Breadcrumb hint */}
                        <p
                            style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '0.68rem',
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: '#B0A090',
                                marginBottom: '0.4rem',
                            }}
                        >
                            Collections
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'flex-end',
                                justifyContent: 'space-between',
                                gap: '0.75rem',
                            }}
                        >
                            <div>
                                <h1
                                    style={{
                                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                                        fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                                        fontWeight: 700,
                                        letterSpacing: '-0.025em',
                                        lineHeight: 1.1,
                                        color: '#1C1510',
                                        marginBottom: '0.3rem',
                                    }}
                                >
                                    {collectionTitle}
                                </h1>
                                <p
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: '0.8rem',
                                        color: '#B0A090',
                                    }}
                                >
                                    {productCount > 0
                                        ? `Showing ${productCount}${hasMore ? '+' : ''} product${productCount !== 1 ? 's' : ''}`
                                        : 'No products found'}
                                </p>
                            </div>

                            {/* Sort dropdown — right aligned */}
                            <div className="cp-sort-wrap">
                                <SortDropdown />
                            </div>
                        </div>
                    </div>

                    {/* ── Body: sidebar + grid ── */}
                    <div className="cp-body-grid">

                        {/* ── FilterSidebar — handles both desktop sticky sidebar AND mobile drawer internally ── */}
                        {hasFilters && (
                            <aside className="cp-sidebar">
                                <FilterSidebar
                                    filters={collectionData!.filters}
                                    currentParams={searchParams}
                                />
                            </aside>
                        )}

                        {/* ── Main content ── */}
                        <main
                            className="cp-main"
                            style={{ minWidth: 0 }}
                        >
                            {/* Active filters */}
                            <div className="cp-active-filters">
                                <ActiveFilterBar />
                            </div>

                            <Suspense
                                fallback={
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(2, 1fr)',
                                            gap: '1rem',
                                        }}
                                        className="cp-skeleton-grid"
                                    >
                                        {[...Array(8)].map((_, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    aspectRatio: '3/4',
                                                    borderRadius: 12,
                                                    background: 'linear-gradient(135deg, #F0EBE2, #EAE4DC)',
                                                    animation: 'cpPulse 1.8s ease-in-out infinite',
                                                    animationDelay: `${i * 0.1}s`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                }
                            >
                                {!collectionData || collectionData.products.length === 0 ? (
                                    /* ── Empty state ── */
                                    <div
                                        style={{
                                            background: '#FFFFFF',
                                            border: '1px solid #EDE8E0',
                                            borderRadius: 16,
                                            padding: 'clamp(2rem, 5vw, 4rem)',
                                            textAlign: 'center',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '1rem',
                                        }}
                                    >
                                        {/* Decorative ring */}
                                        <div
                                            style={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: '50%',
                                                border: '1.5px solid #C9A96E',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: 0.5,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: '50%',
                                                    border: '1.5px solid #C9A96E',
                                                }}
                                            />
                                        </div>
                                        <p
                                            style={{
                                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                color: '#4A3F35',
                                            }}
                                        >
                                            No products match your filters
                                        </p>
                                        <p
                                            style={{
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: '0.8rem',
                                                color: '#B0A090',
                                                maxWidth: 280,
                                            }}
                                        >
                                            Try adjusting or removing some filters to see more pieces.
                                        </p>
                                        <a
                                            href={`/collections/${params.collection}`}
                                            style={{
                                                marginTop: '0.25rem',
                                                display: 'inline-block',
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: '0.65rem',
                                                fontWeight: 700,
                                                letterSpacing: '0.2em',
                                                textTransform: 'uppercase',
                                                color: '#2C2218',
                                                border: '1.5px solid #C9A96E',
                                                padding: '0.65rem 2rem',
                                                borderRadius: 6,
                                                textDecoration: 'none',
                                                transition: 'background 0.2s, color 0.2s',
                                            }}
                                            className="cp-reset-btn"
                                        >
                                            Reset All Filters
                                        </a>
                                    </div>
                                ) : (
                                    <>
                                        <script
                                            type="application/ld+json"
                                            dangerouslySetInnerHTML={{
                                                __html: JSON.stringify({
                                                    '@context': 'https://schema.org',
                                                    '@type': 'ItemList',
                                                    itemListElement: collectionData.products.map((product: any, index: number) => ({
                                                        '@type': 'ListItem',
                                                        position: index + 1,
                                                        url: `https://www.bsjjewellers.com/products/${product.handle}`,
                                                    })),
                                                }),
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

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

                /* ── Body grid: sidebar + main ── */
                .cp-body-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                    align-items: start;
                }

                @media (min-width: 768px) {
                    .cp-body-grid {
                        grid-template-columns: 240px 1fr;
                        gap: 2rem;
                    }
                }

                @media (min-width: 1024px) {
                    .cp-body-grid {
                        grid-template-columns: 260px 1fr;
                        gap: 2.5rem;
                    }
                }

                /* ── Sidebar: sticky on desktop, no independent scroll ── */
.cp-sidebar {
    padding: 0 !important;
    overflow: visible !important;
    position: sticky !important;
    top: 7rem; /* matches your navbar height */
    height: fit-content;
    align-self: start;
}
                /* ── ActiveFilterBar: never clip, never scroll, grow naturally ── */
                .cp-active-filters {
                    height: auto;
                    overflow: visible;
                }

                .cp-active-filters:not(:empty) {
                    margin-bottom: 1rem;
                }

                /* ── Sort dropdown wrapper ── */
                .cp-sort-wrap select,
                .cp-sort-wrap [role="combobox"] {
                    font-family: 'DM Sans', sans-serif !important;
                    font-size: 0.78rem !important;
                    border: 1px solid #EDE8E0 !important;
                    border-radius: 6px !important;
                    padding: 0.45rem 2rem 0.45rem 0.75rem !important;
                    background: #FFFFFF !important;
                    color: #2C2218 !important;
                    cursor: pointer;
                    outline: none;
                    appearance: auto;
                }

                /* ── Skeleton grid responsive ── */
                .cp-skeleton-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                }

                @media (min-width: 768px) {
                    .cp-skeleton-grid {
                        /* Match ipg-grid: 2 cols at 768–1024px (sidebar takes space) */
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }

                @media (min-width: 1024px) {
                    .cp-skeleton-grid {
                        grid-template-columns: repeat(3, 1fr) !important;
                    }
                }

                @media (min-width: 1280px) {
                    .cp-skeleton-grid {
                        grid-template-columns: repeat(4, 1fr) !important;
                    }
                }

                @keyframes cpPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                /* ── Reset button hover ── */
                .cp-reset-btn:hover {
                    background: #1C1510 !important;
                    color: #FAF6F0 !important;
                }

                /* ── Sidebar: never show its own scrollbar under any circumstance ── */
                .cp-sidebar,
                .cp-sidebar * {
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                }
                .cp-sidebar::-webkit-scrollbar,
                .cp-sidebar *::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                }
                /* Belt-and-suspenders: no overflow on sidebar itself */
                .cp-sidebar {
                    overflow: visible !important;
                }

                /* ── Mobile: sidebar col collapses — FilterSidebar handles its own mobile button+drawer ── */
                @media (max-width: 767px) {
                    /* Remove the sidebar grid column on mobile so products take full width */
                    .cp-body-grid {
                        grid-template-columns: 1fr !important;
                    }
                    /* The aside wrapper has no width on mobile — FilterSidebar positions itself fixed */
                    .cp-sidebar {
                        width: 0 !important;
                        padding: 0 !important;
                        overflow: visible !important;
                    }
                }
            `}</style>
        </>
    );
}