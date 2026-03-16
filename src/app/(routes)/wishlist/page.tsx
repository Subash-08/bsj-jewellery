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
            <main className="min-h-screen bg-[#FAF8F5] pt-32 pb-20">
                <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-left mb-16">
                        <h1 className="text-5xl font-serif font-light text-stone-900 mb-4 pb-4">
                            My Wishlist
                        </h1>
                        <p className="text-stone-400 text-xs uppercase tracking-[0.2em]">
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
            <main className="min-h-screen bg-[#FAF8F5] pt-32 pb-20">
                <div className="max-w-md mx-auto px-4  space-y-8">
                    <div className="flex justify-center text-stone-200">
                        <Heart size={120} strokeWidth={0.5} className="fill-stone-50" />
                    </div>
                    <h1 className="text-4xl font-serif font-light text-stone-900">
                        Your wishlist is empty
                    </h1>
                    <p className="text-sm text-stone-500 font-light tracking-widest leading-relaxed">
                        Save your favourite jewellery pieces to find them later.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                        <Link
                            href="/collections/all"
                            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-stone-900 text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-stone-800 transition-colors"
                        >
                            Explore Collections
                        </Link>
                    </div>

                    {/* Trust strips */}
                    <div className="grid grid-cols-3 gap-4 mt-16 pt-8 border-t border-stone-200">
                        {[
                            { icon: Truck, label: 'Free Shipping', sub: 'On orders above ₹10,000' },
                            { icon: Shield, label: 'Certified', sub: '100% authentic' },
                            { icon: Tag, label: 'Best Prices', sub: 'Market rates' },
                        ].map(({ icon: Icon, label, sub }) => (
                            <div key={label} className="flex flex-col items-center gap-2 text-center">
                                <Icon size={24} className="text-stone-400" strokeWidth={1.5} />
                                <span className="text-xs font-bold text-stone-700 uppercase tracking-widest">{label}</span>
                                <span className="text-[10px] text-stone-500">{sub}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FAF8F5] pt-48 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-serif font-light text-stone-900 mb-4 text-center">
                        My Wishlist
                    </h1>
                    <p className="text-stone-400 text-xs uppercase tracking-[0.2em]">
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