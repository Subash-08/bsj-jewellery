'use client';

import type { Filter } from '@/types/shopify/product';
import { useState, useEffect } from 'react';

interface PriceSliderProps {
    filter: Filter;
    currentParams: { [key: string]: string | string[] | undefined };
    updateFilter: (key: string, value: string, action: 'add' | 'remove') => void;
}

export default function PriceSlider({ filter, currentParams, updateFilter }: PriceSliderProps) {
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');

    // Sync input state with URL parameters
    useEffect(() => {
        const priceParam = currentParams['price'];
        if (priceParam) {
            const priceStr = Array.isArray(priceParam) ? priceParam[0] : priceParam;
            if (priceStr) {
                const [min, max] = priceStr.split('-');
                setMinPrice(min || '');
                setMaxPrice(max || '');
            }
        } else {
            setMinPrice('');
            setMaxPrice('');
        }
    }, [currentParams]);

    const handleApply = () => {
        if (!minPrice && !maxPrice) {
            updateFilter('price', '', 'remove');
            return;
        }

        const min = minPrice ? Math.max(0, Number(minPrice)) : 0;
        const max = maxPrice ? Math.max(min, Number(maxPrice)) : '';
        
        const priceString = `${min}-${max}`;
        updateFilter('price', priceString, 'add');
    };

    return (
        <div className="filter-group block">
            <h3 className="text-[11px] uppercase tracking-widest font-semibold text-stone-400 mb-3">{filter.label}</h3>

            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">₹</span>
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full pl-6 pr-2 py-2 text-sm border border-stone-200 rounded-md focus:border-amber-500 focus:outline-none transition-colors"
                    />
                </div>
                <span className="text-stone-300 text-xs">—</span>
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">₹</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full pl-6 pr-2 py-2 text-sm border border-stone-200 rounded-md focus:border-amber-500 focus:outline-none transition-colors"
                    />
                </div>
            </div>

            <button
                onClick={handleApply}
                className="mt-3 w-full bg-amber-600 hover:bg-amber-700 text-white text-xs uppercase tracking-widest font-semibold py-2 rounded-md transition-colors"
            >
                Apply
            </button>
        </div>
    );
}
