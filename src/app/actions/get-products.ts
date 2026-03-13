'use server';

import { getCollectionProducts } from '@/lib/shopify/client';

export async function fetchMoreProducts(
    collectionHandle: string,
    filters: any[],
    sortKey: string,
    reverse: boolean,
    cursor: string
) {
    try {
        const queryFilters = filters.length > 0 ? filters : undefined;
        
        const data = await getCollectionProducts({
            handle: collectionHandle,
            filters: queryFilters,
            sortKey,
            reverse,
            after: cursor,
        });

        if (!data) {
            return { products: [], pageInfo: { hasNextPage: false, startCursor: null, endCursor: null, hasPreviousPage: false } };
        }

        return {
            products: data.products,
            pageInfo: data.pageInfo,
        };
    } catch (error) {
        console.error('Error fetching more products:', error);
        return { products: [], pageInfo: { hasNextPage: false, startCursor: null, endCursor: null, hasPreviousPage: false } };
    }
}
