'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { cn } from '@/components/ui/Badge';

interface SearchCollection {
    id: string;
    title: string;
    count: number;
}

interface SearchFilterSidebarProps {
    collections: SearchCollection[];
    currentParams: { [key: string]: string | string[] | undefined };
    activeCollectionId?: string;
}

export default function SearchFilterSidebar({
    collections,
    currentParams,
    activeCollectionId,
}: SearchFilterSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname, searchParams]);

    const updateCollection = useCallback((id: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('after'); // reset pagination

        if (id) {
            params.set('collection', id);
        } else {
            params.delete('collection');
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    const clearFilters = useCallback(() => {
        const params = new URLSearchParams();
        const q = searchParams.get('q');
        const sort = searchParams.get('sort');
        if (q) params.set('q', q);
        if (sort) params.set('sort', sort);

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    if (collections.length === 0) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden w-full py-3 mb-4 bg-white border border-gray-200 rounded-lg flex items-center justify-center gap-2 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
                <SlidersHorizontal className="w-5 h-5" />
                Filter Results
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={cn(
                "filters bg-white p-6 rounded-lg md:border md:border-gray-100 shadow-sm",
                "self-start md:sticky md:top-24 max-h-[calc(100vh-6rem)] overflow-y-auto",
                "fixed inset-y-0 left-0 z-50 w-80 h-full transform transition-transform duration-300 ease-in-out md:transform-none md:w-auto",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <h2 className="text-xl font-serif text-gray-900">Filters</h2>
                    <div className="flex items-center gap-3">
                        {activeCollectionId && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-500 hover:text-rose-600 underline underline-offset-2"
                            >
                                Clear
                            </button>
                        )}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="md:hidden text-gray-400 hover:text-gray-900 focus:outline-none"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="filter-group">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Collection
                        </h3>
                        <ul className="space-y-2.5 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            <li>
                                <label className="flex items-center group cursor-pointer">
                                    <div className={cn(
                                        "w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors",
                                        !activeCollectionId
                                            ? "bg-rose-600 border-rose-600"
                                            : "border-gray-300 group-hover:border-rose-400 bg-white"
                                    )}>
                                        {!activeCollectionId && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                                    </div>
                                    <span className={cn(
                                        "text-sm flex-1",
                                        !activeCollectionId ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-gray-900"
                                    )}>
                                        All Categories
                                    </span>
                                </label>
                                {/* Invisible radio button to make label clickable */}
                                <input
                                    type="radio"
                                    name="collection"
                                    className="hidden"
                                    checked={!activeCollectionId}
                                    onChange={() => updateCollection(null)}
                                />
                            </li>
                            {collections.map((coll) => {
                                const isActive = activeCollectionId === coll.id;
                                return (
                                    <li key={coll.id}>
                                        <label className="flex items-center group cursor-pointer">
                                            <div className={cn(
                                                "w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors",
                                                isActive
                                                    ? "bg-rose-600 border-rose-600"
                                                    : "border-gray-300 group-hover:border-rose-400 bg-white"
                                            )}>
                                                {isActive && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                                            </div>
                                            <span className={cn(
                                                "text-sm flex-1",
                                                isActive ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-gray-900"
                                            )}>
                                                {coll.title}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full ml-2">
                                                {coll.count}
                                            </span>
                                        </label>
                                        <input
                                            type="radio"
                                            name="collection"
                                            className="hidden"
                                            checked={isActive}
                                            onChange={() => updateCollection(coll.id)}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </aside>
        </>
    );
}
