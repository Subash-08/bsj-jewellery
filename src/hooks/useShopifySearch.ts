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
    const abortControllerRef = useRef<AbortController | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const performSearch = useCallback(async (query: string) => {
        // Cancel any in-flight request to prevent race conditions
        if (abortControllerRef.current) {
            abortControllerRef.current.abort('New search started');
        }

        // Validation
        const trimmed = query.trim();
        if (!trimmed || trimmed.length < 2) {
            setResults(EMPTY_RESULTS);
            setError(null);
            setLoading(false);
            return;
        }

        // Limit query length
        const sanitized = trimmed.slice(0, 100);

        setLoading(true);
        setError(null);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            const res = await fetch(
                `/api/search/predictive?q=${encodeURIComponent(sanitized)}`,
                { signal: controller.signal }
            );

            if (!res.ok) {
                throw new Error('Search unavailable');
            }

            const data = await res.json();

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
            // Handle various forms of AbortError thrown by different fetch implementations
            const isAbort = 
                (err?.name === 'AbortError') ||
                (err instanceof DOMException && err.name === 'AbortError') ||
                (typeof err === 'string' && ['New search started', 'Search cleared or user navigated', 'Component unmounted'].includes(err)) ||
                (err instanceof Error && ['New search started', 'Search cleared or user navigated', 'Component unmounted'].includes(err.message)) ||
                (err?.cause && typeof err.cause === 'string' && ['New search started', 'Search cleared or user navigated', 'Component unmounted'].includes(err.cause)) ||
                // Next.js specific wrapper format
                (err?.message && (err.message.includes('New search started') || err.message.includes('Search cleared or user navigated') || err.message.includes('Component unmounted')));

            if (isAbort) {
                return;
            }

            console.error('Predictive search error:', err);
            setError(err instanceof Error ? err.message : 'Search failed');
            setResults(EMPTY_RESULTS);
        } finally {
            // Only clear loading if this controller is still the active one
            if (abortControllerRef.current === controller) {
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
        if (abortControllerRef.current) {
            abortControllerRef.current.abort('Search cleared or user navigated');
        }
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
            if (abortControllerRef.current) {
                abortControllerRef.current.abort('Component unmounted');
            }
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