'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

const SORT_OPTIONS = [
    { label: 'Relevance', value: '' }, // Empty will fallback to default collection sort
    { label: 'Best Selling', value: 'best-selling' },
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
];

export function SortDropdown() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSort = searchParams.get('sort') || '';

    const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        
        // Changing sort resets pagination
        params.delete('after');

        if (val) {
            params.set('sort', val);
        } else {
            params.delete('sort');
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    return (
        <div className="flex items-center space-x-2">
            <label htmlFor="sort-by" className="text-xs text-stone-400 uppercase tracking-widest font-semibold hidden sm:block">Sort:</label>
            <div className="relative">
                <select
                    id="sort-by"
                    value={currentSort}
                    onChange={handleSortChange}
                    className="appearance-none bg-white border border-stone-200 text-stone-700 py-2 pl-3 pr-8 rounded-md text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 hover:border-amber-300 transition"
                >
                    {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}
