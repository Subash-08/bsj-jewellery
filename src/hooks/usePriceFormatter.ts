"use client";

import { useMemo } from 'react';

export function usePriceFormatter(currencyCode: string = 'USD') {
    const formatter = useMemo(() => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currencyCode,
        });
    }, [currencyCode]);

    const format = (amount: string | number) => {
        const val = typeof amount === 'string' ? parseFloat(amount) : amount;
        return formatter.format(val);
    };

    return { format };
}