'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { X, SlidersHorizontal } from 'lucide-react';

export function ActiveFilterBar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const activeFilters: { key: string; value: string; displayLabel: string }[] = [];

    searchParams.forEach((value, key) => {
        if (key === 'sort' || key === 'q' || key === 'after' || key === 'page') return;

        if (key === 'price') {
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
                if (key === 'available') label = v === 'true' ? 'In Stock' : 'Out of Stock';
                else if (key.startsWith('option_')) label = `${key.slice('option_'.length)}: ${v}`;
                else if (key === 'productType') label = v;
                else if (key === 'tag') label = v;
                else if (key === 'vendor') label = v;
                activeFilters.push({ key, value: v, displayLabel: label });
            });
        }
    });

    if (activeFilters.length === 0) return null;

    const removeFilter = (filterKey: string, filterValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('after');
        if (filterKey === 'price') {
            params.delete('price');
        } else {
            const currentValues = params.getAll(filterKey);
            params.delete(filterKey);
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
        <>
            <div className="afb-root">
                {/* Left: icon + label */}
                <div className="afb-label-group">
                    <SlidersHorizontal size={12} className="afb-icon" />
                    <span className="afb-label">Filtered by</span>
                </div>

                {/* Divider */}
                <div className="afb-divider" />

                {/* Filter pills */}
                <div className="afb-pills">
                    {activeFilters.map((filter, i) => (
                        <button
                            key={`${filter.key}-${filter.value}-${i}`}
                            onClick={() => removeFilter(filter.key, filter.value)}
                            className="afb-pill"
                        >
                            <span className="afb-pill-text">{filter.displayLabel}</span>
                            <span className="afb-pill-x">
                                <X size={9} strokeWidth={2.5} />
                            </span>
                        </button>
                    ))}
                </div>

                {/* Clear all */}
                {activeFilters.length > 1 && (
                    <button onClick={clearAll} className="afb-clear">
                        Clear all
                    </button>
                )}
            </div>

            <style>{`
                .afb-root {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.65rem 0.9rem;
                    background: #FFFDF9;
                    border: 1px solid #EDE8DF;
                    border-radius: 8px;
                    margin-bottom: 1.25rem;
                    animation: afbSlideDown 0.25s cubic-bezier(0.22,1,0.36,1) both;
                }

                @keyframes afbSlideDown {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .afb-label-group {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    flex-shrink: 0;
                }

                .afb-icon {
                    color: #C9A96E;
                    flex-shrink: 0;
                }

                .afb-label {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.62rem;
                    font-weight: 700;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: #9A8878;
                    white-space: nowrap;
                }

                .afb-divider {
                    width: 1px;
                    height: 16px;
                    background: #E8E1D8;
                    flex-shrink: 0;
                    margin: 0 0.15rem;
                }

                .afb-pills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.4rem;
                    flex: 1;
                    min-width: 0;
                }

                .afb-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 0.3rem 0.65rem 0.3rem 0.7rem;
                    background: #FDF8F1;
                    border: 1px solid #D4C4A8;
                    border-radius: 999px;
                    cursor: pointer;
                    transition: background 0.2s, border-color 0.2s, transform 0.15s;
                    white-space: nowrap;
                }

                .afb-pill:hover {
                    background: #F5ECD9;
                    border-color: #C9A96E;
                    transform: translateY(-1px);
                }

                .afb-pill-text {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.7rem;
                    font-weight: 500;
                    color: #3A3025;
                    letter-spacing: 0.02em;
                }

                .afb-pill-x {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #E8DFD0;
                    color: #7A6858;
                    flex-shrink: 0;
                    transition: background 0.2s, color 0.2s;
                }

                .afb-pill:hover .afb-pill-x {
                    background: #C9A96E;
                    color: #FFFFFF;
                }

                .afb-clear {
                    margin-left: auto;
                    flex-shrink: 0;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #9A8878;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.2rem 0.1rem;
                    border-bottom: 1px solid transparent;
                    transition: color 0.2s, border-color 0.2s;
                    white-space: nowrap;
                }

                .afb-clear:hover {
                    color: #C9A96E;
                    border-bottom-color: #C9A96E;
                }

                /* Mobile: stack pills naturally, clear-all wraps below */
                @media (max-width: 480px) {
                    .afb-root {
                        padding: 0.55rem 0.75rem;
                        gap: 0.45rem;
                    }

                    .afb-divider {
                        display: none;
                    }

                    .afb-clear {
                        margin-left: 0;
                    }
                }
            `}</style>
        </>
    );
}