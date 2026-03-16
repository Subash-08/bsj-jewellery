import type { JewelryMetafields } from '../metafield';

export interface Product {
    id: string;
    handle: string;
    availableForSale: boolean; // Restored
    title: string;
    description: string;
    descriptionHtml: string;
    options: { // Restored
        id: string;
        name: string;
        values: string[];
    }[];
    productType: string;
    tags: string[];
    collections: {
        edges: {
            node: {
                id: string;
                handle: string;
                title: string;
            };
        }[];
    };
    priceRange: {
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        };
        maxVariantPrice: {
            amount: string;
            currencyCode: string;
        };
    };
    metafields: Metafield[];
    jewelryMetafields?: JewelryMetafields; // Parsed metafields
    featuredImage?: ProductImage; // Optional because logic might check array
    images: ProductImage[];
    variants: ProductVariant[];
    seo?: {
        title: string;
        description: string;
    };
    updatedAt: string; // Restored
}

export interface Metafield {
    id: string;
    namespace: string;
    key: string;
    value: string;
    type: string;
}

export interface ProductImage {
    id: string;
    url: string;
    altText: string | null;
    width: number;
    height: number;
}

export interface ProductVariant {
    id: string;
    title: string;
    sku: string | null;
    availableForSale: boolean;
    price: {
        amount: string;
        currencyCode: string;
    };
    compareAtPrice: {
        amount: string;
        currencyCode: string;
    } | null;
    selectedOptions: Array<{
        name: string;
        value: string;
    }>;
}

export interface FilterValue {
    id: string;
    label: string;
    count: number;
    input: string; // JSON string like {"price":{"min":10,"max":50}} or {"productMetafield":{"namespace":"custom","key":"color","value":"red"}}
}

export interface Filter {
    id: string;
    label: string;
    type: 'LIST' | 'PRICE_RANGE' | 'BOOLEAN';
    values: FilterValue[];
}

export type ProductFilter =
    | { available: boolean }
    | { price: { min?: number; max?: number } }
    | { productType: string }
    | { tag: string }
    | { productVendor: string }
    | { variantOption: { name: string; value: string } }
    | { productMetafield: { namespace: string; key: string; value: string } };

export interface PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
}