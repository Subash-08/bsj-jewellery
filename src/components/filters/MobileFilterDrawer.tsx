'use client';

import { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import FilterSidebar from '@/components/filters/FilterSidebar';

interface MobileFilterDrawerProps {
    filters: any[];
    currentParams: { [key: string]: string | string[] | undefined };
    productCount: number;
}

export function MobileFilterDrawer({ filters, currentParams, productCount }: MobileFilterDrawerProps) {
    const [open, setOpen] = useState(true);

    // Lock body scroll when drawer open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    // Close on route change (filter applied)
    useEffect(() => {
        setOpen(false);
    }, [currentParams]);

    return (
        <>
            {/* ── Trigger bar — only visible on mobile ── */}
            <div className="mfd-trigger-bar">
                <button
                    onClick={() => setOpen(true)}
                    className="mfd-filter-btn"
                    aria-label="Open filters"
                >
                    <SlidersHorizontal size={14} />
                    <span>Filters</span>
                </button>
                <span className="mfd-count">
                    {productCount} product{productCount !== 1 ? 's' : ''}
                </span>
            </div>

            {/* ── Backdrop ── */}
            {open && (
                <div
                    className="mfd-backdrop"
                    onClick={() => setOpen(false)}
                    aria-hidden
                />
            )}

            {/* ── Drawer panel ── */}
            <div className={`mfd-drawer ${open ? 'mfd-drawer--open' : ''}`} aria-modal role="dialog">
                {/* Drawer header */}
                <div className="mfd-drawer-header">
                    <span className="mfd-drawer-title">Filters</span>
                    <button
                        onClick={() => setOpen(false)}
                        className="mfd-close-btn"
                        aria-label="Close filters"
                    >
                        <X size={16} strokeWidth={2} />
                    </button>
                </div>

                {/* Drawer content */}
                <div className="mfd-drawer-body ">
                    <FilterSidebar filters={filters} currentParams={currentParams} />
                </div>
            </div>

            <style>{`
                /* ── Trigger bar: only on mobile ── */
                .mfd-trigger-bar {
                    display: none;
                }

                @media (max-width: 767px) {
                    .mfd-trigger-bar {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0.6rem 0;
                        margin-bottom: 0.75rem;
                        border-bottom: 1px solid #EDE8E0;
                    }
                }

                .mfd-filter-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #2C2218;
                    background: #FFFFFF;
                    border: 1.5px solid #C9A96E;
                    border-radius: 6px;
                    padding: 0.45rem 0.9rem;
                    cursor: pointer;
                    transition: background 0.2s, color 0.2s;
                }

                .mfd-filter-btn:hover {
                    background: #1C1510;
                    color: #FAF6F0;
                    border-color: #1C1510;
                }

                .mfd-count {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.72rem;
                    color: #B0A090;
                }

                /* ── Backdrop ── */
                .mfd-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(28, 21, 10, 0.45);
                    z-index: 199;
                    animation: mfdFadeIn 0.2s ease both;
                }

                @keyframes mfdFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                /* ── Drawer ── */
                .mfd-drawer {
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    width: min(320px, 88vw);
                    background: #FDFAF6;
                    z-index: 200;
                    display: flex;
                    flex-direction: column;
                    transform: translateX(-100%);
                    transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 4px 0 32px rgba(0,0,0,0.12);
                }

                .mfd-drawer--open {
                    transform: translateX(0);
                }

                /* ── Drawer header ── */
                .mfd-drawer-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1.1rem 1.25rem;
                    border-bottom: 1px solid #EDE8E0;
                    flex-shrink: 0;
                }

                .mfd-drawer-title {
                    font-family: 'Cormorant Garamond', Georgia, serif;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1C1510;
                    letter-spacing: 0.01em;
                }

                .mfd-close-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 1px solid #EDE8E0;
                    background: #FFFFFF;
                    color: #5A4F46;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: border-color 0.2s, color 0.2s;
                }

                .mfd-close-btn:hover {
                    border-color: #C9A96E;
                    color: #C9A96E;
                }

                /* ── Drawer scrollable body ── */
                .mfd-drawer-body {
                    flex: 1;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding: 1rem 1.25rem 2rem;
                    /* Thin warm scrollbar */
                    scrollbar-width: thin;
                    scrollbar-color: #D4C4A8 transparent;
                }

                .mfd-drawer-body::-webkit-scrollbar {
                    width: 4px;
                }

                .mfd-drawer-body::-webkit-scrollbar-thumb {
                    background: #D4C4A8;
                    border-radius: 4px;
                }
            `}</style>
        </>
    );
}