'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product, PageInfo } from '@/types/shopify/product';
import { fetchMoreProducts } from '@/app/actions/get-products';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';

interface InfiniteProductGridProps {
    initialProducts: Product[];
    initialPageInfo: PageInfo;
    collectionHandle: string;
}

export default function InfiniteProductGrid({
    initialProducts,
    initialPageInfo,
    collectionHandle
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
    // We parse them exactly identically to the server so we can request the next page correctly
    const parseClientFilters = useCallback(() => {
        const filters: any[] = [];
        const ignoreParams = ['sort', 'q', 'page', 'after'];
        
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

        const filters = parseClientFilters();
        
        // Parse sort
        const sortParam = searchParams.get('sort');
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
            reverse = false; // Shopify default for best-selling
        }

        const nextData = await fetchMoreProducts(
            collectionHandle,
            filters,
            sortKey,
            reverse,
            pageInfo.endCursor as string
        );

        if (nextData && nextData.products) {
            setProducts(prev => {
                // Deduplicate by ID
                const newProducts = nextData.products.filter(
                    newP => !prev.some(p => p.id === newP.id)
                );
                return [...prev, ...newProducts];
            });
            setPageInfo(nextData.pageInfo);
        }

        setLoading(false);
    }, [loading, pageInfo, searchParams, parseClientFilters, collectionHandle]);

    // Setup intersection observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '400px' } // Load earlier
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
            observer?.disconnect(); // Prevent memory leaks
        };
    }, [loadMore]);

    return (
        <div className="infinite-grid-container">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                        {[...Array(4)].map((_, i) => (
                            <ProductCardSkeleton key={`skeleton-${i}`} />
                        ))}
                    </div>
                )}
                {!loading && !pageInfo.hasNextPage && products.length > 0 && (
                    <p className="text-gray-400 text-sm mt-8 border-t border-gray-100 pt-8 text-center w-full">
                        You've reached the end of the collection.
                    </p>
                )}
            </div>
        </div>
    );
}
