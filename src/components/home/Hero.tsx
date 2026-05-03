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
      {/* ── Google Font import (Playfair Display + DM Sans) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-title { font-family: 'Playfair Display', Georgia, serif; }
        .hero-body  { font-family: 'DM Sans', system-ui, sans-serif; }

        /* Gold shimmer button */
        @keyframes goldShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .btn-gold {
          background: linear-gradient(
            105deg,
            #D4A843 0%,
            #F5D47A 30%,
            #E8B84B 50%,
            #F5D47A 70%,
            #D4A843 100%
          );
          background-size: 200% auto;
          transition: background-position 0.5s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .btn-gold:hover {
          background-position: right center;
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 12px 32px rgba(212, 168, 67, 0.45);
        }
        .btn-gold:active { transform: translateY(0) scale(0.99); }

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
        className="relative w-full overflow-hidden hero-body"
        style={{ height: "82vh", minHeight: 580, maxHeight: 820 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          rawX.set(0);
          rawY.set(0);
        }}
      >

        {/* ── Background image layer with parallax ── */}
        <AnimatePresence initial={false} custom={direction}>

          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={currentSlide === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
        </AnimatePresence>

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
        <div className="absolute inset-0 z-20 flex flex-col justify-center">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentSlide}`}
                className="max-w-lg flex flex-col items-start"
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Label */}
                <motion.div variants={labelVariants} className="flex items-center gap-2 mb-4">
                  {/* Decorative line */}
                  <motion.span
                    className="block h-px bg-[#F5D47A] opacity-80"
                    initial={{ width: 0 }}
                    animate={{ width: 28 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                  <span
                    className="text-[11px] md:text-xs font-medium"
                    style={{
                      letterSpacing: "0.22em",
                      color: "rgba(245,212,122,0.92)",
                      textTransform: "uppercase",
                      fontStyle: "italic",
                    }}
                  >
                    {slide.label}
                  </span>
                </motion.div>

                {/* Heading — word-by-word stagger */}
                <motion.h1
                  className="hero-title text-white leading-[1.08] mb-5"
                  style={{
                    fontSize: "clamp(2.6rem, 6vw, 4.2rem)",
                    fontWeight: 700,
                    textShadow: "0 2px 24px rgba(0,0,0,0.35)",
                    letterSpacing: "-0.01em",
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
                  className="text-white/85 font-light leading-relaxed mb-8"
                  style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)", maxWidth: "88%" }}
                >
                  {slide.subtitle}
                </motion.p>

                {/* CTA */}
                <motion.div variants={ctaVariants}>
                  <Link
                    href="/shop"
                    className="btn-gold inline-flex items-center gap-2 px-7 py-3 rounded-md font-semibold text-stone-900 text-sm"
                    style={{ letterSpacing: "0.03em" }}
                  >
                    Explore Collection
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 1.5 }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Trust badges — bottom left ── */}
        <div className="absolute bottom-16 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <motion.div
              variants={badgeContainerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-x-6 gap-y-2"
            >
              {TRUST_BADGES.map((badge, i) => (
                <motion.div
                  key={i}
                  variants={badgeVariant}
                  className="flex items-center gap-2 text-white/90"
                  style={{ fontSize: "0.82rem", letterSpacing: "0.01em" }}
                >
                  <span className="text-[#F5D47A]">
                    <CheckCircle size={15} />
                  </span>
                  <span className="font-light">{badge}</span>
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

        {/* ── Bottom indicator strip ── */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-4">
            <div className="flex items-center gap-3">
              {slides.map((s, idx) => (
                <div key={idx} className="flex-1 max-w-[56px]">
                  <ProgressBar active={currentSlide === idx} duration={6000} />
                </div>
              ))}
              {/* Slide counter */}
              <span className="text-white/50 text-xs ml-2 font-light tabular-nums">
                {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* ── Dot indicators (centered, above progress strip) ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="group p-1.5 focus:outline-none"
            >
              <motion.span
                animate={{
                  width: currentSlide === idx ? 20 : 6,
                  opacity: currentSlide === idx ? 1 : 0.4,
                }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="block h-[3px] rounded-full bg-white"
                style={{ display: "block" }}
              />
            </button>
          ))}
        </div>

      </section>
    </>
  );
};

export default Hero;