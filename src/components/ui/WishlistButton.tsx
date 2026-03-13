'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import type { Product } from '@/types/shopify/product';
import { cn } from '@/components/ui/Badge'; // Temporary cn import location

interface WishlistButtonProps {
    product: Product;
    className?: string;
    iconClassName?: string;
}

export function WishlistButton({ product, className, iconClassName }: WishlistButtonProps) {
    const { isInWishlist, toggleWishlist, isMounted } = useWishlist();

    // Prevent hydration mismatch by returning empty shell before mount
    if (!isMounted) {
        return (
            <button 
                className={cn("p-2 rounded-full bg-white/80 backdrop-blur shadow-sm text-gray-400 hover:text-rose-500 transition-colors", className)}
                aria-label="Loading wishlist"
                disabled
            >
                <Heart className={cn("w-5 h-5", iconClassName)} />
            </button>
        );
    }

    const active = isInWishlist(product.id);

    return (
        <button 
            onClick={(e) => {
                e.preventDefault(); // Prevent triggering link clicks if inside a link
                toggleWishlist(product);
            }}
            className={cn(
                "p-2 rounded-full bg-white/80 backdrop-blur shadow-sm transition-colors", 
                active ? "text-rose-600 bg-white" : "text-gray-400 hover:text-rose-500",
                className
            )}
            aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart 
                className={cn("w-5 h-5 transition-transform", active ? "fill-rose-500 scale-110 border-none" : "", iconClassName)} 
                strokeWidth={active ? 0 : 2}
            />
        </button>
    );
}
