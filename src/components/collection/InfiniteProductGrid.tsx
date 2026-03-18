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
    collectionHandle?: string;    // For collection pages
    searchQuery?: string;         // For search pages — DSL string from buildSearchQuery()
    serializedFilters?: string;   // For search pages — JSON.stringify(ProductFilter[])
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

    // Reset when URL parameters change completely (handled by next.js reloading the page prop, but good to be safe)
    useEffect(() => {
        setProducts(initialProducts);
        setPageInfo(initialPageInfo);
        
        // Scroll to top when filters change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [initialProducts, initialPageInfo]);

    // Construct filters based on current URL Search Parameters
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
                    if (Object.keys(priceFilter).length > 0) {
                        filters.push({ price: priceFilter });
                    }
                }
                continue;
            }

            filters.push({
                productMetafield: {
                    namespace: 'custom',
                    key: key,
                    value: value
                }
            });
        }
        return filters;
    }, [searchParams]);

    const loadMore = useCallback(async () => {
        if (loading || !pageInfo.hasNextPage || !pageInfo.endCursor) return;

        setLoading(true);

        // Parse sort
        const sortParam = searchParams.get('sort');
        let reverse = false;

        if (searchQuery) {
            // SEARCH MODE: use fetchMoreSearchProducts with serialized filters
            let searchSortKey = 'RELEVANCE';

            if (sortParam === 'price-asc') {
                searchSortKey = 'PRICE';
                reverse = false;
            } else if (sortParam === 'price-desc') {
                searchSortKey = 'PRICE';
                reverse = true;
            } else if (sortParam === 'newest') {
                searchSortKey = 'CREATED_AT';
                reverse = true;
            } else if (sortParam === 'best-selling') {
                searchSortKey = 'BEST_SELLING';
                reverse = false;
            }

            // Note: sort is baked into the initial server fetch but pagination ignores
            // sort (Shopify search pagination uses cursor, sort order is preserved)
            const nextData = await fetchMoreSearchProducts(
                searchQuery,
                serializedFilters,
                pageInfo.endCursor as string
            );

            if (nextData && nextData.products) {
                setProducts(prev => {
                    const newProducts = nextData.products.filter(
                        (newP: Product) => !prev.some(p => p.id === newP.id)
                    );
                    return [...prev, ...newProducts];
                });
                setPageInfo(nextData.pageInfo);
            }
        } else if (collectionHandle) {
            // COLLECTION MODE: use existing fetchMoreProducts
            const filters = parseClientFilters();
            let collectionSortKey = 'COLLECTION_DEFAULT';

            if (sortParam === 'price-asc') {
                collectionSortKey = 'PRICE';
                reverse = false;
            } else if (sortParam === 'price-desc') {
                collectionSortKey = 'PRICE';
                reverse = true;
            } else if (sortParam === 'newest') {
                collectionSortKey = 'CREATED_AT';
                reverse = true;
            } else if (sortParam === 'best-selling') {
                collectionSortKey = 'BEST_SELLING';
                reverse = false;
            }

            const nextData = await fetchMoreProducts(
                collectionHandle,
                filters,
                collectionSortKey,
                reverse,
                pageInfo.endCursor as string
            );

            if (nextData && nextData.products) {
                setProducts(prev => {
                    const newProducts = nextData.products.filter(
                        newP => !prev.some(p => p.id === newP.id)
                    );
                    return [...prev, ...newProducts];
                });
                setPageInfo(nextData.pageInfo);
            }
        }

        setLoading(false);
    }, [loading, pageInfo, searchParams, parseClientFilters, collectionHandle, searchQuery]);

    // Setup intersection observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '400px' }
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
            observer?.disconnect();
        };
    }, [loadMore]);

    return (
        <div className="infinite-grid-container">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        collectionHandle={collectionHandle}
                    />
                ))}
            </div>

            {/* Infinite Scroll Loader Target */}
            <div ref={loaderRef} className="py-12 flex justify-center w-full min-h-[100px]">
                {loading && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6 w-full">
                        {[...Array(4)].map((_, i) => (
                            <ProductCardSkeleton key={`skeleton-${i}`} />
                        ))}
                    </div>
                )}
                {!loading && !pageInfo.hasNextPage && products.length > 0 && (
                    <p className="text-stone-400 text-xs uppercase tracking-widest mt-8 border-t border-stone-100 pt-8 text-center w-full">
                        {searchQuery ? "You've seen all search results." : "You've reached the end of the collection."}
                    </p>
                )}
            </div>
        </div>
    );
}
