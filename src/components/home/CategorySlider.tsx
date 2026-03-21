"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Collection } from "@/types/shopify/collection";
import { Sparkles, ArrowRight, Image as ImageIcon } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────── */
interface CategorySliderProps {
  collections: Collection[];
  promoBanners?: BannerData[];
}

interface BannerData {
  bg: string;
  bgColor: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  tag?: string;
}

/* ─────────────────────────────────────────────────────────────────────
   Colour schemes — warm jewellery palette
───────────────────────────────────────────────────────────────────── */
const SCHEMES = [
  { ring: "#C9A96E", bg: "#FBF7F0", glow: "rgba(201,169,110,0.4)" },
  { ring: "#B07D57", bg: "#FAF4EF", glow: "rgba(176,125,87,0.35)" },
  { ring: "#9B8EA8", bg: "#F5F2F8", glow: "rgba(155,142,168,0.35)" },
  { ring: "#7EADA6", bg: "#F0F7F6", glow: "rgba(126,173,166,0.35)" },
  { ring: "#C98B8B", bg: "#FAF0F0", glow: "rgba(201,139,139,0.35)" },
  { ring: "#A09060", bg: "#F8F5EC", glow: "rgba(160,144,96,0.35)" },
  { ring: "#8A8A6E", bg: "#F5F5EE", glow: "rgba(138,138,110,0.35)" },
];

/* ─────────────────────────────────────────────────────────────────────
   Default banners
───────────────────────────────────────────────────────────────────── */
const DEFAULT_BANNERS: BannerData[] = [
  {
    bg: "https://cdn.shopify.com/s/files/1/0704/8554/0995/files/slilde3.avif?v=1773641440",
    bgColor: "#EDE0D4",
    tag: "20% Off",
    title: "Fine rings\nfor every occasion",
    subtitle: "Get 20% off your first purchase",
    cta: "Shop Now",
    href: "/collections/rings",
  },
  {
    bg: "https://cdn.shopify.com/s/files/1/0704/8554/0995/files/slilde3.avif?v=1773641440",
    bgColor: "#DDDAF5",
    tag: "New Arrivals",
    title: "Layered\nnecklaces",
    subtitle: "New arrivals — limited edition",
    cta: "Shop Now",
    href: "/collections/necklaces",
  },
  {
    bg: "https://cdn.shopify.com/s/files/1/0704/8554/0995/files/slilde3.avif?v=1773641440",
    bgColor: "#C8DDD8",
    tag: "Handcrafted",
    title: "Statement\nearrings",
    subtitle: "Handcrafted with natural stones",
    cta: "Shop Now",
    href: "/collections/earrings",
  },
];

