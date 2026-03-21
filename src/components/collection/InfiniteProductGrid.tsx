'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product, PageInfo } from '@/types/shopify/product';
import { fetchMoreProducts, fetchMoreSearchProducts } from '@/app/actions/get-products';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';

interface InfiniteProductGridProps {
    initialProducts: Product[];
    initialPageInfo: PageInfo;
    collectionHandle?: string;
    searchQuery?: string;
    serializedFilters?: string;
}

export default function InfiniteProductGrid({
    initialProducts,
    initialPageInfo,
    collectionHandle,
    searchQuery,
    serializedFilters = '[]',
}: InfiniteProductGridProps) {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setProducts(initialProducts);
        setPageInfo(initialPageInfo);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [initialProducts, initialPageInfo]);

    const parseClientFilters = useCallback(() => {
        const filters: any[] = [];
        const ignoreParams = ['sort', 'q', 'page', 'after', 'collection'];
        const paramsEntries = Array.from(searchParams.entries());

        for (const [key, value] of paramsEntries) {
            if (ignoreParams.includes(key) || !value) continue;
            if (key === 'price') {
                if (value.includes('-')) {
                    const [min, max] = value.split('-');
                    const priceFilter: any = {};
                    if (min && !isNaN(Number(min))) priceFilter.min = Number(min);
                    if (max && !isNaN(Number(max))) priceFilter.max = Number(max);
                    if (Object.keys(priceFilter).length > 0) filters.push({ price: priceFilter });
                }
                continue;
            }
            filters.push({ productMetafield: { namespace: 'custom', key, value } });
        }
        return filters;
    }, [searchParams]);

    const loadMore = useCallback(async () => {
        if (loading || !pageInfo.hasNextPage || !pageInfo.endCursor) return;
        setLoading(true);

        const sortParam = searchParams.get('sort');
        let reverse = false;

        if (searchQuery) {
            let searchSortKey = 'RELEVANCE';
            if (sortParam === 'price-asc') { searchSortKey = 'PRICE'; reverse = false; }
            else if (sortParam === 'price-desc') { searchSortKey = 'PRICE'; reverse = true; }
            else if (sortParam === 'newest') { searchSortKey = 'CREATED_AT'; reverse = true; }
            else if (sortParam === 'best-selling') { searchSortKey = 'BEST_SELLING'; reverse = false; }

            const nextData = await fetchMoreSearchProducts(searchQuery, serializedFilters, pageInfo.endCursor as string);
            if (nextData?.products) {
                setProducts(prev => {
                    const newProducts = nextData.products.filter((newP: Product) => !prev.some(p => p.id === newP.id));
                    return [...prev, ...newProducts];
                });
                setPageInfo(nextData.pageInfo);
            }
        } else if (collectionHandle) {
            const filters = parseClientFilters();
            let collectionSortKey = 'COLLECTION_DEFAULT';
            if (sortParam === 'price-asc') { collectionSortKey = 'PRICE'; reverse = false; }
            else if (sortParam === 'price-desc') { collectionSortKey = 'PRICE'; reverse = true; }
            else if (sortParam === 'newest') { collectionSortKey = 'CREATED_AT'; reverse = true; }
            else if (sortParam === 'best-selling') { collectionSortKey = 'BEST_SELLING'; reverse = false; }

            const nextData = await fetchMoreProducts(collectionHandle, filters, collectionSortKey, reverse, pageInfo.endCursor as string);
            if (nextData?.products) {
                setProducts(prev => {
                    const newProducts = nextData.products.filter((newP: Product) => !prev.some(p => p.id === newP.id));
                    return [...prev, ...newProducts];
                });
                setPageInfo(nextData.pageInfo);
            }
        }

        setLoading(false);
    }, [loading, pageInfo, searchParams, parseClientFilters, collectionHandle, searchQuery, serializedFilters]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0]?.isIntersecting) loadMore(); },
            { threshold: 0.1, rootMargin: '400px' }
        );
        const currentLoader = loaderRef.current;
        if (currentLoader) observer.observe(currentLoader);
        return () => { if (currentLoader) observer.unobserve(currentLoader); observer?.disconnect(); };
    }, [loadMore]);

    return (
        <>
            <div className="infinite-grid-container">
                {/* ── Product grid ── */}
                <div className="ipg-grid">
                    {products.map((product, i) => (
                        <div
                            key={product.id}
                            className="ipg-card-wrap"
                            style={{ animationDelay: `${(i % 8) * 45}ms` }}
                        >
                            <ProductCard
                                product={product}
                                collectionHandle={collectionHandle}
                            />
                        </div>
                    ))}
                </div>

                {/* ── Infinite scroll sentinel ── */}
                <div ref={loaderRef} className="ipg-loader-sentinel">
                    {loading && (
                        <div className="ipg-grid ipg-skeleton-grid">
                            {[...Array(4)].map((_, i) => (
                                <ProductCardSkeleton key={`skeleton-${i}`} />
                            ))}
                        </div>
                    )}
                    {!loading && !pageInfo.hasNextPage && products.length > 0 && (
                        <div className="ipg-end-msg">
                            <div className="ipg-end-line" />
                            <span className="ipg-end-text">
                                {searchQuery ? 'End of search results' : 'End of collection'}
                            </span>
                            <div className="ipg-end-line" />
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                /* ── Grid layout — responsive columns ── */
                .ipg-grid {
                    display: grid;
                    /* 2 cols on mobile, 3 on md, 4 on wide sidebar-less views */
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                }

                @media (min-width: 480px) {
                    .ipg-grid { gap: 1.1rem; }
                }

                @media (min-width: 640px) {
                    .ipg-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1.25rem;
                    }
                }

                /* 768–1024px: sidebar takes ~240px, remaining space fits 2 cards comfortably */
                @media (min-width: 768px) {
                    .ipg-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1.25rem;
                    }
                }

                /* 1024px+: enough room for 3 cols alongside sidebar */
                @media (min-width: 1024px) {
                    .ipg-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 1.25rem;
                    }
                }

                @media (min-width: 1280px) {
                    .ipg-grid {
                        grid-template-columns: repeat(4, 1fr);
                        gap: 1.5rem;
                    }
                }

                /* ── Card entrance animation ── */
                .ipg-card-wrap {
                    animation: ipgFadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
                }

                @keyframes ipgFadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* ── Skeleton grid matches product grid exactly ── */
                .ipg-skeleton-grid {
                    width: 100%;
                    margin-top: 0;
                }

                /* ── Sentinel / loader area ── */
                .ipg-loader-sentinel {
                    min-height: 80px;
                    padding: 2rem 0 1rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                }

                /* ── End-of-collection message ── */
                .ipg-end-msg {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    width: 100%;
                    max-width: 320px;
                    margin: 0 auto;
                    padding: 1.5rem 0;
                }

                .ipg-end-line {
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, #C9A96E55, transparent);
                }

                .ipg-end-text {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.62rem;
                    font-weight: 600;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #B0A090;
                    white-space: nowrap;
                }
            `}</style>
        </>
    );
}