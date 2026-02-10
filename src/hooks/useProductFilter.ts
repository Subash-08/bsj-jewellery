"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export function useProductFilter() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === null) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return {
        filters: {
            sort: searchParams.get('sort'),
            minPrice: searchParams.get('minPrice'),
            maxPrice: searchParams.get('maxPrice'),
        },
        updateFilter,
    };
}