"use client";

import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/context/CartProvider';
import { cn } from '@/lib/utils';

interface StickyBuyBarProps {
    price: string;
    variantId: string | undefined;
    quantity: number;
    availableForSale: boolean;
    addToCartRef: React.RefObject<HTMLDivElement | null>;
}

export default function StickyBuyBar({
    price,
    variantId,
    quantity,
    availableForSale,
    addToCartRef,
}: StickyBuyBarProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const { addCartItem, isLoading: isAddingToCart, setIsCartOpen } = useCart();

    useEffect(() => {
        if (!addToCartRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(!entry.isIntersecting);
            },
            { threshold: 0 }
        );

        observer.observe(addToCartRef.current);
        return () => observer.disconnect();
    }, [addToCartRef]);

    const handleAddToCart = async () => {
        if (!variantId || !availableForSale) return;
        try {
            await addCartItem(variantId, quantity);
            setIsCartOpen(true);
        } catch {
            toast.error('Failed to add to cart');
        }
    };

    const handleBuyNow = async () => {
        if (!variantId) {
            toast.error('Please select a variant first.');
            return;
        }
        setIsBuyingNow(true);
        try {
            const res = await fetch('/api/checkout/buy-now', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ variantId, quantity }),
            });
            const data = await res.json();
            if (!res.ok || !data.checkoutUrl) {
                throw new Error(data.error || 'Checkout creation failed');
            }
            window.location.href = data.checkoutUrl;
        } catch {
            toast.error('Unable to process. Please try again.');
            setIsBuyingNow(false);
        }
    };

    const disabled = !availableForSale || !variantId;

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-lg px-4 py-3 z-40 lg:hidden transition-transform duration-300",
                isVisible ? "translate-y-0" : "translate-y-full"
            )}
        >
            <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
                <div className="shrink-0">
                    <p className="font-serif text-lg font-bold text-stone-900">{price}</p>
                </div>
                <div className="flex gap-2 flex-1">
                    <button
                        onClick={handleAddToCart}
                        disabled={disabled || isAddingToCart}
                        className={cn(
                            "flex-1 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 rounded-sm transition-all",
                            (disabled || isAddingToCart) && "opacity-60 cursor-not-allowed"
                        )}
                    >
                        {isAddingToCart ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <ShoppingBag size={14} />
                        )}
                        Add
                    </button>
                    <button
                        onClick={handleBuyNow}
                        disabled={disabled || isBuyingNow}
                        className={cn(
                            "flex-1 py-3 border-2 border-amber-700 text-amber-700 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 rounded-sm transition-all",
                            (disabled || isBuyingNow) && "opacity-60 cursor-not-allowed"
                        )}
                    >
                        {isBuyingNow ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Zap size={14} />
                        )}
                        Buy
                    </button>
                </div>
            </div>
        </div>
    );
}
