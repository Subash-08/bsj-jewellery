import React from 'react';

export default function CollectionLoading() {
    return (
        <>
            <div
                className="collection-page min-h-screen pb-24"
                style={{ background: '#ffffffff' }}
            >
                <div
                    style={{
                        maxWidth: 1400,
                        margin: '0 auto',
                        padding: '0 clamp(1rem, 3vw, 2rem)',
                    }}
                >
                    {/* ── Page header ── */}
                    <div
                        style={{
                            paddingBottom: '1.5rem',
                            marginBottom: '1.5rem',
                            borderBottom: '1px solid #EDE8E0',
                        }}
                    >
                        {/* Breadcrumb hint */}
                        <div style={{ width: 60, height: 10, background: '#F0EBE2', borderRadius: 4, marginBottom: '0.6rem' }} className="animate-pulse" />

                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'flex-end',
                                justifyContent: 'space-between',
                                gap: '0.75rem',
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {/* Title skeleton */}
                                <div style={{ width: 'clamp(200px, 40vw, 320px)', height: 'clamp(2rem, 4vw, 3rem)', background: '#F0EBE2', borderRadius: 6 }} className="animate-pulse" />
                                {/* Product count skeleton */}
                                <div style={{ width: 120, height: 14, background: '#F0EBE2', borderRadius: 4 }} className="animate-pulse" />
                            </div>

                            {/* Sort dropdown skeleton */}
                            <div style={{ width: 160, height: 40, background: '#F0EBE2', borderRadius: 6 }} className="animate-pulse" />
                        </div>
                    </div>

                    {/* ── Body: sidebar + grid ── */}
                    <div className="cp-body-grid">

                        {/* Sidebar */}
                        <aside className="cp-sidebar cp-sidebar-skeleton">
                            <div style={{ width: '100%', height: 'calc(100vh - 12rem)', background: 'linear-gradient(180deg, #FFFFFF, #FAF8F5)', border: '1px solid #EDE8E0', borderRadius: 12, padding: '1.5rem' }}>
                                {/* Filter group skeleton */}
                                <div style={{ width: 60, height: 12, background: '#E8E1D6', borderRadius: 4, marginBottom: '1.5rem' }} className="animate-pulse" />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} style={{ width: '80%', height: 12, background: '#F0EBE2', borderRadius: 4 }} className="animate-pulse" />
                                    ))}
                                </div>
                                {/* Filter group skeleton */}
                                <div style={{ width: 50, height: 12, background: '#E8E1D6', borderRadius: 4, marginBottom: '1.5rem' }} className="animate-pulse" />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} style={{ width: '70%', height: 12, background: '#F0EBE2', borderRadius: 4 }} className="animate-pulse" />
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Main grid */}
                        <main className="cp-main" style={{ minWidth: 0 }}>
                            {/* Active filters bar height replacement */}
                            <div style={{ width: '100%', height: 46, background: '#FFFFFF', border: '1px solid #EDE8E0', borderRadius: 8, marginBottom: '1.25rem' }} className="animate-pulse" />

                            {/* Grid format mirrors the real Grid logic (2 cols mobile, 3 tablet, 4 desktop) */}
                            <div className="cp-skeleton-grid" style={{ display: 'grid', gap: '1rem' }}>
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div
                                            style={{
                                                aspectRatio: '1/1',
                                                borderRadius: 12,
                                                background: 'linear-gradient(135deg, #F0EBE2, #EAE4DC)',
                                                animation: 'cpPulse 1.8s ease-in-out infinite',
                                                animationDelay: `${i * 0.1}s`,
                                                marginBottom: '0.8rem'
                                            }}
                                        />
                                        <div style={{ height: 14, width: '85%', background: '#F0EBE2', borderRadius: 4, marginBottom: '0.4rem' }} className="animate-pulse" />
                                        <div style={{ height: 12, width: '50%', background: '#F0EBE2', borderRadius: 4 }} className="animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            <style>{`
                /* Mirror the layout CSS of page.tsx so the skeleton aligns perfectly */
                .cp-body-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                    align-items: start;
                }

                @media (min-width: 768px) {
                    .cp-body-grid {
                        grid-template-columns: 240px 1fr;
                        gap: 2rem;
                    }
                }

                @media (min-width: 1024px) {
                    .cp-body-grid {
                        grid-template-columns: 260px 1fr;
                        gap: 2.5rem;
                    }
                }

                .cp-sidebar {
                    position: sticky;
                    top: 6rem;
                    align-self: start;
                }

                .cp-skeleton-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                }

                @media (min-width: 768px) {
                    .cp-skeleton-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 1.25rem !important;
                    }
                }

                @media (min-width: 1024px) {
                    .cp-skeleton-grid {
                        grid-template-columns: repeat(3, 1fr) !important;
                        gap: 1.25rem !important;
                    }
                }

                @media (min-width: 1280px) {
                    .cp-skeleton-grid {
                        grid-template-columns: repeat(4, 1fr) !important;
                        gap: 1.5rem !important;
                    }
                }

                @media (max-width: 767px) {
                    .cp-body-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .cp-sidebar-skeleton {
                        display: none; /* Hide sidebar completely on mobile skeleton */
                    }
                }

                @keyframes cpPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </>
    );
}
