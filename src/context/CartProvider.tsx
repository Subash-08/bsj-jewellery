"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Cart } from '@/types/shopify/cart';

type CartContextType = {
    cart: Cart | undefined;
    addCartItem: (variantId: string, quantity: number) => Promise<void>;
    updateCartItem: (lineId: string, quantity: number) => Promise<void>;
    removeCartItem: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Cart | undefined>(undefined);
    const [cartId, setCartId] = useState<string | undefined>(undefined);

    useEffect(() => {
        // Initialize cart from local storage or create new
        const storedId = localStorage.getItem('cartId');
        if (storedId) {
            setCartId(storedId);
            fetchCart(storedId);
        }
    }, []);

    const fetchCart = async (id: string) => {
        // In a real app, you would fetch via API or Server Action
        // For now, we assume we might need an endpoint like /api/cart?id=...
        // But commonly we just use the response from mutations.
        // If we have an ID but no cart data, we need to fetch it.
        // We can use a client-side wrapper or API route.
        // For this skeleton, we'll placeholder.
    };

    const addCartItem = async (variantId: string, quantity: number) => {
        let currentId = cartId;
        if (!currentId) {
            const res = await fetch('/api/cart/create', { method: 'POST' });
            const newCart = await res.json();
            setCartId(newCart.id);
            setCart(newCart);
            localStorage.setItem('cartId', newCart.id);
            currentId = newCart.id;
        }

        if (!currentId) return;

        const res = await fetch('/api/cart/update', {
            method: 'POST',
            body: JSON.stringify({
                cartId: currentId,
                lines: [{ merchandiseId: variantId, quantity }],
                action: 'add',
            }),
        });
        const updatedCart = await res.json();
        setCart(updatedCart);
    };

    const updateCartItem = async (lineId: string, quantity: number) => {
        if (!cartId) return;
        const res = await fetch('/api/cart/update', {
            method: 'POST',
            body: JSON.stringify({
                cartId,
                lines: [{ id: lineId, quantity }],
                action: 'update',
            }),
        });
        const updatedCart = await res.json();
        setCart(updatedCart);
    };

    const removeCartItem = async (lineId: string) => {
        if (!cartId) return;
        const res = await fetch('/api/cart/update', {
            method: 'POST',
            body: JSON.stringify({
                cartId,
                lines: [{ id: lineId }],
                action: 'remove',
            }),
        });
        const updatedCart = await res.json();
        setCart(updatedCart);
    };

    const value = useMemo(
        () => ({
            cart,
            addCartItem,
            updateCartItem,
            removeCartItem,
        }),
        [cart, cartId]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}