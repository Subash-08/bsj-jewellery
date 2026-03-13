'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types/shopify/product';

export default function WishlistPage() {
    const { getWishlist, isMounted } = useWishlist();
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

    useEffect(() => {
        if (isMounted) {
            // We use getWishlist here since we are in a component that runs after mount
            // and we know local storage is already hydrated
            setWishlistItems(getWishlist() as unknown as Product[]);
        }
    }, [isMounted, getWishlist]);

    if (!isMounted) {
        return (
            <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <Heart className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-400">Loading your wishlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 border-b pb-6">
                    <h1 className="text-4xl font-serif text-gray-900 mb-2 flex items-center gap-3">
                        <Heart className="w-8 h-8 text-rose-600 fill-rose-600" />
                        My Wishlist
                    </h1>
                    <p className="text-gray-500">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
                        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                            <Heart className="w-8 h-8 text-rose-400" />
                        </div>
                        <h2 className="text-2xl font-serif text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm">
                            Save your favorite pieces here so you can easily find them later.
                        </p>
                        <Link 
                            href="/collections/all" 
                            className="bg-rose-600 text-white px-8 py-3 rounded-md hover:bg-rose-700 transition-colors font-medium shadow-sm"
                        >
                            Explore Collection
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {wishlistItems.map((product) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}