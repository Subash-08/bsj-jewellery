"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function useVariantSelection() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const setOption = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(name.toLowerCase(), value);

        // In strict mode, we might validate against available options here

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return {
        searchParams,
        setOption,
    };
}