/* ─────────────────────────────────────────────────────────────────────
   CategoryBubble
───────────────────────────────────────────────────────────────────── */
const CategoryBubble = ({
  collection,
  scheme,
  index,
}: {
  collection: Collection;
  scheme: (typeof SCHEMES)[0];
  index: number;
}) => {
  const [hov, setHov] = useState(false);
  const image = collection.image?.url || "";

  return (
    <Link href={`/collections/${collection.handle}`} className="block focus:outline-none">
      <div
        className="relative flex flex-col items-center gap-4"
        style={{
          animation: "catUp 0.55s cubic-bezier(0.22,1,0.36,1) both",
          animationDelay: `${index * 70}ms`,
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          transform: hov ? "translateY(-9px)" : "translateY(0)",
          cursor: "pointer",
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        {/* Sparkle pop */}
        <div
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            transition: "opacity 0.4s, transform 0.4s",
            opacity: hov ? 1 : 0,
            transform: hov ? "scale(1)" : "scale(0)",
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          <Sparkles size={15} style={{ color: "#C9A96E" }} className="animate-pulse" />
        </div>

        {/* Circle stack */}
        <div style={{ position: "relative", width: 110, height: 110 }}>
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: scheme.glow,
              filter: "blur(18px)",
              transform: "scale(1.5)",
              opacity: hov ? 1 : 0.3,
              transition: "opacity 0.5s",
              pointerEvents: "none",
            }}
          />

          {/* Rotating dashed ring */}
          <div
            style={{
              position: "absolute",
              inset: -12,
              borderRadius: "50%",
              border: `1.5px dashed ${scheme.ring}`,
              opacity: hov ? 0.75 : 0,
              transition: "opacity 0.6s",
              animation: hov ? "catSpin 12s linear infinite" : "none",
              pointerEvents: "none",
            }}
          />

          {/* Gradient border shell */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              padding: 2.5,
              background: hov
                ? `linear-gradient(135deg, ${scheme.ring} 0%, #F0E0C0 50%, ${scheme.ring} 100%)`
                : "linear-gradient(135deg, #E2D9CE, #CEC4B8)",
              transition: "background 0.5s",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: scheme.bg,
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Radial tint */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 40% 40%, ${scheme.glow}, transparent 70%)`,
                  opacity: hov ? 1 : 0,
                  transition: "opacity 0.4s",
                  pointerEvents: "none",
                }}
              />

              {image ? (
                <Image
                  src={image}
                  alt={collection.title}
                  fill
                  className="object-cover"
                  style={{
                    mixBlendMode: "multiply",
                    transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
                    transform: hov ? "scale(1.13) rotate(6deg)" : "scale(1) rotate(0deg)",
                  }}
                  sizes="110px"
                />
              ) : (
                <ImageIcon
                  size={30}
                  strokeWidth={1.2}
                  style={{
                    color: scheme.ring,
                    transition: "transform 0.4s",
                    transform: hov ? "scale(1.15) rotate(6deg)" : "scale(1)",
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Label */}
        <div className="text-center" style={{ minWidth: 88 }}>
          <span
            style={{
              display: "block",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
              fontSize: "0.88rem",
              letterSpacing: "0.05em",
              color: hov ? "#2C2218" : "#4A3F35",
              transition: "color 0.3s",
            }}
          >
            {collection.title}
          </span>
          <span
            style={{
              display: "block",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.68rem",
              letterSpacing: "0.08em",
              color: scheme.ring,
              marginTop: 4,
              opacity: hov ? 1 : 0,
              transform: hov ? "translateY(0)" : "translateY(5px)",
              transition: "opacity 0.35s, transform 0.35s",
            }}
          >
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   PromoBannerCard — bold asymmetric / modern
   • Horizontal split grid: text pane ↔ image pane
   • Cards alternate: even = image-right, odd = image-left (zigzag)
   • Diagonal clipPath on image pane for the asymmetric cut
   • Editorial underline CTA (no pill button)
   • Ghost index number as decorative layer
───────────────────────────────────────────────────────────────────── */
const PromoBannerCard = ({
  banner,
  index,
}: {
  banner: BannerData;
  index: number;
}) => {
  const [hov, setHov] = useState(false);
  const imageRight = index % 2 === 0;

  return (
    <Link
      href={banner.href}
      className="block focus:outline-none"
      style={{
        animation: "catUp 0.65s cubic-bezier(0.22,1,0.36,1) both",
        animationDelay: `${index * 150}ms`,
      }}
    >
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "relative",
          borderRadius: 24,
          overflow: "hidden",
          background: banner.bgColor,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "clamp(240px, 26vw, 360px)",
          boxShadow: hov
            ? "0 28px 56px rgba(0,0,0,0.13)"
            : "0 4px 20px rgba(0,0,0,0.07)",
          transition: "box-shadow 0.4s, transform 0.4s cubic-bezier(0.4,0,0.2,1)",
          transform: hov ? "translateY(-6px)" : "translateY(0)",
          cursor: "pointer",
        }}
      >
        {/* ── Text pane ── */}
        <div
          style={{
            order: imageRight ? 0 : 1,
            padding: "clamp(1.6rem, 3vw, 2.6rem)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Tag pill */}
          {banner.tag && (
            <span
              style={{
                alignSelf: "flex-start",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#2C2218",
                background: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(44,34,24,0.1)",
                borderRadius: 999,
                padding: "0.3rem 0.85rem",
              }}
            >
              {banner.tag}
            </span>
          )}

          {/* Headline + CTA pushed to bottom */}
          <div style={{ marginTop: "auto" }}>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 700,
                fontSize: "clamp(1.4rem, 2.6vw, 2.2rem)",
                lineHeight: 1.1,
                color: "#2C2218",
                letterSpacing: "-0.025em",
                marginBottom: "0.55rem",
              }}
            >
              {banner.title.split("\n").map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h3>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.76rem",
                color: "rgba(44,34,24,0.52)",
                letterSpacing: "0.01em",
                marginBottom: "1.3rem",
                lineHeight: 1.65,
              }}
            >
              {banner.subtitle}
            </p>

            {/* Editorial underline CTA */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: hov ? 12 : 8,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#2C2218",
                borderBottom: "1.5px solid rgba(44,34,24,0.5)",
                paddingBottom: 2,
                transition: "gap 0.25s, border-color 0.25s",
                borderColor: hov ? "#2C2218" : "rgba(44,34,24,0.5)",
              }}
            >
              {banner.cta}
              <ArrowRight
                size={12}
                strokeWidth={2.5}
                style={{
                  transition: "transform 0.25s",
                  transform: hov ? "translateX(4px)" : "translateX(0)",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Image pane with diagonal clip ── */}
        <div
          style={{
            order: imageRight ? 1 : 0,
            position: "relative",
            overflow: "hidden",
            clipPath: imageRight
              ? "polygon(7% 0%, 100% 0%, 100% 100%, 0% 100%)"
              : "polygon(0% 0%, 100% 0%, 93% 100%, 0% 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
              transform: hov ? "scale(1.07)" : "scale(1)",
            }}
          >
            <Image
              src={banner.bg}
              alt={banner.title}
              fill
              className="object-cover"
              style={{ mixBlendMode: "multiply" }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Edge shadow on the diagonal cut */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: imageRight
                ? "linear-gradient(to right, rgba(0,0,0,0.07) 0%, transparent 25%)"
                : "linear-gradient(to left, rgba(0,0,0,0.07) 0%, transparent 25%)",
            }}
          />
        </div>

        {/* Ghost index number */}
        <span
          style={{
            position: "absolute",
            bottom: "1rem",
            right: "1.2rem",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "5.5rem",
            fontWeight: 700,
            lineHeight: 1,
            color: "rgba(44,34,24,0.055)",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 1,
          }}
        >
          0{index + 1}
        </span>
      </div>
    </Link>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   Skeleton loader
───────────────────────────────────────────────────────────────────── */
const SkeletonBubbles = () => (
  <div className="flex flex-wrap justify-center gap-8 md:gap-12">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex flex-col items-center gap-4 animate-pulse">
        <div style={{ width: 110, height: 110, borderRadius: "50%", background: "#EDE8E0" }} />
        <div style={{ width: 68, height: 12, borderRadius: 6, background: "#EDE8E0" }} />
      </div>
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────────────────
   Main export — CategorySlider
───────────────────────────────────────────────────────────────────── */
const CategorySlider = ({
  collections,
  promoBanners = DEFAULT_BANNERS,
}: CategorySliderProps) => {
  if (!collections || collections.length === 0) return null;

  return (
    <>
      <section
        className="relative overflow-hidden py-16 md:py-24"
        style={{ background: "#FAF7F2" }}
      >
        {/* Ambient blobs */}
        <div
          className="pointer-events-none absolute -top-20 -left-20 rounded-full animate-pulse"
          style={{ width: 320, height: 320, background: "#F0DEC8", filter: "blur(60px)", opacity: 0.4 }}
        />
        <div
          className="pointer-events-none absolute bottom-12 right-0 rounded-full animate-pulse"
          style={{ width: 360, height: 360, background: "#DDD4EA", filter: "blur(70px)", opacity: 0.3, animationDelay: "1.3s" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">

          {/* ── Section header ── */}
          <div className="text-center mb-8 md:mb-10">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-3"
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(201,169,110,0.22)",
                boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Sparkles size={13} style={{ color: "#C9A96E" }} />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: "#8A7260",
                }}
              >
                Curated Collections
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2.6rem, 5.5vw, 4rem)",
                fontWeight: 700,
                color: "#2C2218",
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                marginBottom: "0.75rem",
              }}
            >
              Shop by{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #C9A96E 0%, #A0784A 55%, #C9A96E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Category
              </span>
            </h2>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#8A7A6C",
                fontSize: "0.98rem",
                maxWidth: 420,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Discover our handpicked selection of fine jewellery, crafted to last a lifetime.
            </p>
          </div>

          {/* ── Category bubbles ── */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-14 mb-10` md:mb-28">
            {collections.slice(0, 8).map((cat, i) => (
              <CategoryBubble
                key={cat.handle || i}
                collection={cat}
                scheme={SCHEMES[i % SCHEMES.length]}
                index={i}
              />
            ))}
          </div>

          {/* ── Promo banners — stacked column, zigzag layout ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {promoBanners.map((banner, i) => (
              <PromoBannerCard key={i} banner={banner} index={i} />
            ))}
          </div>

        </div>
      </section>

      <style>{`
        @keyframes catUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes catSpin {
          to { transform: rotate(360deg); }
        }
        /* Mobile: stack image above text */
        @media (max-width: 600px) {
          .banner-grid {
            grid-template-columns: 1fr !important;
          }
          .banner-image-pane {
            clip-path: none !important;
            min-height: 200px;
          }
        }
      `}</style>
    </>
  );
};

export default CategorySlider;