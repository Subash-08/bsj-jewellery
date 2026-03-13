"use client";

import { useTransition } from 'react';
import { useCart } from '@/context/CartProvider';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface CheckoutButtonProps {
    className?: string;
}

export function CheckoutButton({ className }: CheckoutButtonProps) {
    const { cart, isLoading, itemCount } = useCart();
    const [isPending, startTransition] = useTransition();

    const handleCheckout = () => {
        if (!cart?.checkoutUrl) return;
        
        startTransition(() => {
            // Shopify Hosted Checkout Redirect
            window.location.href = cart.checkoutUrl;
        });
    };

    const disabled = isLoading || isPending || itemCount === 0 || !cart?.checkoutUrl;

    return (
        <button
            onClick={handleCheckout}
            disabled={disabled}
            className={cn(
                "w-full py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-all duration-200 font-semibold text-sm shadow-md flex items-center justify-center gap-2",
                disabled ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg transform hover:-translate-y-0.5",
                className
            )}
        >
            {isPending ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirecting to Secure Checkout...
                </>
            ) : (
                'Secure Checkout'
            )}
        </button>
    );
}
