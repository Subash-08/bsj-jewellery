import React from 'react';
import Link from 'next/link';
import { Section } from '@/components/layout/Section';

export default function FinalCTA() {
  return (
    <Section className="bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-serif text-stone-900 mb-6 leading-tight">
          Discover Timeless Jewellery
        </h2>
        <p className="text-stone-600 font-sans text-lg md:text-xl mb-12 max-w-2xl mx-auto tracking-wide">
          Explore our complete collection and find the perfect piece that speaks to your unique style.
        </p>
        <Link 
          href="/shop"
          className="inline-block bg-stone-900 text-white px-14 py-5 text-sm font-bold uppercase tracking-[0.2em] font-sans hover:bg-amber-600 transition-colors shadow-xl shadow-amber-600/10"
        >
          Shop Now
        </Link>
      </div>
    </Section>
  );
}
