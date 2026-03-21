import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Collection } from '@/types/shopify/collection';
import { Section } from '@/components/layout/Section';

export default function FeaturedCollections({ collections }: { collections: Collection[] }) {
  if (!collections || collections.length < 3) return null;

  const featured = collections.slice(0, 3);

  return (
    <Section className="bg-white">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-4">Curated Collections</h2>
          <p className="text-stone-600 font-sans text-lg">Explore our hand-picked selections designed for your most precious moments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 h-auto md:h-[600px]">
          {/* Large Left Card */}
          <Link href={`/collections/${featured[0]?.handle}`} className="relative group block overflow-hidden rounded-lg h-[400px] md:h-full">
            {featured[0]?.image?.url ? (
              <Image 
                src={featured[0].image.url} 
                alt={featured[0]?.title || 'Collection'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-stone-200" />
            )}
            <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/40 flex flex-col justify-end p-8 md:p-12">
              <h3 className="text-2xl md:text-4xl font-serif text-white mb-3">{featured[0]?.title}</h3>
              <span className="text-xs uppercase tracking-[0.15em] font-bold text-white/90 group-hover:text-amber-400 transition-colors flex items-center gap-2">
                Discover <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </Link>

          {/* Right Stack */}
          <div className="flex flex-col gap-4 lg:gap-8 h-full">
            {featured.slice(1, 3).map((cat, idx) => (
              <Link key={idx} href={`/collections/${cat.handle}`} className="relative group block overflow-hidden rounded-lg h-[300px] md:h-[calc(50%-1rem)] lg:h-[calc(50%-1.25rem)] flex-1">
                {cat.image?.url ? (
                  <Image 
                    src={cat.image.url} 
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-stone-200" />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8">
                  <h3 className="text-xl md:text-3xl font-serif text-white mb-2">{cat.title}</h3>
                  <span className="text-xs uppercase tracking-[0.15em] font-bold text-white/90 group-hover:text-amber-400 transition-colors flex items-center gap-2">
                    Shop Now <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
    </Section>
  );
}
