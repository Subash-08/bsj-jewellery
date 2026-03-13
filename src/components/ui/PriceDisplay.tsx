'use client';

import { usePriceFormatter } from '@/hooks/usePriceFormatter';
import { cn } from './Badge'; // using the cn utility from Badge temporarily, or create a lib/utils.ts

interface PriceDisplayProps {
    minPrice: string;
    maxPrice?: string;
    compareAtPriceMin?: string;
    currencyCode: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function PriceDisplay({ 
    minPrice, 
    maxPrice, 
    compareAtPriceMin, 
    currencyCode, 
    className,
    size = 'md' 
}: PriceDisplayProps) {
    const { format } = usePriceFormatter(currencyCode);
    
    const isVariablePrice = maxPrice && minPrice !== maxPrice;
    const hasDiscount = compareAtPriceMin && Number(compareAtPriceMin) > Number(minPrice);
    
    // Calculate discount percentage
    let discountPercentage = 0;
    if (hasDiscount) {
        discountPercentage = Math.round(
            ((Number(compareAtPriceMin) - Number(minPrice)) / Number(compareAtPriceMin)) * 100
        );
    }

    const sizeClasses = {
        sm: { current: 'text-sm font-semibold', original: 'text-xs', badge: 'text-[10px] px-1.5 py-0.5' },
        md: { current: 'text-lg font-bold', original: 'text-sm', badge: 'text-xs px-2 py-0.5' },
        lg: { current: 'text-2xl md:text-3xl font-bold', original: 'text-base', badge: 'text-sm px-2.5 py-1' }
    };

    return (
        <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
            <span className={cn("text-gray-900", sizeClasses[size].current)}>
                {format(minPrice)}
                {isVariablePrice && ` - ${format(maxPrice)}`}
            </span>
            
            {!isVariablePrice && hasDiscount && (
                <>
                    <span className={cn("text-gray-400 line-through decoration-gray-300", sizeClasses[size].original)}>
                        {format(compareAtPriceMin)}
                    </span>
                    <span className={cn("text-rose-600 bg-rose-50 font-medium rounded block", sizeClasses[size].badge)}>
                        {discountPercentage}% OFF
                    </span>
                </>
            )}
        </div>
    );
}
