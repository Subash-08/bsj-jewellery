'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import type { Collection } from './CollectionsServer';

interface CollectionsClientProps {
    large: Collection;
    small: Collection[];
}

// Reusable card — large variant
function LargeCard({ collection }: { collection: Collection }) {
    return (
        <div className="group relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden border border-rose-200/30 shadow-lg hover:shadow-xl transition-all duration-500 col-span-1 md:col-span-2">
            {/* Background image */}
            <Image
                src={collection.image}
                alt={collection.title}
                fill
                priority
                className="object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 90vw"
            />

            {/* Gradient overlay */}
            <div
                className={cn(
                    'absolute inset-0 bg-gradient-to-t transition-opacity duration-500 group-hover:opacity-90',
                    collection.overlay
                )}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-8 md:p-12">
                <h3 className="font-serif text-4xl md:text-6xl lg:text-7xl text-stone-800 mb-3 drop-shadow-sm">
                    {collection.title}
                </h3>
                <p className="text-base md:text-lg text-stone-700 tracking-wide mb-8 opacity-90">
                    {collection.subtitle}
                </p>
                <Link
                    href={`/collections/${collection.handle}`}
                    className={cn(
                        'inline-flex items-center px-8 py-3 rounded-full',
                        'bg-white/80 backdrop-blur-md text-stone-800',
                        'text-xs uppercase tracking-widest font-semibold',
                        'border border-white/60',
                        'transition-all duration-300',
                        'hover:bg-stone-900 hover:text-white hover:border-stone-900',
                        'shadow-sm hover:shadow-md'
                    )}
                >
                    {collection.ctaText}
                </Link>
            </div>
        </div>
    );
}

// Reusable card — small variant
function SmallCard({
    collection,
    index,
}: {
    collection: Collection;
    index: number;
}) {
    return (
        <div
            className="group relative h-[380px] md:h-[450px] rounded-2xl overflow-hidden border border-rose-200/30 shadow-lg hover:shadow-xl transition-all duration-500"
            style={{
                animationDelay: `${index * 200}ms`,
            }}
        >
            {/* Background image */}
            <Image
                src={collection.image}
                alt={collection.title}
                fill
                className="object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 45vw"
            />

            {/* Gradient overlay */}
            <div
                className={cn(
                    'absolute inset-0 bg-gradient-to-t transition-opacity duration-500 group-hover:opacity-90',
                    collection.overlay
                )}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-8">
                <h3 className="font-serif text-3xl md:text-4xl text-stone-800 mb-3 drop-shadow-sm">
                    {collection.title}
                </h3>
                <p className="text-sm text-stone-700 tracking-wide mb-8 opacity-90">
                    {collection.subtitle}
                </p>
                <Link
                    href={`/collections/${collection.handle}`}
                    className={cn(
                        'inline-flex items-center px-8 py-3 rounded-full',
                        'bg-white/80 backdrop-blur-md text-stone-800',
                        'text-xs uppercase tracking-widest font-semibold',
                        'border border-white/60',
                        'transition-all duration-300',
                        'hover:bg-stone-900 hover:text-white hover:border-stone-900',
                        'shadow-sm hover:shadow-md'
                    )}
                >
                    {collection.ctaText}
                </Link>
            </div>
        </div>
    );
}

export default function CollectionsClient({
    large,
    small = [],
}: CollectionsClientProps) {
    if (!large) return null;

    return (
        <section
            className="relative py-20 md:py-28 overflow-hidden "

            style={{
                backgroundColor: '#fdf6ec',
            }}
            aria-labelledby="collections-heading"
        >
            {/* Top decorative line — matching React reference */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose-300/40 to-transparent" />
            {/* Bottom decorative line */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose-300/40 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section header */}
                <div className="text-center mb-14 md:mb-16 space-y-4">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-rose-500">
                        Curated for you
                    </span>
                    <h2
                        id="collections-heading"
                        className="font-serif text-4xl md:text-5xl text-stone-800 font-normal"
                    >
                        The Collections
                    </h2>
                    {/* Decorative divider line */}
                    <div className="w-20 h-px bg-rose-300/60 mx-auto" />
                </div>

                {/* Grid layout — matches React reference exactly */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                    {/* Large card — full width */}
                    <LargeCard collection={large} />

                    {/* Small cards — 2 col */}
                    {small.map((collection, index) => (
                        <SmallCard
                            key={collection.id}
                            collection={collection}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}