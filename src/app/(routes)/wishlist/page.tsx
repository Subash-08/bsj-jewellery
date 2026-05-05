'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ChevronRight, Shield, Truck, Tag } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import type { Product } from '@/types/shopify/product';
import { WishlistItemCard } from '@/components/wishlist/WishlistItemCard';
import { WishlistSkeleton } from '@/components/wishlist/WishlistSkeleton';

export default function WishlistPage() {
    const { getWishlist, toggleWishlist, isMounted } = useWishlist();
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

    useEffect(() => {
        if (isMounted) {
            // We use getWishlist here since we are in a component that runs after mount
            // and we know local storage is already hydrated
            setWishlistItems(getWishlist() as unknown as Product[]);
        }
    }, [isMounted, getWishlist]);

    const handleRemoveFromWishlist = (id: string, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        // Since removeFromWishlist isn't exported by the hook directly, we can use toggleWishlist 
        // to remove it (since it's already in the wishlist array we are iterating over).
        toggleWishlist({ id } as Product);
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    if (!isMounted) {
        return (
            <main className="min-h-screen bg-white pt-32 pb-20">
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                    .font-montserrat { font-family: 'Montserrat', sans-serif; }
                    .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
                    .font-playfair { font-family: 'Playfair Display', serif; }
                `}</style>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-playfair font-semibold text-[#230532] mb-4">
                            My Wishlist
                        </h1>
                        <p className="font-montserrat text-[#52525b] text-[14px]">
                            Loading...
                        </p>
                    </div>
                    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <WishlistSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <main className="min-h-screen bg-white pt-48 pb-20 flex flex-col items-center">
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                    .font-montserrat { font-family: 'Montserrat', sans-serif; }
                    .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
                    .font-playfair { font-family: 'Playfair Display', serif; }
                `}</style>
                <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
                    <div className="flex justify-center items-center gap-4 text-[#230532] mb-2">
                        <span className="text-2xl">✦</span>
                        <h1 className="text-[32px] md:text-[40px] font-playfair font-semibold">
                            No Treasures Saved Yet
                        </h1>
                        <span className="text-2xl">✦</span>
                    </div>
                    <p className="text-[#52525b] font-montserrat italic text-[16px] leading-[24px]">
                        Start exploring and save your favourite jewellery pieces to<br className="hidden sm:block" /> view them here anytime.
                    </p>
                    <div className="flex justify-center pt-4">
                        <Link
                            href="/collections/all"
                            className="inline-flex items-center justify-center px-8 py-3 bg-[#230532] text-white font-jakarta text-[15px] font-semibold rounded hover:opacity-90 transition-opacity"
                        >
                            Explore Collection
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white pt-32 pb-32">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                .font-montserrat { font-family: 'Montserrat', sans-serif; }
                .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
                .font-playfair { font-family: 'Playfair Display', serif; }
            `}</style>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-playfair font-semibold text-[#230532] mb-4">
                        My Wishlist
                    </h1>
                    <p className="font-montserrat text-[#52525b] text-[14px]">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
                    {wishlistItems.map((product) => (
                        <div key={product.id} className="w-full">
                            <WishlistItemCard
                                product={product}
                                onRemove={handleRemoveFromWishlist}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}