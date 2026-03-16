'use server';

import { getCollectionProducts, getSearchResults } from '@/lib/shopify/client';
import type { ProductFilter } from '@/types/shopify/product';

export async function fetchMoreProducts(
    collectionHandle: string,
    filters: ProductFilter[],
    sortKey: string,
    reverse: boolean,
    cursor: string
) {
    try {
        const data = await getCollectionProducts({
            handle: collectionHandle,
            filters: filters.length > 0 ? filters : undefined,
            sortKey,
            reverse,
            after: cursor,
        });

        if (!data) {
            return { products: [], pageInfo: { hasNextPage: false, startCursor: null, endCursor: null, hasPreviousPage: false } };
        }

        return { products: data.products, pageInfo: data.pageInfo };
    } catch (error) {
        console.error('Error fetching more products:', error);
        return { products: [], pageInfo: { hasNextPage: false, startCursor: null, endCursor: null, hasPreviousPage: false } };
    }
}

/**
 * Fetches the next page of search results.
 * @param searchQuery  - The DSL query string built by buildSearchQuery()
 * @param serializedFilters - JSON.stringify(ProductFilter[]) — exactly what was built by parseFilters() on the server
 * @param cursor       - The endCursor from the previous pageInfo
 */
export async function fetchMoreSearchProducts(
    searchQuery: string,
    serializedFilters: string,
    cursor: string
) {
    try {
        let filters: ProductFilter[] = [];
        try {
            filters = JSON.parse(serializedFilters) as ProductFilter[];
        } catch {
            filters = [];
        }

        const data = await getSearchResults({
            query: searchQuery,
            productFilters: filters.length > 0 ? filters : undefined,
            after: cursor,
        });

        if (!data) {
            return { products: [], pageInfo: { hasNextPage: false, startCursor: null, endCursor: null, hasPreviousPage: false } };
        }

        return { products: data.products, pageInfo: data.pageInfo };
    } catch (error) {
        console.error('Error fetching more search products:', error);
        return { products: [], pageInfo: { hasNextPage: false, startCursor: null, endCursor: null, hasPreviousPage: false } };
    }
}
