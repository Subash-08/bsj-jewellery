"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Collection } from '@/types/shopify/collection';

interface CategorySliderProps {
  collections: Collection[];
}

const CategorySlider = ({ collections }: CategorySliderProps) => {
  if (!collections || collections.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white relative">
      <div className="w-full px-4 md:px-12 relative max-w-[1600px] mx-auto">
        <div className="relative group">
          <div 
            className="flex space-x-4 md:space-x-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 px-2"
          >
            {collections.map((cat, index) => {
              const image = cat.image?.url || "/images/collection-placeholder.jpg";
              
              return (
                <div 
                  key={cat.handle || index}
                  className="flex-shrink-0 w-36 md:w-52 text-center snap-start"
                >
                  <Link href={`/collections/${cat.handle}`} className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-[2rem] md:rounded-[2.5rem]">
                    <div className="aspect-square rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-soft hover:shadow-md transition-all duration-300 border border-gray-100 relative group-hover:scale-[1.02]">
                      <Image 
                        src={image} 
                        alt={cat.title} 
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 144px, 208px"
                      />
                    </div>
                    <span className="text-lg md:text-xl font-body text-primary block mt-5 transition-colors group-hover:text-rose-gold">{cat.title}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;
