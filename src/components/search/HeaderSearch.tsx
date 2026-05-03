'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useShopifySearch } from '@/hooks/useShopifySearch';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import SearchDropdown from './SearchDropdown';

interface HeaderSearchProps {
    variant?: 'desktop' | 'mobile';
    onClose?: () => void;
}

export default function HeaderSearch({ variant = 'desktop', onClose }: HeaderSearchProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { results, loading, error, handleSearch, clearResults } = useShopifySearch();
    const { searches: recentSearches, addSearch, clearSearches } = useRecentSearches();

    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const hasQuery = query.trim().length >= 2;

    const totalItems = hasQuery
        ? results.queries.length + results.products.length + results.collections.length
        : recentSearches.length + TRENDING_SEARCHES.length;

    useEffect(() => {
        setIsOpen(false);
        setQuery('');
        clearResults();
    }, [pathname, clearResults]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navigateToSearch = useCallback((searchTerm: string) => {
        const trimmed = searchTerm.trim();
        if (!trimmed) return;

        addSearch(trimmed);
        setIsOpen(false);
        setQuery('');
        clearResults();

        let targetUrl = `/search?q=${encodeURIComponent(trimmed)}`;

        if (pathname?.startsWith('/collections/') && pathname !== '/collections/all') {
            const handle = pathname.replace('/collections/', '');
            targetUrl += `&collection=${encodeURIComponent(handle)}`;
        }

        router.push(targetUrl);
        onClose?.();
    }, [router, clearResults, onClose, addSearch, pathname]);

    const handleInputChange = (value: string) => {
        const capped = value.slice(0, 100);
        setQuery(capped);
        setHighlightedIndex(-1);

        if (capped.trim().length >= 2) {
            setIsOpen(true);
            handleSearch(capped);
        } else {
            clearResults();

            if (document.activeElement === inputRef.current) {
                setIsOpen(true);
            }
        }
    };

    const handleFocus = () => {
        setIsOpen(true);
        if (query.trim().length >= 2) {
            handleSearch(query);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();

            if (highlightedIndex >= 0 && highlightedIndex < totalItems) {
                const el = containerRef.current?.querySelector(
                    `[data-search-index="${highlightedIndex}"]`
                ) as HTMLElement;

                el?.click();
            } else {
                navigateToSearch(query);
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => prev < totalItems - 1 ? prev + 1 : 0);
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => prev > 0 ? prev - 1 : totalItems - 1);
            return;
        }
    };

    const handleSelectQuery = (text: string) => {
        navigateToSearch(text);
    };

    const handleClear = () => {
        setQuery('');
        clearResults();
        setIsOpen(false);
        inputRef.current?.focus();
    };

    /* ================= MOBILE ================= */

    if (variant === 'mobile') {
        return (
            <div ref={containerRef} className="relative w-full">

                <div className="flex items-center bg-[#faf8f4] border border-[#e8e3d9] rounded-full px-4 h-9 transition-all
                focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100">

                    <Search size={18} className="text-gray-400 shrink-0" />

                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => handleInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        placeholder="Search jewellery..."
                        className="flex-1 bg-transparent text-sm px-3 outline-none text-white placeholder:text-gray-400"
                        maxLength={100}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                    />

                    {query && (
                        <button
                            onClick={handleClear}
                            className="p-1 text-gray-400 hover:text-amber-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {isOpen && (
                    <SearchDropdown
                        results={results}
                        loading={loading}
                        error={error}
                        query={query}
                        highlightedIndex={highlightedIndex}
                        onSelectQuery={handleSelectQuery}
                        recentSearches={recentSearches}
                        onClearRecent={clearSearches}
                    />
                )}
            </div>
        );
    }

    /* ================= DESKTOP ================= */

    return (
        <div ref={containerRef} className="relative flex-1 max-w-xl">

            <div className="flex w-full items-center bg-[#faf8f4] border border-[#e8e3d9] rounded-lg
            shadow-sm transition-all
            focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100">

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder="Search Rings, Necklaces, Bracelets..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-5 h-9
                    text-gray-700 placeholder:text-gray-400 outline-none"
                    maxLength={100}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                />

                {query && (
                    <button
                        onClick={handleClear}
                        className="px-3 h-9 text-gray-400 hover:text-amber-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                )}

                <button
                    onClick={() => navigateToSearch(query)}
                    className="px-5 bg-[#51395d] rounded-lg h-9 text-white hover:text-amber-600 transition-colors"
                >
                    <Search size={20} />
                </button>
            </div>

            {isOpen && (
                <SearchDropdown
                    results={results}
                    loading={loading}
                    error={error}
                    query={query}
                    highlightedIndex={highlightedIndex}
                    onSelectQuery={handleSelectQuery}
                    recentSearches={recentSearches}
                    onClearRecent={clearSearches}
                />
            )}
        </div>
    );
}

const TRENDING_SEARCHES = [
    'Diamond Ring',
    'Gold Chain',
    'Silver Bracelet',
    'Temple Jewellery',
    'Bridal Necklace'
];