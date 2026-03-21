import React from 'react';
import Link from 'next/link';
import { Section } from '@/components/layout/Section';

export default function PromoBanner() {
  return (
    <Section className="bg-stone-900 relative overflow-hidden text-center md:text-left">
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-luminosity"></div>
      <div className="relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-stone-700">
          <div className="flex flex-col items-center md:items-start justify-center md:pr-12 py-4">
            <span className="text-amber-500 uppercase tracking-widest text-xs font-semibold mb-3">Premium Delivery</span>
            <h3 className="text-2xl md:text-4xl text-white font-serif mb-4">Free Shipping</h3>
            <p className="text-stone-300 font-sans">On all orders above ₹10,000 across India.</p>
          </div>
          <div className="flex flex-col items-center md:items-start justify-center md:pl-12 py-4">
            <span className="text-amber-500 uppercase tracking-widest text-xs font-semibold mb-3">Limited Offer</span>
            <h3 className="text-2xl md:text-4xl text-white font-serif mb-4">Flat 10% OFF</h3>
            <p className="text-stone-300 font-sans mb-6">On our exclusive Silver jewellery collection.</p>
            <Link href="/shop/silver" className="inline-block border border-white text-white hover:bg-white hover:text-stone-900 transition-colors uppercase tracking-[0.15em] text-xs font-semibold px-8 py-3">
              Shop Silver
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
