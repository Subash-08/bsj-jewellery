'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/shopify/product';
import { Badge } from '@/components/ui/Badge';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { WishlistButton } from '@/components/ui/WishlistButton';
import AddToCart from '@/components/product/AddToCart';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
    collectionHandle?: string;
}

export function ProductCard({ product, collectionHandle = 'all' }: ProductCardProps) {
    const minPrice = product.priceRange.minVariantPrice.amount;
    const maxPrice = product.priceRange.maxVariantPrice.amount;
    const currency = product.priceRange.minVariantPrice.currencyCode;
    const [hov, setHov] = useState(false);

    // Compare-at price — unchanged logic
    let compareAtPriceMin: string | undefined = undefined;
    if (product.variants && product.variants.length > 0) {
        const compareAtPrices = product.variants
            .map(v => v.compareAtPrice?.amount)
            .filter(Boolean) as string[];
        if (compareAtPrices.length > 0) {
            compareAtPriceMin = Math.min(...compareAtPrices.map(Number)).toString();
        }
    }

    const firstImage = product.featuredImage || product.images?.[0];
    const secondImage = product.images?.[1] || firstImage;
    const metadata = product.jewelryMetafields;

    const isBestSeller = product.tags?.includes('Best Seller');
    const isNew = product.tags?.includes('New');
    const isHallmark = product.tags?.includes('Hallmark');

    return (
        <div
            className="group relative flex flex-col h-full"
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                overflow: 'hidden',
                border: hov ? '1px solid #C9A96E' : '1px solid #EDE8E0',
                boxShadow: hov
                    ? '0 16px 48px rgba(201,169,110,0.15), 0 4px 16px rgba(0,0,0,0.08)'
                    : '0 2px 12px rgba(0,0,0,0.05)',
                transition: 'border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease',
                transform: hov ? 'translateY(-4px)' : 'translateY(0)',
            }}
        >
            {/* ── Top badges row ── */}
            <div className="absolute top-3 left-3 z-10 flex gap-1.5 flex-wrap pointer-events-none">
                {isBestSeller && <Badge variant="glass">Best Seller</Badge>}
                {isNew && <Badge variant="new">New</Badge>}
            </div>

            {/* ── Wishlist button — top right ── */}
            <div
                className="absolute top-3 right-3 z-20"
                style={{
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '50%',
                    border: '1px solid #EDE8E0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                    transform: hov ? 'scale(1.1)' : 'scale(1)',
                    borderColor: hov ? '#C9A96E' : '#EDE8E0',
                }}
            >
                <WishlistButton product={product} />
            </div>

            {/* ── Image area ── */}
            <Link
                href={`/collections/${collectionHandle}/${product.handle}`}
                className="relative block overflow-hidden"
                style={{
                    aspectRatio: '1 / 1',
                    background: 'linear-gradient(145deg, #FAF8F4 0%, #F3EFE8 100%)',
                }}
            >
                {firstImage ? (
                    <>
                        <Image
                            src={firstImage.url}
                            alt={firstImage.altText || product.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-contain w-full h-full"
                            style={{
                                padding: '1.25rem',
                                transition: 'opacity 0.6s ease, transform 0.6s ease',
                                opacity: hov && secondImage ? 0 : 1,
                                transform: hov ? 'scale(1.06)' : 'scale(1)',
                            }}
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNTAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2Y5ZmFmYiIvPjwvc3ZnPg=="
                        />
                        {secondImage && (
                            <Image
                                src={secondImage.url}
                                alt={secondImage.altText || product.title}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-contain w-full h-full absolute inset-0"
                                style={{
                                    padding: '1.25rem',
                                    transition: 'opacity 0.6s ease, transform 0.6s ease',
                                    opacity: hov ? 1 : 0,
                                    transform: hov ? 'scale(1)' : 'scale(1.06)',
                                }}
                            />
                        )}
                    </>
                ) : (
                    <div
                        className="flex items-center justify-center h-full"
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.75rem',
                            color: '#C4B8A8',
                            letterSpacing: '0.06em',
                        }}
                    >
                        No Image
                    </div>
                )}

                {/* Gold shimmer bottom line on hover */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '10%',
                        right: '10%',
                        height: '1.5px',
                        background: 'linear-gradient(90deg, transparent, #C9A96E 40%, #E8D5A3 60%, transparent)',
                        opacity: hov ? 1 : 0,
                        transition: 'opacity 0.5s ease',
                        borderRadius: '1px',
                    }}
                />

                {/* "Quick View" ghost label — slides up on hover */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '0.6rem',
                        display: 'flex',
                        justifyContent: 'center',
                        background: 'linear-gradient(to top, rgba(20,14,8,0.42) 0%, transparent 100%)',
                        opacity: hov ? 1 : 0,
                        transform: hov ? 'translateY(0)' : 'translateY(6px)',
                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                        pointerEvents: 'none',
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,251,245,0.9)',
                        }}
                    >
                        Quick View
                    </span>
                </div>
            </Link>

            {/* ── Info pane ── */}
            <div
                className="flex flex-col flex-1 justify-between"
                style={{ padding: '0.9rem 1rem 1rem' }}
            >
                {/* Title + metadata */}
                <Link
                    href={`/collections/${collectionHandle}/${product.handle}`}
                    className="flex-1 block"
                >
                    <h3
                        style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            lineHeight: 1.4,
                            color: hov ? '#9A6F30' : '#1C1510',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            transition: 'color 0.25s',
                            letterSpacing: '0.01em',
                            marginBottom: '0.1rem',
                        }}
                    >
                        {product.title}
                    </h3>

                    {/* Jewellery specs — unchanged logic */}
                    {(metadata?.['Metal Type'] || metadata?.['Gross Weight'] || metadata?.['Purity']) && (
                        <div
                            style={{
                                marginTop: '0.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.18rem',
                                paddingTop: '0.45rem',
                                borderTop: '1px solid #F2EDE6',
                            }}
                        >
                            {[
                                metadata?.['Metal Type'] && ['Metal', metadata['Metal Type']],
                                metadata?.['Gross Weight'] && ['Weight', metadata['Gross Weight']],
                                metadata?.['Purity'] && ['Purity', metadata['Purity']],
                                isHallmark && ['Hallmark', 'BIS Certified'],
                            ]
                                .filter(Boolean)
                                .map(([label, value]) => (
                                    <div
                                        key={label as string}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontSize: '0.65rem',
                                        }}
                                    >
                                        <span style={{ color: '#B0A090', letterSpacing: '0.04em' }}>
                                            {label as string}
                                        </span>
                                        <span
                                            style={{
                                                fontWeight: 500,
                                                color: label === 'Hallmark' ? '#B8882A' : '#4A3F35',
                                                letterSpacing: '0.02em',
                                            }}
                                        >
                                            {value as string}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    )}
                </Link>

                {/* ── Price + CTA ── */}
                <div
                    style={{
                        marginTop: '0.75rem',
                        paddingTop: '0.7rem',
                        borderTop: '1px solid #F2EDE6',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem',
                    }}
                >
                    {/* Price row */}
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                        <PriceDisplay
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            compareAtPriceMin={compareAtPriceMin}
                            currencyCode={currency}
                            size="md"
                        />
                        {/* Hallmark dot — if tagged */}
                        {isHallmark && (
                            <span
                                style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: '0.55rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.14em',
                                    textTransform: 'uppercase',
                                    color: '#B8882A',
                                    border: '1px solid #C9A96E',
                                    borderRadius: 4,
                                    padding: '1px 5px',
                                }}
                            >
                                BIS
                            </span>
                        )}
                    </div>

                    {/* AddToCart — slim gold-outlined style */}
                    <div
                        style={{
                            /* Override AddToCart child button styles via CSS custom property */
                            '--atc-bg': 'transparent',
                            '--atc-color': '#2C2218',
                            '--atc-border': '1.5px solid #C9A96E',
                            '--atc-radius': '6px',
                            '--atc-font-size': '0.65rem',
                            '--atc-letter-spacing': '0.16em',
                            '--atc-padding': '0.55rem 1rem',
                            '--atc-hover-bg': '#1C1510',
                            '--atc-hover-color': '#FAF6F0',
                        } as React.CSSProperties}
                        className="pc-atc-wrap"
                    >
                        <AddToCart
                            availableForSale={product.availableForSale}
                            variantId={product.variants?.[0]?.id}
                        />
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

                /* Override AddToCart button inside product card */
                .pc-atc-wrap button,
                .pc-atc-wrap [role="button"] {
                    width: 100% !important;
                    background: transparent !important;
                    color: #2C2218 !important;
                    border: 1.5px solid #C9A96E !important;
                    border-radius: 6px !important;
                    font-family: 'DM Sans', sans-serif !important;
                    font-size: 0.65rem !important;
                    font-weight: 700 !important;
                    letter-spacing: 0.18em !important;
                    text-transform: uppercase !important;
                    padding: 0.6rem 1rem !important;
                    transition: background 0.25s, color 0.25s, border-color 0.25s !important;
                    box-shadow: none !important;
                    cursor: pointer !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 6px !important;
                }

                .pc-atc-wrap button:hover,
                .pc-atc-wrap [role="button"]:hover {
                    background: #1C1510 !important;
                    color: #FAF6F0 !important;
                    border-color: #1C1510 !important;
                }

                .pc-atc-wrap button:disabled,
                .pc-atc-wrap [role="button"]:disabled {
                    border-color: #D4CAC0 !important;
                    color: #B0A090 !important;
                    cursor: not-allowed !important;
                }

                .pc-atc-wrap svg {
                    width: 12px !important;
                    height: 12px !important;
                }
            `}</style>
        </div>
    );
}