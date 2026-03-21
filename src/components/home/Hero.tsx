"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const slides = [
  {
    id: 0,
    title: "Elegance",
    subtitle: "Discover the new silver collection.",
    image: "https://cdn.shopify.com/s/files/1/0704/8554/0995/files/slide1.avif?v=1773641439",
  },
  {
    id: 1,
    title: "The Golden Hour",
    subtitle: "18KT gold plated essentials.",
    image: "https://cdn.shopify.com/s/files/1/0704/8554/0995/files/slilde3.avif?v=1773641440",
  },
  {
    id: 2,
    title: "Timeless Bonds",
    subtitle: "Gifts that last a lifetime.",
    image: "https://cdn.shopify.com/s/files/1/0704/8554/0995/files/slide2.avif?v=1773641441",
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // 6 seconds per slide

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      className="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-[#FAF8F5] pt-[116px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10" /> {/* Dark gradient overlay for text readability */}
          <Image
            src={slides[currentSlide]?.image || ''}
            alt={slides[currentSlide]?.title || ''}
            fill
            priority={currentSlide === 0}
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/80 font-semibold font-sans">
              BSJ Exclusive
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight drop-shadow-xl">
              {slides[currentSlide]?.title}
            </h1>
            <p className="text-lg md:text-2xl text-white/90 font-light drop-shadow-md font-sans">
              {slides[currentSlide]?.subtitle}
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="inline-block bg-white text-stone-900 px-10 py-4 text-sm font-semibold uppercase tracking-[0.15em] font-sans hover:bg-stone-100 transition-colors duration-300 shadow-lg"
                aria-label="Shop Now"
              >
                Shop Now
              </Link>
              <Link
                href="/collections"
                className="inline-block border border-white/60 text-white backdrop-blur-sm px-10 py-4 text-sm font-semibold uppercase tracking-[0.15em] font-sans hover:bg-white hover:text-stone-900 transition-all duration-300"
                aria-label="Explore Collections"
              >
                Explore Collections
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-4 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-500 relative flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded-full ${currentSlide === idx ? 'w-12 h-12' : 'w-8 h-8'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          >
            <span
              className={`absolute h-[2px] bg-white transition-all duration-500 ${currentSlide === idx ? 'w-10 opacity-100' : 'w-4 opacity-50 hover:opacity-100'
                }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
