'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { cn } from '@/components/ui/Badge'; // Using cn utility
import type { Filter } from '@/types/shopify/product';
import FilterGroup from './FilterGroup';
import PriceSlider from './PriceSlider';

interface SearchCollection {
    handle: string;
    title: string;
    count: number;
}

interface FilterSidebarProps {
    filters: Filter[];
    currentParams: Record<string, string | string[] | undefined>;
    collections?: SearchCollection[];
}

export default function FilterSidebar({ filters, currentParams, collections = [] }: FilterSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    // Close drawer on path or search param change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname, searchParams]);

    // Navigate to the collection page — collection scoping is not available in search API
    const updateCollection = useCallback((handle: string) => {
        router.push(`/collections/${handle}`);
    }, [router]);

    // Reconstruct URL with new or removed filter
    const updateFilter = useCallback(
        (key: string, value: string, action: 'add' | 'remove') => {
            const params = new URLSearchParams(searchParams.toString());

            // Delete pagination cursor when filters change
            params.delete('after');

            if (key === 'price') {
                if (action === 'add') {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }
            } else {
                const currentValues = params.getAll(key);
                // Next.js URLSearchParams `getAll` splits by native multiple params typically, 
                // but we might be storing as comma-separated `?metal=Gold,Silver` depending on implementation.
                // For this, we'll store them as separate params `?metal=Gold&metal=Silver`

                if (action === 'add') {
                    if (!currentValues.includes(value)) {
                        params.append(key, value);
                    }
                } else if (action === 'remove') {
                    params.delete(key);
                    // Add back all other values that weren't removed
                    currentValues.filter(v => v !== value).forEach(v => params.append(key, v));
                }
            }

            // Using push with scroll: false to prevent jumping to top on every filter click
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [pathname, router, searchParams]
    );

    const clearFilters = useCallback(() => {
        // Keep sort and query if present, clear the rest
        const params = new URLSearchParams(searchParams.toString());
        const sort = params.get('sort');
        const q = params.get('q');

        const newParams = new URLSearchParams();
        if (sort) newParams.set('sort', sort);
        if (q) newParams.set('q', q);

        router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    const activeFilterCount = Array.from(searchParams.keys()).filter(k => k !== 'sort' && k !== 'q' && k !== 'after').length;

    return (
        <>
            {/* Mobile Filter Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden w-full py-2.5 mb-4 bg-white border border-stone-200 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-amber-400 hover:text-amber-700"
            >
                <SlidersHorizontal className="w-4 h-4" />
                Filter Products
            </button>

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={cn(
                "filters bg-white p-5 rounded-xl md:border md:border-stone-200 shadow-sm",
                "self-start md:sticky md:top-[calc(var(--navbar-height,80px)+16px)] max-h-[calc(100vh-7rem)] overflow-y-auto",
                "fixed inset-y-0 left-0 z-40 w-80 h-full transform transition-transform duration-300 ease-in-out md:transform-none md:w-auto",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-stone-100">
                    <h2 className="font-serif text-lg text-stone-900">Filters</h2>
                    <div className="flex items-center gap-3">
                        {activeFilterCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-xs text-stone-400 hover:text-amber-600 underline underline-offset-2 transition-colors"
                            >
                                Clear all
                            </button>
                        )}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="md:hidden text-stone-400 hover:text-stone-900 focus:outline-none"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Collection navigation links */}
                    {collections && collections.length > 0 && (
                        <div className="filter-group">
                            <h3 className="text-[11px] uppercase tracking-widest font-semibold text-stone-400 mb-3">
                                Shop by Collection
                            </h3>
                            <ul className="space-y-1 max-h-64 overflow-y-auto pr-2">
                                {collections.map((coll) => (
                                    <li key={coll.handle}>
                                        <button
                                            onClick={() => updateCollection(coll.handle)}
                                            className="w-full flex items-center justify-between py-1.5 px-1 text-left rounded hover:bg-amber-50 group transition-colors"
                                        >
                                            <span className="text-sm text-stone-600 group-hover:text-amber-700">
                                                {coll.title}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-stone-400 font-medium bg-stone-100 px-2 py-0.5 rounded-full">
                                                    {coll.count}
                                                </span>
                                                <span className="text-stone-300 group-hover:text-amber-400 text-xs">→</span>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {filters.map((filter) => {
                        // Skip completely empty filters
                        if (filter.values.length === 0) return null;

                        if (filter.type === 'PRICE_RANGE') {
                            return (
                                <PriceSlider
                                    key={filter.id}
                                    filter={filter}
                                    currentParams={currentParams}
                                    updateFilter={updateFilter}
                                />
                            );
                        }

                        if (filter.type === 'LIST') {
                            // For Custom Metafields, the ID might look like "filter.p.m.custom.metal_type"
                            // Or just "filter.v.option.color"
                            // We need to parse a usable query param key from it or use the input string

                            // Extract paramKey from the first value's input JSON
                            let paramKey = filter.label.toLowerCase().replace(/\s+/g, '_');
                            if (filter.values[0]?.input) {
                                try {
                                    const inputObj = JSON.parse(filter.values[0].input);
                                    if (inputObj.available !== undefined) {
                                        paramKey = 'available';
                                    } else if (inputObj.productType) {
                                        paramKey = 'productType';
                                    } else if (inputObj.tag) {
                                        paramKey = 'tag';
                                    } else if (inputObj.productVendor) {
                                        paramKey = 'vendor';
                                    } else if (inputObj.variantOption?.name) {
                                        paramKey = `option_${inputObj.variantOption.name}`;
                                    } else if (inputObj.productMetafield?.key) {
                                        paramKey = inputObj.productMetafield.key;
                                    }
                                } catch {
                                    // Fallback to label-based key
                                }
                            }

                            // Determine currently active values for this specific param key
                            let activeValues: string[] = [];
                            if (currentParams[paramKey]) {
                                const val = currentParams[paramKey];
                                activeValues = Array.isArray(val) ? val : [val as string];
                            }

                            return (
                                <FilterGroup
                                    key={filter.id}
                                    paramKey={paramKey}
                                    filter={filter}
                                    activeValues={activeValues}
                                    updateFilter={updateFilter}
                                />
                            );
                        }

                        return null;
                    })}
                </div>
            </aside>
        </>
    );
}
