'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { X } from 'lucide-react';

export function ActiveFilterBar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const activeFilters: { key: string; value: string; displayLabel: string }[] = [];

    // Skip pagination, sort, and non-filter params
    searchParams.forEach((value, key) => {
        if (key === 'sort' || key === 'q' || key === 'after' || key === 'page') return;

        if (key === 'price') {
            // Format: "1000-5000" → "₹1,000 – ₹5,000"
            const [minStr, maxStr] = value.split('-');
            const min = Number(minStr);
            const max = Number(maxStr);
            let label = 'Price Filter';
            if (!isNaN(min) && min > 0 && !isNaN(max) && max > 0) {
                label = `₹${min.toLocaleString('en-IN')} – ₹${max.toLocaleString('en-IN')}`;
            } else if (!isNaN(min) && min > 0) {
                label = `Over ₹${min.toLocaleString('en-IN')}`;
            } else if (!isNaN(max) && max > 0) {
                label = `Under ₹${max.toLocaleString('en-IN')}`;
            }
            activeFilters.push({ key, value, displayLabel: label });
        } else {
            const values = value.split(',');
            values.forEach(v => {
                if (!v) return;

                let label = v;
                if (key === 'available') {
                    label = v === 'true' ? 'In Stock' : 'Out of Stock';
                } else if (key.startsWith('option_')) {
                    const optionName = key.slice('option_'.length);
                    label = `${optionName}: ${v}`;
                } else if (key === 'productType') {
                    label = v;
                } else if (key === 'tag') {
                    label = v;
                } else if (key === 'vendor') {
                    label = v;
                }

                activeFilters.push({ key, value: v, displayLabel: label });
            });
        }
    });

    if (activeFilters.length === 0) return null;

    const removeFilter = (filterKey: string, filterValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('after'); // Reset pagination

        if (filterKey === 'price') {
            params.delete('price');
        } else {
            const currentValues = params.getAll(filterKey);
            params.delete(filterKey);

            // If it was comma separated previously in some system, we add back the others
            // Given our current implementation, params.getAll catches discrete multiple params
            currentValues.filter(v => v !== filterValue).forEach(v => params.append(filterKey, v));
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const clearAll = () => {
        const params = new URLSearchParams(searchParams.toString());
        const sort = params.get('sort');
        const q = params.get('q');

        const newParams = new URLSearchParams();
        if (sort) newParams.set('sort', sort);
        if (q) newParams.set('q', q);

        router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    };

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-gray-50 border border-gray-100 rounded-lg">
            <span className="text-sm text-gray-500 font-medium mr-2">Active Filters:</span>
            {activeFilters.map((filter, i) => (
                <button
                    key={`${filter.key}-${filter.value}-${i}`}
                    onClick={() => removeFilter(filter.key, filter.value)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-sm text-gray-700 rounded-full hover:bg-gray-100 transition shadow-sm group"
                >
                    {filter.displayLabel}
                    <X className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900" />
                </button>
            ))}
            {activeFilters.length > 1 && (
                <button
                    onClick={clearAll}
                    className="ml-auto text-sm text-rose-600 hover:text-rose-700 underline underline-offset-2 font-medium"
                >
                    Clear All
                </button>
            )}
        </div>
    );
}
