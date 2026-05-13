"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display, Montserrat } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['500', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '700'], style: ['normal', 'italic'] });

// ── Inline SVG icons (no external deps) ──────────────────────────────────────
const CheckCircle = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// ── Slide data ────────────────────────────────────────────────────────────────
const slides = [
  {
    id: 0,
    label: "TRENDING NOW",
    title: "Shine in Every\nMoment",
    subtitle: "Discover lightweight, stylish silver jewellery crafted for your everyday shine.",
    // Desktop Image (16:9 - 1920x1080)
    image: "https://cdn.shopify.com/s/files/1/0704/8554/0995/files/slide2.avif?v=1778489159",
    // Mobile Image (4:5 - 1080x1350)
    mobileImage: "https://cdn.shopify.com/s/files/1/0704/8554/0995/files/slide2.avif?v=1778489159",
    // Deep violet/purple tinted overlay — matches screenshot exactly
    overlayFrom: "rgba(58, 20, 80, 0.72)",
    overlayTo: "rgba(30, 8, 50, 0.40)",
  },
  {
    id: 1,
    label: "NEW ARRIVALS",
    title: "The Golden\nHour",
    subtitle: "18KT gold plated essentials to elevate your everyday style.",
    image: "https://cdn.shopify.com/s/files/1/0704/8554/0995/files/slide1.avif?v=1778489012",
    mobileImage: "https://cdn.shopify.com/s/files/1/0704/8554/0995/files/slide1.avif?v=1778489012",
    overlayFrom: "rgba(45, 18, 65, 0.75)",
    overlayTo: "rgba(25, 8, 45, 0.38)",
  },
  {
    id: 2,
    label: "GIFTING",
    title: "Timeless\nBonds",
    subtitle: "Gifts that last a lifetime, crafted with pure love.",
    image: "https://cdn.shopify.com/s/files/1/0704/8554/0995/files/slide2.avif?v=1777792796",
    mobileImage: "https://cdn.shopify.com/s/files/1/0704/8554/0995/files/slide2.avif?v=1777792796",
    overlayFrom: "rgba(50, 15, 75, 0.72)",
    overlayTo: "rgba(28, 6, 48, 0.38)",
  },
];

const TRUST_BADGES = [
  "Certified Jewel",
  "Easy Returns",
  "Secure Payments",
];

// ── Animation variants ────────────────────────────────────────────────────────
const imageVariants = {
  enter: { opacity: 0, scale: 1.06 },
  center: {
    opacity: 1,
    scale: 1,
    transition: { opacity: { duration: 1.4, ease: "easeInOut" }, scale: { duration: 2.2, ease: [0.25, 0.46, 0.45, 0.94] } },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: { opacity: { duration: 0.9, ease: "easeInOut" } },
  },
};

const labelVariants = {
  hidden: { opacity: 0, y: 12, letterSpacing: "0.05em" },
  visible: { opacity: 1, y: 0, letterSpacing: "0.2em", transition: { duration: 0.55, delay: 0.15, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.35 } },
};

const headingVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
  exit: { transition: { staggerChildren: 0.04 } },
};

const wordVariant = {
  hidden: { opacity: 0, y: 28, skewY: 1.5 },
  visible: { opacity: 1, y: 0, skewY: 0, transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.3 } },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.65, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.3 } },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, delay: 0.85, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const badgeContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 1.1 } },
};

const badgeVariant = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// ── Progress bar sub-component ────────────────────────────────────────────────
const ProgressBar = ({ active, duration = 6000 }: { active: boolean; duration?: number }) => (
  <div className="h-[2px] w-full bg-white/20 overflow-hidden rounded-full">
    {active && (
      <motion.div
        className="h-full bg-white origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: duration / 1000, ease: "linear" }}
      />
    )}
  </div>
);

