"use client";

import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';

const TESTIMONIALS = [
  {
    author: "Ananya Sharma",
    location: "Mumbai",
    review: "The diamond ring I purchased is absolutely breathtaking. The craftsmanship is flawless and the customer service was exceptional. I felt truly valued throughout the process.",
    rating: 5
  },
  {
    author: "Priya Desai",
    location: "Delhi",
    review: "I have been buying from BSJ for years. Their silver collection is unmatched in elegance. This recent purchase was exactly what I dreamed of for my anniversary.",
    rating: 5
  },
  {
    author: "Meera Reddy",
    location: "Bangalore",
    review: "Stunning designs and true authenticity. It's rare to find such intricate work backed by hallmark certification. Will certainly be returning for more.",
    rating: 5
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = TESTIMONIALS[currentIndex];
  if (!currentTestimonial) return null;

  return (
    <Section className="bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-16">Stories of Elegance</h2>

        <div className="relative min-h-[250px] flex items-center justify-center">
          <button 
            onClick={prevSlide}
            className="absolute left-0 md:-left-12 z-20 p-2 text-stone-400 hover:text-amber-600 transition-colors"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <div className="px-12 md:px-20 max-w-3xl">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <p className="text-lg md:text-2xl font-serif text-stone-800 leading-relaxed italic mb-8">
              &quot;{currentTestimonial.review}&quot;
            </p>
            <div>
              <h4 className="font-sans font-bold text-stone-900 uppercase tracking-widest text-sm">
                {currentTestimonial.author}
              </h4>
              <span className="text-xs text-stone-500 block mt-1">{currentTestimonial.location}</span>
            </div>
          </div>

          <button 
            onClick={nextSlide}
            className="absolute right-0 md:-right-12 z-20 p-2 text-stone-400 hover:text-amber-600 transition-colors"
            aria-label="Next review"
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-12">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === idx ? 'w-8 h-1 bg-amber-600' : 'w-2 h-1 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
