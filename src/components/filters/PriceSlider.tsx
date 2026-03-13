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
            <h3 className="font-semibold text-gray-900 mb-3">{filter.label}</h3>
            
            <div className="flex items-center space-x-2">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <input 
                        type="number" 
                        placeholder="Min" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
                    />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <input 
                        type="number" 
                        placeholder="Max" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
                    />
                </div>
            </div>
            
            <button 
                onClick={handleApply}
                className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium py-1.5 rounded transition"
            >
                Apply Price
            </button>
        </div>
    );
}