// ── Main Hero component ───────────────────────────────────────────────────────
const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Track image loading state for skeleton animations
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});

  const handleImageLoad = (idx: number) => {
    setImagesLoaded((prev) => ({ ...prev, [idx]: true }));
  };

  const goToSlide = (idx: number, dir?: number) => {
    setDirection(dir ?? (idx > currentSlide ? 1 : -1));
    setCurrentSlide(idx);
  };

  const prev = () => goToSlide((currentSlide - 1 + slides.length) % slides.length, -1);
  const next = () => goToSlide((currentSlide + 1) % slides.length, 1);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentSlide((p) => (p + 1) % slides.length);
    }, 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, currentSlide]);

  const slide = slides[currentSlide];

  return (
    <>
      <section
        className={`relative w-full overflow-hidden aspect-[4/5] md:aspect-[16/9] lg:aspect-[21/9] min-h-[480px] sm:min-h-[540px] md:min-h-0 ${montserrat.className}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >

        {/* ── Background image layer with loading animation ── */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={`slide-bg-${currentSlide}`}
            className="absolute inset-0 z-0 bg-[#230532]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            {/* ── Responsive Image ── */}
            <picture>
              <source media="(max-width: 767px)" srcSet={slide.mobileImage || slide.image} />
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={currentSlide === 0}
                className={`object-cover object-center transition-opacity duration-1000 ${imagesLoaded[currentSlide] ? 'opacity-100' : 'opacity-0'}`}
                sizes="100vw"
                onLoad={() => handleImageLoad(currentSlide)}
              />
            </picture>
          </motion.div>
        </AnimatePresence>

        {/* ── Skeleton Overlay (visible when NOT loaded) ── */}
        {!imagesLoaded[currentSlide] && (
          <div className="absolute inset-0 z-30 flex flex-col justify-center pointer-events-none">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-[62px]">
              <div className="max-w-lg flex flex-col items-start">
                {/* Label skeleton */}
                <div className="h-[18px] w-[140px] bg-white/20 rounded animate-pulse mb-3" />
                {/* Heading skeleton */}
                <div className="h-[56px] w-[90%] bg-white/20 rounded animate-pulse mb-[8px]" />
                <div className="h-[56px] w-[65%] bg-white/20 rounded animate-pulse mb-[16px]" />
                {/* Subtitle skeleton */}
                <div className="h-[22px] w-[85%] bg-white/20 rounded animate-pulse mb-[24px]" />
                {/* Button skeleton */}
                <div className="h-[48px] w-[200px] bg-white/20 rounded-[4px] animate-pulse" />
              </div>
            </div>
            {/* Trust Badges skeleton */}
            <div className="absolute bottom-[60px] md:bottom-[80px] left-0 right-0">
              <div className="max-w-7xl mx-auto px-6 md:px-[62px] flex flex-wrap gap-x-[30px] md:gap-x-[44px] gap-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-[8px]">
                    <div className="w-[26px] h-[26px] rounded-full bg-white/20 animate-pulse" />
                    <div className="w-[110px] h-[16px] rounded bg-white/20 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Animated gradient overlay (purple-tinted like screenshot) ── */}
        <AnimatePresence>
          <motion.div
            key={`overlay-${currentSlide}`}
            className="absolute inset-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{
              background: `linear-gradient(
                105deg,
                ${slide.overlayFrom} 0%,
                ${slide.overlayTo} 55%,
                rgba(10, 0, 20, 0.12) 100%
              )`,
            }}
          />
        </AnimatePresence>

        {/* ── Subtle top vignette ── */}
        <div className="absolute inset-x-0 top-0 h-32 z-10"
          style={{ background: "linear-gradient(to bottom, rgba(20,5,35,0.45) 0%, transparent 100%)" }} />

        {/* ── Bottom fade ── */}
        <div className="absolute inset-x-0 bottom-0 h-40 z-10"
          style={{ background: "linear-gradient(to top, rgba(10,2,20,0.65) 0%, transparent 100%)" }} />

        {/* ── Main content ── */}
        <div className={`absolute inset-0 z-20 flex flex-col justify-center transition-opacity duration-1000 ${imagesLoaded[currentSlide] ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-full max-w-7xl mx-auto px-6 md:px-[62px]">

            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentSlide}`}
                className="max-w-lg flex flex-col items-start"
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Label */}
                <motion.div variants={labelVariants} className="mb-3">
                  <span
                    className="font-montserrat italic"
                    style={{
                      color: "#B6B6B6",
                      fontSize: "18px",
                      textTransform: "uppercase",
                    }}
                  >
                    {slide.label}
                  </span>
                </motion.div>

                {/* Heading — word-by-word stagger */}
                <motion.h1
                  className={`${playfair.className} leading-[1.05] mb-[12px] text-[42px] sm:text-[52px] lg:text-[64px] font-bold text-white`}
                  variants={headingVariants}
                >
                  {slide.title.split("\n").map((line, li) => (
                    <span key={li} className="block">
                      {line.split(" ").map((word, wi) => (
                        <motion.span
                          key={`${li}-${wi}`}
                          variants={wordVariant}
                          className="inline-block mr-[0.25em]"
                        >
                          {word}
                        </motion.span>
                      ))}
                    </span>
                  ))}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  variants={subtitleVariants}
                  className="mb-[24px] text-[#B6B6B6] text-[16px] sm:text-[18px] lg:text-[22px] font-medium max-w-[502px]"
                >
                  {slide.subtitle}
                </motion.p>

                {/* CTA */}
                <motion.div variants={ctaVariants}>
                  <Link
                    href="/collections"
                    className="inline-flex items-center justify-center bg-[#FACE7A] text-[#230532] font-montserrat font-bold text-[18px] rounded-[4px] px-[20px] py-[10px] transition-transform duration-300 hover:scale-105 shadow-md"
                  >
                    Explore Collection
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Trust badges — bottom left ── */}
        <div className={`absolute bottom-6 md:bottom-20 left-0 right-0 z-20 transition-opacity duration-1000 ${imagesLoaded[currentSlide] ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 md:px-[62px]">
            <motion.div
              variants={badgeContainerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-x-[30px] md:gap-x-[44px] gap-y-4"
            >
              {TRUST_BADGES.map((badge, i) => (
                <motion.div
                  key={i}
                  variants={badgeVariant}
                  className="flex items-center gap-[8px]"
                >
                  <span className="text-white">
                    <CheckCircle size={26} />
                  </span>
                  <span className="font-montserrat font-medium text-[16px] text-white whitespace-nowrap">
                    {badge}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Side nav arrows (appear on hover of section) ── */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30
                     w-12 h-12 md:w-10 md:h-10 rounded-full flex items-center justify-center
                     text-white bg-white/10 border border-white/20
                     backdrop-blur-md transition-all duration-200 hover:bg-white/25 hover:scale-110 focus:outline-none"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30
                     w-12 h-12 md:w-10 md:h-10 rounded-full flex items-center justify-center
                     text-white bg-white/10 border border-white/20
                     backdrop-blur-md transition-all duration-200 hover:bg-white/25 hover:scale-110 focus:outline-none"
        >
          <ChevronRight />
        </button>

        {/* ── Bottom indicator strip (removed as per new Figma layout) ── */}

        {/* ── Dot indicators (centered) ── */}
        <div className="absolute bottom-[23px] left-1/2 -translate-x-1/2 flex items-center gap-[6px] z-30">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="group p-[2px] focus:outline-none flex items-center justify-center"
            >
              <motion.span
                animate={{
                  backgroundColor: currentSlide === idx ? "#230532" : "#FFFFFF",
                  borderColor: currentSlide === idx ? "#b012ff" : "#FFFFFF",
                }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="block w-[12px] h-[12px] rounded-[6px] border-[0.4px] border-solid"
              />
            </button>
          ))}
        </div>

      </section>
    </>
  );
};

export default Hero;