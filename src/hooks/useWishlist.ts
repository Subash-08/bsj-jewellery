'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { Product } from '@/types/shopify/product';

// Minimal shape stored in LocalStorage to save space
interface TrimmedWishlistItem {
    id: string;
    title: string;
    handle: string;
    availableForSale: boolean;
    imageUrl: string;
    imageAlt: string;
    minPrice: string;
    maxPrice: string;
    currencyCode: string;
}

function trimProduct(product: Product): TrimmedWishlistItem {
    return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        availableForSale: product.availableForSale,
        imageUrl: product.featuredImage?.url || product.images?.[0]?.url || '',
        imageAlt: product.featuredImage?.altText || product.title,
        minPrice: product.priceRange?.minVariantPrice?.amount || '0',
        maxPrice: product.priceRange?.maxVariantPrice?.amount || '0',
        currencyCode: product.priceRange?.minVariantPrice?.currencyCode || 'INR',
    };
}

// Reconstruct a Product-shaped object from trimmed data for UI compatibility
function hydrateFromTrimmed(item: TrimmedWishlistItem): Product {
    return {
        id: item.id,
        title: item.title,
        handle: item.handle,
        availableForSale: item.availableForSale,
        description: '',
        descriptionHtml: '',
        options: [],
        images: [{ id: '', url: item.imageUrl, altText: item.imageAlt, width: 400, height: 400 }],
        variants: [],
        featuredImage: { id: '', url: item.imageUrl, altText: item.imageAlt, width: 400, height: 400 },
        priceRange: {
            minVariantPrice: { amount: item.minPrice, currencyCode: item.currencyCode },
            maxVariantPrice: { amount: item.maxPrice, currencyCode: item.currencyCode },
        },
        compareAtPriceRange: {
            minVariantPrice: { amount: '0', currencyCode: item.currencyCode },
            maxVariantPrice: { amount: '0', currencyCode: item.currencyCode },
        },
        productType: '',
        collections: { edges: [] },
        seo: { title: item.title, description: '' },
        tags: [],
        updatedAt: '',
        metafields: [],
        jewelryMetafields: {},
    } as Product;
}

export function useWishlist() {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // Initialize from localStorage on mount
    useEffect(() => {
        setIsMounted(true);
        try {
            const stored = localStorage.getItem('bsj_wishlist');
            if (stored) {
                const parsed = JSON.parse(stored);
                // Support both old full-Product format and new trimmed format
                const items: Product[] = parsed.map((item: any) => {
                    if (item && item.imageUrl !== undefined) {
                        // New trimmed format
                        return hydrateFromTrimmed(item as TrimmedWishlistItem);
                    }
                    // Old format — convert & save trimmed version on next write
                    if (item && item.priceRange) {
                        return item as Product;
                    }
                    return null;
                }).filter(Boolean) as Product[];

                setWishlist(items);

                // Re-save in trimmed format to migrate old data
                const trimmed = items.map(trimProduct);
                localStorage.setItem('bsj_wishlist', JSON.stringify(trimmed));
            }
        } catch (e) {
            console.error('Failed to parse wishlist', e);
        }
    }, []);

    const toggleWishlist = (product: Product) => {
        setWishlist(prev => {
            const exists = prev.some(item => item.id === product.id);
            let nextWishlist;
            
            if (exists) {
                nextWishlist = prev.filter(item => item.id !== product.id);
                toast.info("Removed from wishlist", { id: "wishlist-remove-" + product.id });
            } else {
                nextWishlist = [...prev, product];
                toast.success("Added to wishlist", { id: "wishlist-add-" + product.id });
            }
            
            // Always save trimmed version
            const trimmed = nextWishlist.map(trimProduct);
            localStorage.setItem('bsj_wishlist', JSON.stringify(trimmed));
            return nextWishlist;
        });
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some(item => item.id === productId);
    };

    const getWishlist = () => {
        return wishlist;
    };

    return {
        wishlist,
        toggleWishlist,
        isInWishlist,
        getWishlist,
        isMounted // Used to prevent hydration mismatch on server render
    };
}
