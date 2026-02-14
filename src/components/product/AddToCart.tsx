"use client";

import { useState, useTransition } from 'react';
import { useCart } from '@/context/CartProvider'; // Adjust the import path as needed
import { cn } from '@/lib/utils';

const ShoppingBag = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
);

const Loader2 = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

interface AddToCartProps {
    availableForSale: boolean;
    variantId?: string;
}

export default function AddToCart({ availableForSale, variantId }: AddToCartProps) {
    const [isPending, startTransition] = useTransition();
    const { addCartItem, isLoading, setIsCartOpen } = useCart();

    const handleAddToCart = () => {
        if (!availableForSale || !variantId) return;

        startTransition(async () => {
            try {
                await addCartItem(variantId, 1);
                console.log("Successfully added to cart:", variantId);
                setIsCartOpen(true); // Open cart drawer after adding
            } catch (error) {
                console.error("Failed to add to cart:", error);
                alert("Failed to add item to cart. Please try again.");
            }
        });
    };

    const isDisabled = !availableForSale || !variantId || isPending || isLoading;

    if (!availableForSale) {
        return (
            <button
                disabled
                className="w-full py-4 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed font-medium text-lg"
            >
                Out of Stock
            </button>
        );
    }

    return (
        <button
            onClick={handleAddToCart}
            disabled={isDisabled}
            className={cn(
                "w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium text-lg shadow-lg hover:shadow-xl active:scale-[0.98]",
                isDisabled && "opacity-80 cursor-not-allowed"
            )}
        >
            {isPending || isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <ShoppingBag className="w-5 h-5" />
            )}
            {isPending || isLoading ? 'Adding...' : 'Add to Cart'}
        </button>
    );
}