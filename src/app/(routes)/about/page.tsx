"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Playfair_Display, Cormorant_Garamond, Jost } from "next/font/google";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ShieldCheck, Tag, Gem, RefreshCw } from "lucide-react";

// Fonts
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
});

// CSS Variables & Global Settings
const styleVars = {
  "--ivory": "#FAF7F2",
  "--ivory-deep": "#F2EDE4",
  "--noir": "#0D0D0D",
  "--noir-soft": "#1C1A17",
  "--gold": "#B8860B",
  "--gold-light": "#D4A843",
  "--gold-muted": "#C9A84C",
  "--gold-gradient": "linear-gradient(135deg, #B8860B 0%, #D4A843 50%, #B8860B 100%)",
  "--stone": "#6B6560",
  "--stone-light": "#9C958F",
  "--border-warm": "rgba(184,134,11,0.15)",
} as React.CSSProperties;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Custom stat counter hook
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue]);

  return <span>{displayValue}</span>;
}

// Fallback Image component mimicking next/image but using native <img>
const FallbackImg = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[var(--gold-muted)]/10 animate-pulse ${className}`}>
      {!error && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-[var(--gold)]/50 font-jost text-sm">
          Image not available
        </div>
      )}
    </div>
  );
};

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div
      style={styleVars}
      className={`${playfair.variable} ${cormorant.variable} ${jost.variable} font-jost text-[var(--noir)] selection:bg-[var(--gold)] selection:text-[var(--noir)] bg-[var(--ivory)] overflow-hidden motion-reduce:transform-none motion-reduce:transition-none`}
      suppressHydrationWarning
    >
      <style dangerouslySetInnerHTML={{__html: `
        html { scroll-behavior: smooth; }
        .font-playfair { font-family: var(--font-playfair), serif; }
        .font-cormorant { font-family: var(--font-cormorant), serif; }
        .font-jost { font-family: var(--font-jost), sans-serif; }
      `}} />

      {/* SECTION 1: CINEMATIC HERO */}
      <section className="relative min-h-screen flex items-center justify-center bg-[var(--noir)] text-white py-32 overflow-hidden z-0">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <svg className="w-full h-full opacity-30">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>
        
        {/* Animated background detail */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[var(--gold)] rounded-full blur-[150px] opacity-10 animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-[var(--gold-light)] rounded-full blur-[150px] opacity-[0.05]" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative z-10 text-center max-w-4xl mx-auto px-6 h-full flex flex-col items-center justify-center"
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <span className="text-[var(--gold)] uppercase tracking-[0.2em] text-sm font-semibold">
              EST. 1997 · TIRUNELVELI
            </span>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="w-[80px] h-[2px] bg-[var(--gold)] mx-auto mb-10 overflow-hidden relative">
            <motion.div 
              className="absolute inset-0 bg-white/50" 
              animate={{ x: ["-100%", "100%"] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </motion.div>

          <motion.h1 variants={fadeInUp} className="font-playfair text-5xl md:text-7xl lg:text-[80px] leading-tight mb-8">
            Where Gold Meets <br />
            <span className="italic font-light">Generations of Trust</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="font-cormorant italic text-[var(--stone-light)] text-xl md:text-2xl max-w-2xl mx-auto mb-14 leading-relaxed">
            For over two decades, Bagyalakshmi Jewellers has adorned families across Tamil Nadu with handcrafted gold, diamond, and silver jewellery — built on purity, pride, and tradition.
          </motion.p>

          <motion.div variants={fadeInUp} className="mb-14 opacity-80">
            <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 0L64.5 9.5H74.5L66.5 15L69.5 24L60 18.5L50.5 24L53.5 15L45.5 9.5H55.5L60 0Z" fill="var(--gold)"/>
              <line x1="0" y1="12" x2="40" y2="12" stroke="var(--gold)" strokeWidth="1"/>
              <line x1="80" y1="12" x2="120" y2="12" stroke="var(--gold)" strokeWidth="1"/>
            </svg>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-6 justify-center">
            <Link 
              href="#our-story" 
              className="px-8 py-4 bg-[var(--gold)] text-[var(--noir)] font-medium tracking-wide hover:bg-[var(--gold-light)] transition-all duration-300 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:ring-offset-2 focus:ring-offset-[var(--noir)]"
              aria-label="Scroll to Our Story"
            >
              Explore Our Story
            </Link>
            <Link 
              href="/collections" 
              className="px-8 py-4 border border-[var(--gold)] text-[var(--gold)] font-medium tracking-wide hover:bg-[var(--gold)]/10 transition-all duration-300 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:ring-offset-2 focus:ring-offset-[var(--noir)]"
              aria-label="View Collections"
            >
              View Collections
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: LEGACY STATS BAR */}
      <section className="w-full bg-[var(--gold-gradient)] py-12 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[var(--noir)]/20 text-[var(--noir)] text-center"
          >
            {[
              { value: 25, suffix: "+", label: "Years Legacy" },
              { value: 10000, suffix: "+", label: "Happy Families" },
              { value: 3, suffix: "", label: "Generations" },
              { value: 100, suffix: "%", label: "BIS Certified" },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="w-full pt-6 md:pt-0 px-4">
                <div className="font-playfair text-5xl md:text-6xl font-bold mb-2">
                  <AnimatedCounter value={stat.value} />{stat.suffix}
                </div>
                <div className="font-jost uppercase text-sm tracking-[0.15em] font-medium opacity-80">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: ORIGIN STORY */}
      <section id="our-story" className="py-24 md:py-32 bg-[var(--ivory)] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24"
          >
            {/* Left side: Image */}
            <motion.div variants={fadeInUp} className="w-full lg:w-[55%] relative">
              <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 transform -rotate-[1.5deg] border-[12px] border-[#FFFDF8] shadow-[8px_8px_0px_var(--gold-muted)]">
                <FallbackImg 
                  src="https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1200&auto=format&fit=crop" 
                  alt="Original Bagyalakshmi Jewellers store"
                />
                {/* Decorative leaf */}
                <div className="absolute -top-6 -right-6 text-[var(--gold)] w-12 h-12 bg-[var(--ivory)] rounded-full flex items-center justify-center shadow-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-14c-1.88 0-3.66.76-4.95 2.05A7.03 7.03 0 005.31 13h2.15c.18-1.57.91-3 2.04-4.14A4.95 4.95 0 0113 7.42V6z"/>
                  </svg>
                </div>
              </div>
              <p className="mt-8 text-center lg:text-left font-cormorant italic text-[var(--stone-light)] text-lg">
                Our founder, 1997
              </p>
            </motion.div>

            {/* Right side: Text */}
            <motion.div variants={fadeInUp} className="w-full lg:w-[45%]">
              <span className="text-[var(--gold)] uppercase tracking-[0.2em] text-sm font-semibold mb-6 block">OUR STORY</span>
              <h2 className="font-playfair text-4xl md:text-5xl text-[var(--noir)] mb-8 leading-tight">
                From a Small Shop to a Trusted Legacy
              </h2>
              <div className="font-jost font-light text-[var(--stone)] text-lg leading-[1.9] space-y-6 mb-10">
                <p>
                  Bagyalakshmi Jewellers began in Tirunelveli's vibrant Koolakkadai Bazaar in 1997 with a simple yet profound vision: to provide pure, hallmarked jewellery to every family.
                </p>
                <p>
                  Through word-of-mouth, unwavering trust, and consistent quality, our small shop grew into becoming the go-to jeweller for weddings, festivals, and daily wear across Tamil Nadu. We believe that true luxury lies in honesty and pristine craftsmanship.
                </p>
              </div>
              
              <div className="relative pl-8 mb-8 border-l-2 border-[var(--gold-muted)]">
                <p className="font-cormorant italic text-[28px] text-[var(--gold)] leading-snug">
                  "Every ornament we craft carries the weight of your trust and the warmth of our tradition."
                </p>
              </div>
              
              <div className="w-20 h-px bg-[var(--gold)]" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: TRUST PILLARS */}
      <section className="py-24 md:py-32 bg-[var(--noir-soft)] text-white relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.span variants={fadeInUp} className="text-[var(--gold-muted)] uppercase tracking-[0.2em] text-sm font-semibold mb-4 block">
              WHY FAMILIES TRUST US
            </motion.span>
            <motion.h2 variants={fadeInUp} className="font-playfair text-4xl md:text-[42px] text-white">
              Our Promises to You
            </motion.h2>
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: <ShieldCheck size={32} className="text-[var(--noir)]" strokeWidth={1.5} />,
                title: "100% BIS Hallmarked",
                desc: "Every piece of gold jewellery is certified under India's Bureau of Indian Standards, guaranteeing purity you can trust.",
              },
              {
                icon: <Tag size={32} className="text-[var(--noir)]" strokeWidth={1.5} />,
                title: "Zero Hidden Charges",
                desc: "What you see is what you pay. Honest making charges, live rate pricing, and no surprise fees — ever.",
              },
              {
                icon: <Gem size={32} className="text-[var(--noir)]" strokeWidth={1.5} />,
                title: "IGI/GIA Certified Stones",
                desc: "All diamonds and precious gemstones come with independent certification for authenticity, cut, and carat.",
              },
              {
                icon: <RefreshCw size={32} className="text-[var(--noir)]" strokeWidth={1.5} />,
                title: "Lifetime Exchange",
                desc: "Upgrade or exchange your jewellery anytime. We stand behind every piece we sell, long after you leave the store.",
              }
            ].map((card, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                className="group p-8 border border-[var(--gold)]/20 bg-white/[0.04] backdrop-blur-[8px] hover:border-[var(--gold)]/60 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(184,134,11,0.1)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              >
                <div className="w-16 h-16 rounded-2xl bg-[var(--gold-gradient)] flex items-center justify-center mb-8 shadow-inner">
                  {card.icon}
                </div>
                <h3 className="font-playfair text-xl text-white mb-4">{card.title}</h3>
                <p className="font-jost font-light text-[var(--stone-light)] leading-relaxed text-[15px]">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: CRAFTSMANSHIP DEEP DIVE */}
      <section className="py-24 md:py-32 bg-[var(--ivory)] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24"
          >
            {/* Left side: Timeline Text */}
            <motion.div variants={fadeInUp} className="w-full lg:w-1/2 order-2 lg:order-1">
              <span className="text-[var(--gold)] uppercase tracking-[0.2em] text-sm font-semibold mb-6 block">THE ART OF MAKING</span>
              <h2 className="font-playfair text-4xl md:text-[40px] text-[var(--noir)] mb-12 leading-tight">
                Crafted by Hand. <br/>Born from Tradition.
              </h2>
              
              <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:inset-y-0 before:left-3 sm:before:left-[19px] before:w-px before:bg-[var(--gold)]/30">
                {[
                  {
                    num: "1",
                    title: "Design & Conception",
                    desc: "Every piece begins with a hand-drawn sketch, inspired by classical South Indian temple jewellery patterns and contemporary aesthetics."
                  },
                  {
                    num: "2",
                    title: "Material Selection",
                    desc: "Only 22KT and 18KT gold sourced from verified refineries. Gemstones hand-selected for colour, clarity and brilliance."
                  },
                  {
                    num: "3",
                    title: "Master Craftsmanship",
                    desc: "Our artisans, trained over decades, shape each ornament with precision tools and traditional techniques passed down through generations."
                  }
                ].map((step, i) => (
                  <motion.div key={i} variants={fadeInUp} className="relative">
                    <div className="absolute -left-[45px] sm:-left-[59px] top-0 w-10 h-10 rounded-full bg-[var(--gold-gradient)] flex items-center justify-center text-white font-playfair font-bold text-lg shadow-md ring-4 ring-[var(--ivory)]">
                      {step.num}
                    </div>
                    <h3 className="font-jost font-medium text-xl text-[var(--noir)] mb-3">{step.title}</h3>
                    <p className="font-jost font-light text-[var(--stone)] text-[17px] leading-relaxed max-w-[420px]">
                      {step.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right side: Layered Images */}
            <motion.div variants={fadeInUp} className="w-full lg:w-1/2 order-1 lg:order-2 relative mt-10 lg:mt-0 px-4">
              <div className="relative aspect-[3/4] w-full max-w-[400px] mx-auto lg:mr-0 lg:ml-auto transform rotate-[1.5deg] border-[8px] sm:border-[12px] border-[#FFFDF8] shadow-[8px_8px_0px_var(--gold-muted)] z-10">
                <FallbackImg 
                  src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=1000&auto=format&fit=crop" 
                  alt="Artisan hands crafting jewelry"
                />
              </div>
              <div className="absolute -bottom-12 -left-4 sm:left-10 lg:-left-10 w-[200px] sm:w-[260px] aspect-square transform -rotate-3 border-[8px] sm:border-[12px] border-[#FFFDF8] shadow-lg z-20">
                <FallbackImg 
                  src="https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop" 
                  alt="Gold necklace close up"
                />
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* SECTION 6: COLLECTIONS TEASER */}
      <section className="py-24 md:py-32 bg-[var(--ivory-deep)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="text-[var(--gold)] uppercase tracking-[0.2em] text-sm font-semibold mb-4 block">
              WHAT WE OFFER
            </motion.span>
            <motion.h2 variants={fadeInUp} className="font-playfair text-4xl md:text-[42px] text-[var(--noir)]">
              A Legacy for Every Occasion
            </motion.h2>
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16"
          >
            {[
              { title: "Gold Jewellery", desc: "Necklaces, bangles, earrings, chains", img: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop" },
              { title: "Diamond Jewellery", desc: "Rings, pendants, solitaires", img: "https://images.unsplash.com/photo-1574542385806-6bd4bdaf3a24?q=80&w=800&auto=format&fit=crop" },
              { title: "Bridal Sets", desc: "Full bridal collection, kasu mala", img: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?q=80&w=800&auto=format&fit=crop" },
            ].map((col, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="group relative aspect-[2/3] overflow-hidden cursor-pointer rounded-sm bg-[var(--gold-muted)]/20 focus-within:ring-2 focus-within:ring-[var(--gold)] focus-within:ring-offset-2">
                <FallbackImg src={col.img} alt={col.title} className="transition-transform duration-[0.8s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--noir)]/90 via-[var(--noir)]/30 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="font-playfair text-3xl text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-500">
                    {col.title}
                  </h3>
                  <p className="font-jost font-light text-[var(--ivory-deep)] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:-translate-y-2 transition-all duration-500 text-sm">
                    {col.desc}
                  </p>
                  <p className="font-jost text-[var(--gold-light)] text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:-translate-y-2 transition-all duration-500 delay-100 flex items-center gap-2">
                    Explore Collection <span aria-hidden="true">&rarr;</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeInUp} 
            className="text-center"
          >
            <Link 
              href="/collections" 
              className="inline-block px-10 py-4 bg-[var(--gold)] text-[var(--noir)] font-medium tracking-wide hover:bg-[var(--gold-light)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:ring-offset-2 focus:ring-offset-[var(--ivory-deep)]"
              aria-label="Browse full collections"
            >
              Browse Full Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SECTION 7: SOCIAL PROOF */}
      <section className="py-24 md:py-32 bg-[var(--noir)] text-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.span variants={fadeInUp} className="text-[var(--gold-muted)] uppercase tracking-[0.2em] text-sm font-semibold mb-4 block">
              CUSTOMER STORIES
            </motion.span>
            <motion.h2 variants={fadeInUp} className="font-playfair text-4xl md:text-[40px] mb-6">
              Trusted by Thousands of Families
            </motion.h2>
            <motion.p variants={fadeInUp} className="font-jost text-[var(--stone-light)] text-lg max-w-2xl mx-auto font-light">
              From first earrings to bridal trousseau — our customers return for every milestone.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                text: "We've been buying jewellery from Bagyalakshmi for our family weddings for 15 years. The quality is unmatched and the staff is incredibly trustworthy.",
                name: "Meenakshi R.", loc: "Tirunelveli", init: "MR"
              },
              {
                text: "Got my bridal set made here. Every single piece was perfect — pure gold, beautiful design, and delivered on time. Couldn't be happier.",
                name: "Kavitha S.", loc: "Nagercoil", init: "KS"
              },
              {
                text: "Transparent pricing and genuine hallmarked gold. I've checked multiple shops — nobody comes close to the trust and value Bagyalakshmi offers.",
                name: "Rajendran M.", loc: "Madurai", init: "RM"
              }
            ].map((review, i) => (
              <motion.div key={i} variants={fadeInUp} className="group relative bg-[var(--noir-soft)] p-8 border-b-2 border-[var(--gold-muted)] hover:shadow-[0_0_30px_rgba(184,134,11,0.08)] transition-shadow duration-500">
                <div className="absolute top-2 left-6 font-playfair text-[120px] text-[var(--gold)] opacity-15 leading-none select-none" aria-hidden="true">
                  &ldquo;
                </div>
                <div className="relative z-10">
                  <div className="flex text-[var(--gold)] mb-6 text-sm" aria-label="5 out of 5 stars">
                    ★★★★★
                  </div>
                  <p className="font-cormorant italic text-[19px] leading-[1.8] text-white/90 mb-8 min-h-[140px]">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--gold-gradient)] flex items-center justify-center text-[var(--noir)] font-playfair font-bold text-lg" aria-hidden="true">
                      {review.init}
                    </div>
                    <div>
                      <h4 className="font-jost font-medium text-[var(--gold)]">{review.name}</h4>
                      <p className="font-jost text-[var(--stone-light)] text-sm">{review.loc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 8: MEET THE TEAM / HERITAGE */}
      <section className="py-24 md:py-32 bg-[var(--ivory)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24"
          >
            {/* Left side: Founder Portrait */}
            <motion.div variants={fadeInUp} className="w-full lg:w-[45%]">
              <div className="relative aspect-[3/4] w-full max-w-sm mx-auto p-4 border border-[var(--gold)]/30 bg-white shadow-xl">
                <FallbackImg 
                  src="https://images.unsplash.com/photo-1507676184212-d035043a9689?q=80&w=800&auto=format&fit=crop" 
                  alt="Founder of Bagyalakshmi Jewellers" 
                  className="filter sepia-[0.3] contrast-[1.1]"
                />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[var(--noir)] text-white px-8 py-3 text-center whitespace-nowrap shadow-xl min-w-[280px]">
                  <h3 className="font-playfair text-xl mb-1 text-[var(--gold)]">Sri Bagyalakshmi</h3>
                  <p className="font-jost text-xs uppercase tracking-[0.1em] opacity-80">Founder & Visionary</p>
                </div>
              </div>
            </motion.div>

            {/* Right side: Heritage Content */}
            <motion.div variants={fadeInUp} className="w-full lg:w-[55%] mt-12 lg:mt-0">
              <span className="text-[var(--gold)] uppercase tracking-[0.2em] text-sm font-semibold mb-6 block">THE PEOPLE BEHIND THE GOLD</span>
              <h2 className="font-playfair text-4xl md:text-5xl text-[var(--noir)] mb-8 leading-tight">
                A Family Business <br/>Built on Values
              </h2>
              <p className="font-jost font-light text-[var(--stone)] text-lg leading-[1.8] mb-12 max-w-[500px]">
                We don't just sell jewellery; we build relationships. Our founding family personally oversees sourcing, crafting, and quality control. When you step into our showroom, you aren't just a customer — you're welcomed as part of the Bagyalakshmi family.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: "🤝", text: "Personal Relationship with Every Customer" },
                  { icon: "🎓", text: "40+ Years of Combined Jewellery Expertise" },
                  { icon: "📍", text: "Rooted in Tirunelveli, Trusted Across TN" },
                ].map((val, idx) => (
                  <div key={idx} className="flex items-center gap-5 p-5 bg-white shadow-sm border border-[var(--border-warm)]">
                    <span className="text-2xl" aria-hidden="true">{val.icon}</span>
                    <span className="font-jost font-medium text-[var(--noir)] lg:text-lg">{val.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 9: CONVERSION CTA */}
      <section className="py-24 md:py-32 bg-[var(--gold-gradient)] text-center px-6 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-white/5 opacity-50 mix-blend-overlay pointer-events-none" />
        
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="mb-8 opacity-80 flex justify-center">
            <svg width="80" height="16" viewBox="0 0 80 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 0L43 6H50L44 10L46 16L40 12L34 16L36 10L30 6H37L40 0Z" fill="var(--noir)"/>
              <line y1="8" x2="25" y2="8" stroke="var(--noir)" strokeWidth="1"/>
              <line x1="55" y1="8" x2="80" y2="8" stroke="var(--noir)" strokeWidth="1"/>
            </svg>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-playfair text-[42px] md:text-6xl text-[var(--noir)] mb-6 leading-tight">
            Your Story Begins <br/>with the Right Jewel
          </motion.h2>

          <motion.p variants={fadeInUp} className="font-cormorant italic text-xl md:text-2xl text-[var(--noir-soft)] mb-12 max-w-2xl mx-auto opacity-90">
            Visit us at Koolakkadai Bazaar, Tirunelveli or reach out — we'd love to be part of your most precious moments.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
            <Link 
              href="/contact" 
              className="w-full sm:w-auto px-8 py-4 bg-[var(--noir)] text-white font-medium tracking-wide hover:bg-[var(--noir-soft)] transition-colors focus:ring-2 focus:ring-[var(--noir)] focus:ring-offset-2 focus:ring-offset-[var(--gold)]"
            >
              Visit Our Store
            </Link>
            <Link 
              href="/collections" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-[var(--noir)] font-medium tracking-wide hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--gold)]"
            >
              Shop Collections
            </Link>
            <a 
              href="https://wa.me/919790790527" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:w-auto px-8 py-4 bg-[#25D366] text-white font-medium tracking-wide hover:bg-[#20bd5a] transition-colors focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-[var(--gold)] flex items-center justify-center gap-2"
              aria-label="WhatsApp Us (opens in new tab)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
          </motion.div>

          <motion.div variants={fadeInUp} className="font-jost text-[var(--noir-soft)] text-sm tracking-wide opacity-80">
            📍 57A/12, Koolakkadai Bazaar, Tirunelveli 627006 &nbsp;|&nbsp; 📞 +91 97907 90527
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
