"use client";

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
    quantity: number;
    onChange: (quantity: number) => void;
    max?: number;
    min?: number;
}

export default function QuantitySelector({
    quantity,
    onChange,
    max = 10,
    min = 1,
}: QuantitySelectorProps) {
    const decrement = () => {
        if (quantity > min) onChange(quantity - 1);
    };

    const increment = () => {
        if (quantity < max) onChange(quantity + 1);
    };

    return (
        <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest mr-3">
                Quantity
            </span>
            <button
                onClick={decrement}
                disabled={quantity <= min}
                className={cn(
                    "w-10 h-10 flex items-center justify-center border border-stone-200 rounded-sm transition-colors",
                    quantity <= min
                        ? "text-stone-300 cursor-not-allowed"
                        : "text-stone-700 hover:border-amber-400 hover:text-amber-700"
                )}
                aria-label="Decrease quantity"
            >
                <Minus size={14} />
            </button>
            <span className="w-12 h-10 flex items-center justify-center border-y border-stone-200 text-sm font-semibold text-stone-900 select-none">
                {quantity}
            </span>
            <button
                onClick={increment}
                disabled={quantity >= max}
                className={cn(
                    "w-10 h-10 flex items-center justify-center border border-stone-200 rounded-sm transition-colors",
                    quantity >= max
                        ? "text-stone-300 cursor-not-allowed"
                        : "text-stone-700 hover:border-amber-400 hover:text-amber-700"
                )}
                aria-label="Increase quantity"
            >
                <Plus size={14} />
            </button>
        </div>
    );
}
