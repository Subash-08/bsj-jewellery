"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext<any>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('wishlist');
        if (stored) {
            setWishlist(JSON.parse(stored));
        }
    }, []);

    const addToWishlist = (id: string) => {
        const updated = [...wishlist, id];
        setWishlist(updated);
        localStorage.setItem('wishlist', JSON.stringify(updated));
    };

    const removeFromWishlist = (id: string) => {
        const updated = wishlist.filter((w) => w !== id);
        setWishlist(updated);
        localStorage.setItem('wishlist', JSON.stringify(updated));
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => useContext(WishlistContext);