'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/components/ui/Badge';
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

    // Close drawer on path or search param change — unchanged
    useEffect(() => {
        setIsOpen(false);
    }, [pathname, searchParams]);

    // Lock body scroll when mobile drawer open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const updateCollection = useCallback((handle: string) => {
        router.push(`/collections/${handle}`);
    }, [router]);

    const updateFilter = useCallback(
        (key: string, value: string, action: 'add' | 'remove') => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('after');

            if (key === 'price') {
                if (action === 'add') {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }
            } else {
                const currentValues = params.getAll(key);
                if (action === 'add') {
                    if (!currentValues.includes(value)) {
                        params.append(key, value);
                    }
                } else if (action === 'remove') {
                    params.delete(key);
                    currentValues.filter(v => v !== value).forEach(v => params.append(key, v));
                }
            }

            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [pathname, router, searchParams]
    );

    const clearFilters = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        const sort = params.get('sort');
        const q = params.get('q');
        const newParams = new URLSearchParams();
        if (sort) newParams.set('sort', sort);
        if (q) newParams.set('q', q);
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    const activeFilterCount = Array.from(searchParams.keys()).filter(
        k => k !== 'sort' && k !== 'q' && k !== 'after'
    ).length;

    return (
        <>
            {/* ── Mobile trigger button — only visible below md ── */}
            <button
                onClick={() => setIsOpen(true)}
                className="fs-mobile-btn"
                aria-label="Open filters"
            >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                    <span className="fs-mobile-badge">{activeFilterCount}</span>
                )}
            </button>

            {/* ── Mobile backdrop ── */}
            {isOpen && (
                <div
                    className="fs-backdrop"
                    onClick={() => setIsOpen(false)}
                    aria-hidden
                />
            )}

            {/* ── Sidebar / Drawer ──
                Desktop: static, sticky, no transform
                Mobile: fixed left drawer, slides in  ── */}
            <aside
                className={cn(
                    'fs-aside',
                    isOpen ? 'fs-aside--open' : ''
                )}
            >
                {/* Header */}
                <div className="fs-header">
                    <div className="fs-header-left">
                        <span className="fs-title">Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="fs-count-badge">{activeFilterCount}</span>
                        )}
                    </div>
                    <div className="fs-header-right">
                        {activeFilterCount > 0 && (
                            <button onClick={clearFilters} className="fs-clear-btn">
                                Clear all
                            </button>
                        )}
                        {/* Close only shown on mobile */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="fs-close-btn"
                            aria-label="Close filters"
                        >
                            <X size={15} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="fs-body">
                    {/* Collections nav — unchanged logic */}
                    {collections && collections.length > 0 && (
                        <div className="fs-group">
                            <h3 className="fs-group-label">Shop by Collection</h3>
                            <ul className="fs-collection-list">
                                {collections.map((coll) => (
                                    <li key={coll.handle}>
                                        <button
                                            onClick={() => updateCollection(coll.handle)}
                                            className="fs-collection-item"
                                        >
                                            <span className="fs-collection-name">{coll.title}</span>
                                            <div className="fs-collection-meta">
                                                <span className="fs-collection-count">{coll.count}</span>
                                                <span className="fs-collection-arrow">→</span>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Filter groups — unchanged logic */}
                    {filters.map((filter) => {
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
                            let paramKey = filter.label.toLowerCase().replace(/\s+/g, '_');
                            if (filter.values[0]?.input) {
                                try {
                                    const inputObj = JSON.parse(filter.values[0].input);
                                    if (inputObj.available !== undefined) paramKey = 'available';
                                    else if (inputObj.productType) paramKey = 'productType';
                                    else if (inputObj.tag) paramKey = 'tag';
                                    else if (inputObj.productVendor) paramKey = 'vendor';
                                    else if (inputObj.variantOption?.name) paramKey = `option_${inputObj.variantOption.name}`;
                                    else if (inputObj.productMetafield?.key) paramKey = inputObj.productMetafield.key;
                                } catch { /* fallback */ }
                            }

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

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

                /* ══════════════════════════════════════════
                   Z-INDEX STACK
                   navbar:      z-50  (Tailwind = 50)
                   backdrop:    z-[300]
                   drawer:      z-[310]
                   This ensures drawer always floats above navbar
                ══════════════════════════════════════════ */

                /* ══════════════════════════════════════════
                   Mobile trigger button
                   Only visible below 768px
                ══════════════════════════════════════════ */
                .fs-mobile-btn {
                    display: none;
                }

                @media (max-width: 767px) {
                    .fs-mobile-btn {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        font-family: 'DM Sans', sans-serif;
                        font-size: 0.72rem;
                        font-weight: 700;
                        letter-spacing: 0.14em;
                        text-transform: uppercase;
                        color: #2C2218;
                        background: #FFFFFF;
                        border: 1.5px solid #C9A96E;
                        border-radius: 8px;
                        padding: 0.55rem 2.8rem;
                        cursor: pointer;
                        transition: background 0.22s, color 0.22s, border-color 0.22s, box-shadow 0.22s;
                        width: 100%;
                        justify-content: center;
                        margin-bottom: 1rem;
                        box-shadow: 0 1px 4px rgba(201,169,110,0.15);
                    }

                    .fs-mobile-btn:hover,
                    .fs-mobile-btn:active {
                        background: #1C1510;
                        color: #FAF6F0;
                        border-color: #1C1510;
                        box-shadow: 0 4px 14px rgba(0,0,0,0.12);
                    }
                }

                .fs-mobile-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 18px;
                    height: 18px;
                    border-radius: 999px;
                    background: #C9A96E;
                    color: #FFFFFF;
                    font-size: 0.58rem;
                    font-weight: 700;
                    padding: 0 5px;
                    line-height: 1;
                }

                /* ══════════════════════════════════════════
                   Backdrop — mobile only, above navbar
                ══════════════════════════════════════════ */
                .fs-backdrop {
                    display: none;
                }

                @media (max-width: 767px) {
                    .fs-backdrop {
                        display: block;
                        position: fixed;
                        inset: 0;
                        background: rgba(20, 14, 6, 0.55);
                        z-index: 9999;
                        animation: fsBdFadeIn 0.22s ease both;
                    }
                }

                @keyframes fsBdFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                /* ══════════════════════════════════════════
                   Aside
                   Desktop: sticky panel with internal scroll
                   Mobile:  fixed left drawer above backdrop
                ══════════════════════════════════════════ */
.fs-aside {
    background: #FFFFFF;
    border: 1px solid #EDE8E0;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: calc(var(--navbar-height, 80px) + 1rem);
    align-self: start;
    overflow: hidden; /* ← changed: needed so .fs-body scroll is contained */
}

                @media (max-width: 767px) {
                    .fs-aside {
                        position: fixed !important;
                        /* Cover full screen height including navbar */
                        top: 0 !important;
                        left: 0 !important;
                        bottom: 0 !important;
                        right: auto !important;
                        width: min(300px, 88vw) !important;
                        height: 100dvh !important;
                        max-height: 100dvh !important;
                        /* Must be above navbar — use max safe value */
                        z-index: 9999 !important;
                        border-radius: 0 !important;
                        border: none !important;
                        border-right: 1px solid #EDE8E0 !important;
                        box-shadow: 8px 0 48px rgba(0,0,0,0.22) !important;
                        /* Start off-screen left */
                        transform: translateX(-110%) !important;
                        transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
                        overflow: hidden !important;
                        align-self: unset !important;
                        /* Ensure it paints on top */
                        isolation: isolate;
                        will-change: transform;
                    }

                    .fs-aside.fs-aside--open {
                        transform: translateX(0) !important;
                    }
                }

                /* ══════════════════════════════════════════
                   Header
                ══════════════════════════════════════════ */
                .fs-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 1.1rem 0.85rem;
                    border-bottom: 1px solid #F0EBE4;
                    flex-shrink: 0;
                    gap: 0.5rem;
                    background: #FFFFFF;
                }

                /* On mobile, add top safe area padding so header clears notch/status bar */
                @media (max-width: 767px) {
                    .fs-header {
                        padding-top: max(1rem, env(safe-area-inset-top, 1rem));
                        /* Slightly more breathing room since we cover the full screen */
                        padding-top: calc(1rem + env(safe-area-inset-top, 0px));
                    }
                }

                .fs-header-left {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .fs-title {
                    font-family: 'Cormorant Garamond', Georgia, serif;
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: #1C1510;
                    letter-spacing: 0.01em;
                }

                .fs-count-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 18px;
                    height: 18px;
                    border-radius: 999px;
                    background: #C9A96E;
                    color: #FFFFFF;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.58rem;
                    font-weight: 700;
                    padding: 0 5px;
                    line-height: 1;
                }

                .fs-header-right {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-shrink: 0;
                }

                .fs-clear-btn {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.62rem;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #B0A090;
                    background: none;
                    border: none;
                    border-bottom: 1px solid transparent;
                    padding-bottom: 1px;
                    cursor: pointer;
                    transition: color 0.2s, border-color 0.2s;
                    white-space: nowrap;
                }

                .fs-clear-btn:hover {
                    color: #C9A96E;
                    border-bottom-color: #C9A96E;
                }

                /* Close X — hidden on desktop, visible on mobile */
                .fs-close-btn {
                    display: none;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    border: 1px solid #EDE8E0;
                    background: #FDFAF6;
                    color: #5A4F46;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    flex-shrink: 0;
                    transition: border-color 0.2s, background 0.2s, color 0.2s;
                }

                .fs-close-btn:hover {
                    border-color: #C9A96E;
                    background: #FDF8F1;
                    color: #C9A96E;
                }

                @media (max-width: 767px) {
                    .fs-close-btn {
                        display: flex;
                    }
                }

                /* ══════════════════════════════════════════
                   Scrollable body
                   Desktop: grows inside sticky aside
                   Mobile:  fills remaining drawer height
                ══════════════════════════════════════════ */
.fs-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.85rem 1.1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    scrollbar-width: thin;
    scrollbar-color: #D4C4A8 transparent;
    /* Auto height: fills whatever space the aside allows, no hardcoded calc */
    max-height: none;
    min-height: 0; /* ← critical: allows flex child to shrink and scroll properly */
}

                .fs-body::-webkit-scrollbar {
                    width: 3px;
                }

                .fs-body::-webkit-scrollbar-thumb {
                    background: #D4C4A8;
                    border-radius: 3px;
                }

                @media (max-width: 767px) {
                    .fs-body {
                        /* On mobile the drawer is 100dvh, let body fill it */
                        max-height: none;
                    }
                }

                /* ══════════════════════════════════════════
                   Collections nav group
                ══════════════════════════════════════════ */
                .fs-group-label {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.58rem;
                    font-weight: 700;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: #B0A090;
                    margin-bottom: 0.55rem;
                }

                .fs-collection-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .fs-collection-item {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0.42rem 0.5rem;
                    border-radius: 6px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    transition: background 0.15s;
                    text-align: left;
                }

                .fs-collection-item:hover {
                    background: #FDF8F1;
                }

                .fs-collection-name {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.78rem;
                    color: #4A3F35;
                    transition: color 0.15s;
                }

                .fs-collection-item:hover .fs-collection-name {
                    color: #C9A96E;
                }

                .fs-collection-meta {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .fs-collection-count {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.62rem;
                    font-weight: 500;
                    color: #B0A090;
                    background: #F5F0E8;
                    padding: 1px 7px;
                    border-radius: 999px;
                }

                .fs-collection-arrow {
                    font-size: 0.68rem;
                    color: #D4C4A8;
                    transition: color 0.15s;
                }

                .fs-collection-item:hover .fs-collection-arrow {
                    color: #C9A96E;
                }
            `}</style>
        </>
    );
}