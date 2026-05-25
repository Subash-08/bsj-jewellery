import { getCollection, getCollectionProducts } from '@/lib/shopify/client';
import FilterSidebar from '@/components/filters/FilterSidebar';
import InfiniteProductGrid from '@/components/collection/InfiniteProductGrid';
import { ActiveFilterBar } from '@/components/filters/ActiveFilterBar';
import { SortDropdown } from '@/components/filters/SortDropdown';
import type { Metadata } from 'next';
import { getShopifyHandle, getProductUrl } from '@/lib/routes/index';
import { Suspense } from 'react';
import { COLLECTIONS, COLLECTION_FAQS, SITE } from '@/lib/seo.config';
import { SchemaScript } from '@/components/seo/SchemaScript';
import { collectionPageSchema, faqSchema, webPageSchema } from '@/lib/schema';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type CollectionKey = keyof typeof COLLECTIONS;

function getSeoConfig(category: string) {
    const key = category as CollectionKey;
    return COLLECTIONS[key] ?? null;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const hasFilters = Object.keys(searchParams).length > 0;
    const baseCanonical = `${SITE.domain}/silver-jewellery/${params.category}`;

    const seo = getSeoConfig(params.category);
    if (seo) {
        const canonical = `${SITE.domain}/${seo.handle}`;
        return {
            title: seo.metaTitle,
            description: seo.metaDescription,
            keywords: [...seo.keywords],
            alternates: { canonical },
            robots: hasFilters ? { index: false, follow: true } : { index: true, follow: true },
            openGraph: {
                title: seo.metaTitle,
                description: seo.metaDescription,
                url: canonical,
                type: 'website',
            },
        };
    }
    try {
        const shopifyHandle = getShopifyHandle(params.category);
        const collection = await getCollection(shopifyHandle);
        if (!collection) return {};
        return {
            title: `${collection.seo?.title || collection.title} | Bakya Silver Jewellery`,
            description: collection.seo?.description || collection.description,
            alternates: { canonical: baseCanonical },
            robots: hasFilters ? { index: false, follow: true } : { index: true, follow: true },
        };
    } catch {
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

    const shopifyHandle = getShopifyHandle(params.category);

    const collectionData = await getCollectionProducts({
        handle: shopifyHandle,
        filters: filters.length > 0 ? filters : undefined,
        sortKey,
        reverse,
    });

    const hasFilters = collectionData?.filters && collectionData.filters.length > 0;
    const productCount = collectionData?.products.length || 0;
    const hasMore = collectionData?.pageInfo.hasNextPage;

    const seoConfig = getSeoConfig(params.category);
    const collectionTitle = seoConfig?.title ?? shopifyHandle
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    const h1Text = seoConfig?.h1 ?? collectionTitle;
    const faqs = seoConfig ? COLLECTION_FAQS[params.category as keyof typeof COLLECTION_FAQS] ?? [] : [];
    const pageUrl = `${SITE.domain}/silver-jewellery/${params.category}`;

    const schemaProducts = (collectionData?.products ?? []).slice(0, 20).map((p: { title: string; handle: string; featuredImage?: { url: string }; priceRange?: { minVariantPrice?: { amount?: string } } }) => ({
        name: p.title,
        url: `${SITE.domain}${getProductUrl(p.handle, shopifyHandle)}`,
        image: p.featuredImage?.url ?? '',
        price: p.priceRange?.minVariantPrice?.amount ?? '0',
    }));

    return (
        <>
            {seoConfig && (
                <SchemaScript schema={[
                    collectionPageSchema({
                        name: h1Text,
                        description: seoConfig.metaDescription,
                        url: pageUrl,
                        products: schemaProducts,
                        breadcrumbs: [
                            { name: 'Home', url: SITE.domain },
                            { name: 'Silver Jewellery', url: `${SITE.domain}/silver-jewellery` },
                            { name: seoConfig.title, url: pageUrl },
                        ],
                    }),
                    ...(faqs.length > 0 ? [faqSchema(faqs)] : []),
                    webPageSchema({
                        type: 'CollectionPage',
                        name: h1Text,
                        description: seoConfig.metaDescription,
                        url: pageUrl,
                    }),
                ]} />
            )}
            <div
                className="collection-page min-h-screen pb-24"
                style={{ background: '#FAF8F5', paddingTop: '1rem' }}
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
                        {/* Breadcrumb */}
                        <nav aria-label="Breadcrumb">
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
                                <a href="/" style={{ color: '#B0A090', textDecoration: 'none' }}>Home</a>
                                {' › '}
                                <a href="/silver-jewellery" style={{ color: '#B0A090', textDecoration: 'none' }}>Silver Jewellery</a>
                                {' › '}
                                {collectionTitle}
                            </p>
                        </nav>

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
                                    {h1Text}
                                </h1>
                                {seoConfig?.definition && (
                                    <p
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontSize: '0.85rem',
                                            color: '#4A3F35',
                                            maxWidth: 620,
                                            lineHeight: 1.6,
                                            marginTop: '0.5rem',
                                        }}
                                    >
                                        {seoConfig.definition}
                                    </p>
                                )}
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

                        {/* ── FilterSidebar desktop sticky sidebar ── */}
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
                            {/* Mobile filter trigger — only shown on mobile, rendered INSIDE the main flow */}
                            {hasFilters && (
                                <div className="cp-mobile-filter-row">
                                    <FilterSidebar
                                        filters={collectionData!.filters}
                                        currentParams={searchParams}
                                    />
                                </div>
                            )}

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
                                            href={`/silver-jewellery/${params.category}`}
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
                                        <InfiniteProductGrid
                                            initialProducts={collectionData.products}
                                            initialPageInfo={collectionData.pageInfo}
                                            collectionHandle={shopifyHandle}
                                        />
                                    </>
                                )}
                            </Suspense>
                        </main>
                    </div>

                    {/* SEO description */}
                    {seoConfig?.description && (
                        <section
                            aria-label={`About ${seoConfig.title}`}
                            style={{
                                marginTop: '3rem',
                                padding: '2rem',
                                background: '#FFFFFF',
                                border: '1px solid #EDE8E0',
                                borderRadius: 12,
                            }}
                        >
                            <h2
                                style={{
                                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                                    fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                                    fontWeight: 700,
                                    color: '#1C1510',
                                    marginBottom: '1rem',
                                }}
                            >
                                About {seoConfig.title}
                            </h2>
                            {seoConfig.description.split('\n\n').map((para, i) => (
                                <p
                                    key={i}
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: '0.88rem',
                                        color: '#4A3F35',
                                        lineHeight: 1.8,
                                        marginBottom: '1rem',
                                    }}
                                >
                                    {para}
                                </p>
                            ))}
                        </section>
                    )}

                    {/* Related collections */}
                    {seoConfig && (
                        <nav
                            aria-label="Browse other collections"
                            style={{ marginTop: '2rem' }}
                        >
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B0A090', marginBottom: '0.6rem' }}>
                                Browse More
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {(['anklets', 'bracelets', 'chains', 'pendants', 'rings'] as const)
                                    .filter(k => k !== params.category)
                                    .map(k => (
                                        <a
                                            key={k}
                                            href={`/silver-jewellery/${k}`}
                                            style={{
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: '0.72rem',
                                                fontWeight: 600,
                                                color: '#2C2218',
                                                border: '1px solid #C9A96E',
                                                borderRadius: 20,
                                                padding: '0.35rem 0.9rem',
                                                textDecoration: 'none',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {COLLECTIONS[k].title}
                                        </a>
                                    ))}
                            </div>
                        </nav>
                    )}

                    {/* FAQ section */}
                    {faqs.length > 0 && (
                        <section
                            aria-label={seoConfig?.faqTitle ?? 'Frequently Asked Questions'}
                            style={{ marginTop: '2.5rem' }}
                        >
                            <h2
                                style={{
                                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                                    fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                                    fontWeight: 700,
                                    color: '#1C1510',
                                    marginBottom: '1.25rem',
                                }}
                            >
                                {seoConfig?.faqTitle ?? 'Frequently Asked Questions'}
                            </h2>
                            <dl style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {faqs.map((faq) => (
                                    <div
                                        key={faq.q}
                                        style={{
                                            background: '#FFFFFF',
                                            border: '1px solid #EDE8E0',
                                            borderRadius: 10,
                                            padding: '1.1rem 1.25rem',
                                        }}
                                    >
                                        <dt
                                            style={{
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: '0.88rem',
                                                fontWeight: 700,
                                                color: '#2C2218',
                                                marginBottom: '0.4rem',
                                            }}
                                        >
                                            {faq.q}
                                        </dt>
                                        <dd
                                            style={{
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: '0.84rem',
                                                color: '#4A3F35',
                                                lineHeight: 1.7,
                                                margin: 0,
                                            }}
                                        >
                                            {faq.a}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </section>
                    )}
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

                /* ── Desktop sidebar: sticky panel ── */
                .cp-sidebar {
                    padding: 0 !important;
                    overflow: visible !important;
                    position: sticky !important;
                    top: 7rem;
                    height: fit-content;
                    align-self: start;
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                }
                .cp-sidebar::-webkit-scrollbar,
                .cp-sidebar *::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                }

                /* ── Mobile: hide the desktop sidebar col entirely ── */
                @media (max-width: 767px) {
                    .cp-body-grid {
                        grid-template-columns: 1fr !important;
                    }
                    /* Hide the sticky desktop sidebar aside on mobile */
                    .cp-sidebar {
                        display: none !important;
                    }
                }

                /* ── Mobile filter row: only shown on mobile, inside cp-main ── */
                .cp-mobile-filter-row {
                    display: none;
                }

                @media (max-width: 767px) {
                    /* Show the mobile filter trigger row only on mobile */
                    .cp-mobile-filter-row {
                        display: block;
                        margin-bottom: 0.5rem;
                    }
                    /* Hide the desktop sidebar panel that FilterSidebar renders inside cp-mobile-filter-row */
                    .cp-mobile-filter-row .fs-aside {
                        display: none !important;
                    }
                    /* But keep the mobile drawer itself visible when open */
                    .cp-mobile-filter-row .fs-aside.fs-aside--open {
                        display: flex !important;
                    }
                }

                @media (min-width: 768px) {
                    /* Hide the mobile-only duplicate FilterSidebar on desktop */
                    .cp-mobile-filter-row {
                        display: none !important;
                    }
                }

                /* ── ActiveFilterBar ── */
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

                .cp-reset-btn:hover {
                    background: #1C1510 !important;
                    color: #FAF6F0 !important;
                }
            `}</style>
        </>
    );
}