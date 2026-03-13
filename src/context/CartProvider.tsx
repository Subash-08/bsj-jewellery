"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { Cart } from '@/types/shopify/cart';

type CartContextType = {
    cart: Cart | undefined;
    addCartItem: (variantId: string, quantity: number) => Promise<void>;
    updateCartItem: (lineId: string, quantity: number) => Promise<void>;
    removeCartItem: (lineId: string) => Promise<void>;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    itemCount: number;
    isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Cart | undefined>(undefined);
    const [cartId, setCartId] = useState<string | undefined>(undefined);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Initialize cart from local storage or create new
        const storedId = localStorage.getItem('cartId');
        if (storedId) {
            setCartId(storedId);
            fetchCart(storedId);
        }
    }, []);

    const fetchCart = async (id: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/cart?id=${id}`);
            if (res.ok) {
                const cartData = await res.json();
                setCart(cartData);
            } else {
                // If cart expired or not found, remove from storage
                localStorage.removeItem('cartId');
                setCartId(undefined);
                setCart(undefined);
            }
        } catch (e) {
            console.error('Failed to fetch cart:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const addCartItem = async (variantId: string, quantity: number) => {
        setIsLoading(true);
        try {
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
            toast.success("Added to cart", { id: "add-cart" });
        } catch (e) {
            console.error('Failed to add item', e);
            toast.error("Something went wrong adding to cart", { id: "error-cart-add" });
        } finally {
            setIsLoading(false);
        }
    };

    const updateCartItem = async (lineId: string, quantity: number) => {
        if (!cartId) return;
        setIsLoading(true);
        try {
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
            toast.success("Quantity updated", { id: "cart-qty-" + lineId });
        } catch (e) {
            console.error('Failed to update item', e);
            toast.error("Failed to update quantity", { id: "error-cart-qty" });
        } finally {
            setIsLoading(false);
        }
    };

    const removeCartItem = async (lineId: string) => {
        if (!cartId) return;
        setIsLoading(true);
        try {
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
            toast.info("Removed from cart", { id: "cart-remove-" + lineId });
        } catch (e) {
            console.error('Failed to remove item', e);
            toast.error("Failed to remove item", { id: "error-cart-remove" });
        } finally {
            setIsLoading(false);
        }
    };

    const itemCount = cart?.totalQuantity || 0;

    const value = useMemo(
        () => ({
            cart,
            addCartItem,
            updateCartItem,
            removeCartItem,
            isCartOpen,
            setIsCartOpen,
            itemCount,
            isLoading,
        }),
        [cart, cartId, isCartOpen, itemCount, isLoading]
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