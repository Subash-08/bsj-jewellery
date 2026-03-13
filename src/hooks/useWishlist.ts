'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { Product } from '@/types/shopify/product';

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
                // Filter out old Trimmed items safely to prevent minVariantPrice crashes
                const validItems = parsed.filter((item: any) => item && item.priceRange);
                
                if (validItems.length !== parsed.length) {
                    localStorage.setItem('bsj_wishlist', JSON.stringify(validItems));
                }
                
                setWishlist(validItems);
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
            
            localStorage.setItem('bsj_wishlist', JSON.stringify(nextWishlist));
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
