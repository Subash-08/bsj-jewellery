"use client";

import { useState, useRef, useCallback, useEffect } from 'react';

export interface PredictiveSearchResults {
    products: Array<{
        id: string;
        title: string;
        handle: string;
        availableForSale: boolean;
        featuredImage: { url: string; altText: string | null } | null;
        priceRange: {
            minVariantPrice: { amount: string; currencyCode: string };
        };
    }>;
    collections: Array<{
        id: string;
        title: string;
        handle: string;
    }>;
    queries: Array<{
        text: string;
        styledText: string;
    }>;
}

const EMPTY_RESULTS: PredictiveSearchResults = { products: [], collections: [], queries: [] };

export function useShopifySearch() {
    const [results, setResults] = useState<PredictiveSearchResults>(EMPTY_RESULTS);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const currentSearchId = useRef<number>(0);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const performSearch = useCallback(async (query: string) => {
        const searchId = ++currentSearchId.current;

        // Validation
        const trimmed = query.trim();
        if (!trimmed || trimmed.length < 2) {
            if (currentSearchId.current === searchId) {
                setResults(EMPTY_RESULTS);
                setError(null);
                setLoading(false);
            }
            return;
        }

        // Limit query length
        const sanitized = trimmed.slice(0, 100);

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `/api/search/predictive?q=${encodeURIComponent(sanitized)}`
            );

            if (currentSearchId.current !== searchId) return;

            if (!res.ok) {
                throw new Error('Search unavailable');
            }

            const data = await res.json();

            if (currentSearchId.current !== searchId) return;

            if (data.error) {
                throw new Error(data.error);
            }

            const newData = {
                products: data.products || [],
                collections: data.collections || [],
                queries: data.queries || [],
            };

            setResults(newData);
        } catch (err: any) {
            if (currentSearchId.current !== searchId) return;

            console.error('Predictive search error:', err);
            setError(err instanceof Error ? err.message : 'Search failed');
            setResults(EMPTY_RESULTS);
        } finally {
            if (currentSearchId.current === searchId) {
                setLoading(false);
            }
        }
    }, []);

    const handleSearch = useCallback((query: string) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        
        // Fast clear if empty
        if (!query.trim()) {
            performSearch('');
            return;
        }

        debounceRef.current = setTimeout(() => {
            performSearch(query);
        }, 300); // 300ms debounce
    }, [performSearch]);

    const clearResults = useCallback(() => {
        currentSearchId.current++; // invalidates any in-flight search
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        setResults(EMPTY_RESULTS);
        setError(null);
        setLoading(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            currentSearchId.current++;
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    return {
        results,
        loading,
        error,
        handleSearch,
        clearResults,
    };
}