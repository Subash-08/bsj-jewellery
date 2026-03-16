"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartProvider';
import { cn } from '@/lib/utils';
import { Loader2, Lock } from 'lucide-react';

interface CheckoutButtonProps {
    className?: string;
}

export function CheckoutButton({ className }: CheckoutButtonProps) {
    const { cart, isLoading, itemCount } = useCart();
    const [isSyncing, setIsSyncing] = useState(false);

    const handleCheckout = async () => {
        if (!cart?.checkoutUrl || !cart?.id) return;

        setIsSyncing(true);

        try {
            // Sync buyer identity before redirect so Shopify checkout
            // recognizes the customer (pre-fills email, shows saved addresses)
            const res = await fetch('/api/cart/sync-identity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartId: cart.id }),
            });

            const data = await res.json();

            // Use the updated checkout URL if sync succeeded, otherwise use the original
            const checkoutUrl = data.checkoutUrl || cart.checkoutUrl;
            window.location.href = checkoutUrl;
        } catch (error) {
            // If sync fails, still redirect — don't block checkout
            console.warn('Identity sync failed, proceeding with checkout:', error);
            window.location.href = cart.checkoutUrl;
        }
    };

    const disabled = isLoading || isSyncing || itemCount === 0 || !cart?.checkoutUrl;

    return (
        <button
            onClick={handleCheckout}
            disabled={disabled}
            className={cn(
                "w-full py-3.5 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all duration-200",
                disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-stone-800 hover:shadow-lg",
                className
            )}
        >
            {isSyncing ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Preparing Checkout...
                </>
            ) : (
                <>
                    <Lock size={14} />
                    Secure Checkout
                </>
            )}
        </button>
    );
}
