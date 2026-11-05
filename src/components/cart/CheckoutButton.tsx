"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartProvider';
import { cn } from '@/lib/utils';
import { Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

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
            // Fetch a fresh, server-validated Shopify checkout URL. Checkout
            // URLs can become stale and must not point back to the Next.js host.
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartId: cart.id }),
            });

            const data = await res.json();
            if (!res.ok || !data.checkoutUrl) {
                throw new Error(data.error || 'Unable to prepare checkout.');
            }

            window.location.assign(data.checkoutUrl);
        } catch (error) {
            console.error('Checkout preparation failed:', error);
            toast.error(error instanceof Error ? error.message : 'Unable to prepare checkout.');
            setIsSyncing(false);
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
