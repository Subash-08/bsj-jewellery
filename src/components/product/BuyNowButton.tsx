"use client";

import { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BuyNowButtonProps {
    variantId: string | undefined;
    quantity: number;
    availableForSale: boolean;
}

export default function BuyNowButton({ variantId, quantity, availableForSale }: BuyNowButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleBuyNow = async () => {
        if (!variantId) {
            toast.error('Please select a variant first.');
            return;
        }

        setIsLoading(true);

        try {
            // Call our API route which handles cart creation + buyer identity server-side
            const res = await fetch('/api/checkout/buy-now', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ variantId, quantity }),
            });

            const data = await res.json();

            if (!res.ok || !data.checkoutUrl) {
                throw new Error(data.error || 'Failed to create checkout');
            }

            // Redirect to Shopify checkout — this does NOT touch localStorage cartId
            window.location.href = data.checkoutUrl;
        } catch (error) {
            console.error('Buy Now error:', error);
            toast.error('Unable to process. Please try again.');
            setIsLoading(false);
        }
    };

    const disabled = !availableForSale || !variantId || isLoading;

    if (!availableForSale) {
        return (
            <button
                disabled
                className="w-full py-4 border-2 border-stone-200 text-stone-300 text-sm uppercase tracking-[0.2em] font-bold rounded-sm cursor-not-allowed"
            >
                Unavailable
            </button>
        );
    }

    return (
        <button
            onClick={handleBuyNow}
            disabled={disabled}
            className={cn(
                "w-full py-4 border-2 border-amber-700 text-amber-700 text-sm uppercase tracking-[0.2em] font-bold hover:bg-amber-700 hover:text-white transition-all duration-300 rounded-sm flex items-center justify-center gap-2",
                disabled && "opacity-60 cursor-not-allowed hover:bg-transparent hover:text-amber-700"
            )}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                </>
            ) : (
                <>
                    <Zap size={16} />
                    Buy Now
                </>
            )}
        </button>
    );
}
