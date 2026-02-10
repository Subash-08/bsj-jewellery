import { useMemo } from 'react';
import type { Product } from '@/types/shopify/product';
import { parseMetafields, getMetafieldValue } from '@/lib/utils/metafield-parser';

export function useJewelryMetafields(product: Product) {
    return useMemo(() => {
        return product.jewelryMetafields || parseMetafields(product.metafields);
    }, [product]);
}

export function useFilteredProductsByMetafield(
    products: Product[],
    key: string,
    value: any
): Product[] {
    return useMemo(() => {
        return products.filter(product =>
            getMetafieldValue(product.metafields, key, null) === value
        );
    }, [products, key, value]);
}

export function useMetafieldValues<T>(
    products: Product[],
    key: string
): T[] {
    return useMemo(() => {
        const values = new Set<T>();

        products.forEach(product => {
            const value = getMetafieldValue(product.metafields, key, null);
            if (value !== null) values.add(value as T);
        });

        return Array.from(values);
    }, [products, key]);
}