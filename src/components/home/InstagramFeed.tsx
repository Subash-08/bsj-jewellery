"use client";

import React from 'react';
import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { Section } from '@/components/layout/Section';

const IMAGES = [
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1535633302704-b02f4fad253f?auto=format&fit=crop&q=80&w=400",
];

export default function InstagramFeed() {
  return (
    <Section className="bg-[#FAF8F5] px-0 md:px-0 lg:px-0 max-w-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-4">Follow Our Journey</h2>
        <p className="text-stone-600 font-sans text-lg mb-6">@bsjjewellers on Instagram</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 w-full">
        {IMAGES.map((src, idx) => (
          <a
            key={idx}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer" 
            className="relative aspect-square block group overflow-hidden"
          >
            <Image 
              src={src}
              alt="Instagram feed image"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
              <Instagram className="w-10 h-10 text-white" />
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}
