'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, Loader2, ArrowRight, Clock, TrendingUp, X } from 'lucide-react';
import type { PredictiveSearchResults } from '@/hooks/useShopifySearch';

const TRENDING_SEARCHES = ['Diamond Ring', 'Gold Chain', 'Silver Bracelet', 'Temple Jewellery', 'Bridal Necklace'];

interface SearchDropdownProps {
    results: PredictiveSearchResults;
    loading: boolean;
    error: string | null;
    query: string;
    highlightedIndex: number;
    onSelectQuery: (query: string) => void;
    recentSearches: string[];
    onClearRecent: () => void;
}

/** Highlight matching text in a string */
function HighlightText({ text, query }: { text: string; query: string }) {
    if (!query || query.length < 2) return <>{text}</>;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark key={i} className="bg-rose-100 text-rose-700 rounded-sm px-0.5">{part}</mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
}

export default function SearchDropdown({
    results,
    loading,
    error,
    query,
    highlightedIndex,
    onSelectQuery,
    recentSearches,
    onClearRecent,
}: SearchDropdownProps) {
    const { products, collections, queries } = results;
    const hasResults = products.length > 0 || collections.length > 0 || queries.length > 0;
    const isActiveSearch = query.trim().length >= 2;

    // LOADING STATE
    if (loading && isActiveSearch) {
        return (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-xl z-[100] p-8 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-rose-500" />
                <span className="ml-2 text-sm text-stone-500">Searching...</span>
            </div>
        );
    }

    // ERROR STATE
    if (error && isActiveSearch) {
        return (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-xl z-[100] p-6 text-center">
                <p className="text-sm text-stone-500">{error}</p>
            </div>
        );
    }

    // NO RESULTS STATE — with recovery suggestions
    if (!hasResults && isActiveSearch) {
        return (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-xl z-[100] p-6">
                <p className="text-sm text-stone-500 text-center mb-4">
                    No results found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-stone-400 text-center mb-3">Try searching for:</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {TRENDING_SEARCHES.slice(0, 4).map(term => (
                        <button
                            key={term}
                            onClick={() => onSelectQuery(term)}
                            className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-full text-xs hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                            {term}
                        </button>
                    ))}
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100">
                    <Link
                        href={`/search?q=${encodeURIComponent(query)}`}
                        className="flex items-center justify-center gap-1 text-sm text-rose-600 hover:text-rose-700 font-medium"
                    >
                        Search all products <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        );
    }

    // IDLE STATE — show recent & trending searches
    if (!isActiveSearch) {
        const hasRecent = recentSearches.length > 0;
        if (!hasRecent && TRENDING_SEARCHES.length === 0) return null;

        let flatIndex = 0;

        return (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-xl z-[100] max-h-[70vh] overflow-y-auto overscroll-contain">
                {/* Recent Searches */}
                {hasRecent && (
                    <div className="px-4 pt-3 pb-2">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Recent
                            </p>
                            <button
                                onClick={onClearRecent}
                                className="text-[10px] text-stone-400 hover:text-rose-500 transition-colors flex items-center gap-0.5"
                            >
                                Clear <X className="w-2.5 h-2.5" />
                            </button>
                        </div>
                        {recentSearches.map(term => {
                            const idx = flatIndex++;
                            return (
                                <button
                                    key={term}
                                    data-search-index={idx}
                                    onClick={() => onSelectQuery(term)}
                                    className={`w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                                        highlightedIndex === idx
                                            ? 'bg-rose-50 text-rose-700'
                                            : 'text-stone-600 hover:bg-stone-50'
                                    }`}
                                >
                                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                    <span>{term}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Trending Searches */}
                <div className={`px-4 pt-3 pb-3 ${hasRecent ? 'border-t border-stone-100' : ''}`}>
                    <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Trending
                    </p>
                    {TRENDING_SEARCHES.map(term => {
                        const idx = flatIndex++;
                        return (
                            <button
                                key={term}
                                data-search-index={idx}
                                onClick={() => onSelectQuery(term)}
                                className={`w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                                    highlightedIndex === idx
                                        ? 'bg-rose-50 text-rose-700'
                                        : 'text-stone-600 hover:bg-stone-50'
                                }`}
                            >
                                <TrendingUp className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                <span>{term}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // RESULTS STATE
    if (!hasResults) return null;

    let flatIndex = 0;

    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-xl z-[100] max-h-[70vh] overflow-y-auto overscroll-contain">
            {/* Products (Prioritized first) */}
            {products.length > 0 && (
                <div className="px-4 pt-3 pb-2">
                    <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-2">Products</p>
                    <div className="space-y-1">
                        {products.map((product) => {
                            const idx = flatIndex++;
                            return (
                                <Link
                                    key={product.id}
                                    href={`/search?q=${encodeURIComponent(product.title)}`}
                                    data-search-index={idx}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                                        highlightedIndex === idx
                                            ? 'bg-rose-50'
                                            : 'hover:bg-stone-50'
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded bg-stone-100 overflow-hidden shrink-0 relative">
                                        {product.featuredImage ? (
                                            <Image
                                                src={product.featuredImage.url}
                                                alt={product.featuredImage.altText || product.title}
                                                fill
                                                sizes="40px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[8px] text-stone-400">
                                                No img
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-stone-800 truncate">
                                            <HighlightText text={product.title} query={query} />
                                        </p>
                                        <p className="text-xs text-rose-600 font-medium">
                                            ₹{Number(product.priceRange.minVariantPrice.amount).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Collections */}
            {collections.length > 0 && (
                <div className={`px-4 pt-3 pb-2 ${products.length > 0 ? 'border-t border-stone-100' : ''}`}>
                    <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-2">Collections</p>
                    {collections.map((collection) => {
                        const idx = flatIndex++;
                        return (
                            <Link
                                key={collection.id}
                                href={`/collections/${collection.handle}`}
                                data-search-index={idx}
                                className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                                    highlightedIndex === idx
                                        ? 'bg-rose-50 text-rose-700'
                                        : 'text-stone-600 hover:bg-stone-50'
                                }`}
                            >
                                <HighlightText text={collection.title} query={query} />
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Suggested Queries */}
            {queries.length > 0 && (
                <div className={`px-4 pt-3 pb-2 ${(products.length > 0 || collections.length > 0) ? 'border-t border-stone-100' : ''}`}>
                    <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-2">Suggestions</p>
                    {queries.map((q) => {
                        const idx = flatIndex++;
                        return (
                            <button
                                key={q.text}
                                data-search-index={idx}
                                onClick={() => onSelectQuery(q.text)}
                                className={`w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                                    highlightedIndex === idx
                                        ? 'bg-rose-50 text-rose-700'
                                        : 'text-stone-600 hover:bg-stone-50'
                                }`}
                            >
                                <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                <span><HighlightText text={q.text} query={query} /></span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* View All Results */}
            <div className="p-3 border-t border-stone-100">
                <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-stone-900 text-white text-sm font-medium rounded-md hover:bg-stone-800 transition-colors"
                >
                    View all results for &ldquo;{query}&rdquo;
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
