"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

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
    image: "https://cdn.shopify.com/s/files/1/0704/8554/0995/files/slide1.avif?v=1773641439",
    // Deep violet/purple tinted overlay — matches screenshot exactly
    overlayFrom: "rgba(58, 20, 80, 0.72)",
    overlayTo: "rgba(30, 8, 50, 0.40)",
  },
  {
    id: 1,
    label: "NEW ARRIVALS",
    title: "The Golden\nHour",
    subtitle: "18KT gold plated essentials to elevate your everyday style.",
    image: "https://cdn.shopify.com/s/files/1/0704/8554/0995/files/slilde3.avif?v=1773641440",
    overlayFrom: "rgba(45, 18, 65, 0.75)",
    overlayTo: "rgba(25, 8, 45, 0.38)",
  },
  {
    id: 2,
    label: "GIFTING",
    title: "Timeless\nBonds",
    subtitle: "Gifts that last a lifetime, crafted with pure love.",
    image: "https://cdn.shopify.com/s/files/1/0704/8554/0995/files/slide2.avif?v=1777792796",
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

  // Parallax mouse tracking
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 40, damping: 25 });
  const springY = useSpring(rawY, { stiffness: 40, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * -18;
    const y = (e.clientY / window.innerHeight - 0.5) * -12;
    rawX.set(x);
    rawY.set(y);
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
      {/* ── Google Font import (Playfair Display + Montserrat) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Montserrat:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .hero-title { font-family: 'Playfair Display', serif; }
        .hero-subtitle  { font-family: 'Montserrat', sans-serif; }

        /* Nav arrow buttons */
        .nav-arrow {
          backdrop-filter: blur(8px);
          transition: background 0.2s, transform 0.2s;
        }
        .nav-arrow:hover {
          background: rgba(255,255,255,0.25);
          transform: scale(1.08);
        }
      `}</style>

      <section
        className="relative w-full overflow-hidden hero-subtitle"
        style={{ height: "82vh", minHeight: 580, maxHeight: 820 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          rawX.set(0);
          rawY.set(0);
        }}
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
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={currentSlide === 0}
              className={`object-cover object-center transition-opacity duration-1000 ${imagesLoaded[currentSlide] ? 'opacity-100' : 'opacity-0'}`}
              sizes="100vw"
              onLoad={() => handleImageLoad(currentSlide)}
            />
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
                  className="hero-title leading-tight mb-[12px]"
                  style={{
                    color: "#FFFFFF",
                    fontSize: "clamp(3rem, 5vw, 56px)",
                    fontWeight: 700,
                  }}
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
                  className="font-montserrat mb-[24px]"
                  style={{
                    color: "#B6B6B6",
                    fontSize: "clamp(1rem, 2vw, 22px)",
                    fontWeight: 500,
                    maxWidth: "502px"
                  }}
                >
                  {slide.subtitle}
                </motion.p>

                {/* CTA */}
                <motion.div variants={ctaVariants}>
                  <Link
                    href="/shop"
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
        <div className={`absolute bottom-[60px] md:bottom-[80px] left-0 right-0 z-20 transition-opacity duration-1000 ${imagesLoaded[currentSlide] ? 'opacity-100' : 'opacity-0'}`}>
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
          className="nav-arrow absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30
                     w-10 h-10 rounded-full flex items-center justify-center
                     text-white bg-white/10 border border-white/20"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="nav-arrow absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30
                     w-10 h-10 rounded-full flex items-center justify-center
                     text-white bg-white/10 border border-white/20"
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