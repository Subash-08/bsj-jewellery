import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Playfair_Display, Montserrat } from 'next/font/google'
import { getCollectionUrl } from '@/lib/routes'
import { SITE } from '@/lib/seo.config'
import { SchemaScript } from '@/components/seo/SchemaScript'
import { breadcrumbSchema, collectionPageSchema } from '@/lib/schema'
import type { Metadata } from 'next'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600'] })

export const metadata: Metadata = {
  title: 'Shop Silver Jewellery Online | 92.5 BIS Hallmarked | Bakya Tirunelveli',
  description:
    'Explore handcrafted 92.5 BIS hallmarked silver jewellery at Bakya. Shop kolusu, bracelets, chains, pendants and rings. Trusted since 1997. Ships across Tamil Nadu.',
  alternates: { canonical: 'https://www.bakya.in/silver-jewellery' },
  openGraph: {
    title: 'Shop Silver Jewellery | Bakya — Tirunelveli Since 1997',
    description:
      'Handcrafted 92.5 silver kolusu, bracelets, chains, pendants & rings. BIS hallmarked. Ships Tamil Nadu.',
    url: 'https://www.bakya.in/silver-jewellery',
    images: [{ url: '/og-collections.jpg', width: 1200, height: 630 }],
  },
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    num: '01',
    name: 'Silver Kolusu',
    tagline: 'Bridal & daily wear · 90 & 92.5 silver',
    badge: '90 & 92.5 Silver',
    image: 'https://images.unsplash.com/photo-1602752250013-1a067ed776c8?auto=format&fit=crop&q=80&w=800',
    handle: 'anklet',
    featured: true,
    chips: [
      { label: 'All Kolusu', href: '/silver-jewellery/anklets' },
      { label: 'Bridal Kolusu', href: '/silver-jewellery/anklets?occasion=Bridal' },
      { label: 'Daily Wear', href: '/daily-wear-silver-jewellery' },
      { label: '90 Purity Silver', href: '/silver-jewellery/anklets' },
      { label: '92.5 Fashion', href: '/silver-jewellery/anklets' },
    ],
  },
  {
    num: '02',
    name: 'Silver Rings',
    tagline: '16 designs — stones, hearts & more',
    badge: '92.5 Sterling Silver',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b6348e?auto=format&fit=crop&q=80&w=600',
    handle: 'ring',
    featured: false,
    chips: [
      { label: 'All Rings', href: '/silver-jewellery/rings' },
      { label: 'Heart Rings', href: '/silver-jewellery/rings?design_style=Heart' },
      { label: 'Stone Rings', href: '/silver-jewellery/rings' },
      { label: 'Under ₹2,000', href: '/silver-jewellery/rings?price=0-2000' },
      { label: 'Couple Rings', href: '/silver-jewellery/rings' },
    ],
  },
  {
    num: '03',
    name: 'Silver Chains',
    tagline: '10 designs for men, women & kids',
    badge: '92.5 Sterling Silver',
    image: 'https://images.unsplash.com/photo-1599643478514-4a4e0f69a1ba?auto=format&fit=crop&q=80&w=600',
    handle: 'chain',
    featured: false,
    chips: [
      { label: 'All Chains', href: '/silver-jewellery/chains' },
      { label: "Men's Chains", href: '/silver-jewellery/chains?gender=Men' },
      { label: "Women's Chains", href: '/silver-jewellery/chains' },
      { label: "Kids' Chains", href: '/silver-jewellery/chains' },
      { label: 'Snake Design', href: '/silver-jewellery/chains' },
    ],
  },
  {
    num: '04',
    name: 'Silver Pendants',
    tagline: '12 religious & daily wear designs',
    badge: '92.5 Gold Plated',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600',
    handle: 'pendant',
    featured: false,
    chips: [
      { label: 'All Pendants', href: '/silver-jewellery/pendants' },
      { label: 'Religious Pendants', href: '/silver-jewellery/pendants?design_style=Religious' },
      { label: 'Temple Jewellery', href: '/temple-silver-jewellery' },
      { label: 'Gold-Plated Silver', href: '/silver-jewellery/pendants' },
      { label: 'Silver Gifts', href: '/silver-gifts-for-women' },
    ],
  },
  {
    num: '05',
    name: 'Silver Bracelets',
    tagline: '4 handcrafted gifting designs',
    badge: '92.5 Sterling Silver',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600',
    handle: 'bracelet',
    featured: false,
    chips: [
      { label: 'All Bracelets', href: '/silver-jewellery/bracelets' },
      { label: 'Gifting Bracelets', href: '/silver-jewellery/bracelets?occasion=Gift' },
      { label: 'Heart Stone', href: '/silver-jewellery/bracelets' },
      { label: 'Daily Wear', href: '/daily-wear-silver-jewellery' },
      { label: 'Under ₹3,500', href: '/silver-jewellery/bracelets' },
    ],
  },
]

const FILTER_GROUPS = [
  {
    label: 'Occasion',
    chips: [
      { label: 'Bridal Kolusu', href: '/silver-jewellery/anklets?occasion=Bridal' },
      { label: 'Daily Wear', href: '/daily-wear-silver-jewellery' },
      { label: 'Temple Jewellery', href: '/temple-silver-jewellery' },
      { label: 'Silver Gifts', href: '/silver-gifts-for-women' },
    ],
  },
  {
    label: 'Gender',
    chips: [
      { label: "Women's", href: '/silver-jewellery' },
      { label: "Men's Chains", href: '/silver-jewellery/chains?gender=Men' },
      { label: 'Unisex Rings', href: '/silver-jewellery/rings' },
      { label: "Kids'", href: '/silver-jewellery/chains' },
    ],
  },
  {
    label: 'Style',
    chips: [
      { label: 'Heart Design', href: '/silver-jewellery/rings?design_style=Heart' },
      { label: 'Stone Set', href: '/silver-jewellery/rings' },
      { label: 'Religious', href: '/silver-jewellery/pendants?design_style=Religious' },
      { label: 'Minimal', href: '/silver-jewellery/chains' },
      { label: 'Gold-Plated', href: '/silver-jewellery/pendants' },
    ],
  },
  {
    label: 'Budget',
    chips: [
      { label: 'Under ₹1,500', href: '/silver-jewellery-under-1500' },
      { label: '₹1,500–₹3,000', href: '/silver-jewellery/rings?price=1500-3000' },
      { label: '₹3,000–₹5,000', href: '/silver-jewellery/bracelets?price=3000-5000' },
      { label: 'Above ₹5,000', href: '/silver-jewellery/anklets' },
    ],
  },
]

const OCCASION_CARDS = [
  {
    title: 'Bridal',
    desc: 'Traditional kolusu, rings & chains for the Tamil bride',
    href: '/silver-jewellery/anklets?occasion=Bridal',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Daily Wear',
    desc: 'Lightweight pieces for everyday elegance',
    href: '/daily-wear-silver-jewellery',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b6348e?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Office Wear',
    desc: 'Minimalist & professional silver designs',
    href: '/silver-jewellery',
    image: 'https://images.unsplash.com/photo-1599643478514-4a4e0f69a1ba?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Party Wear',
    desc: 'Statement pieces for celebrations',
    href: '/silver-jewellery',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Festive',
    desc: 'Devotional & traditional silver pieces',
    href: '/temple-silver-jewellery',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600',
  },
]

const PRICE_RANGES = [
  { label: 'Under ₹1,500', desc: 'Pendants & rings', href: '/silver-jewellery-under-1500', image: 'https://images.unsplash.com/photo-1622398925373-3f9efa8ce462?auto=format&fit=crop&q=80&w=600' },
  { label: '₹1,500 – ₹3,000', desc: 'Rings & chains', href: '/silver-jewellery/rings?price=1500-3000', image: 'https://images.unsplash.com/photo-1602752250013-1a067ed776c8?auto=format&fit=crop&q=80&w=600' },
  { label: '₹3,000 – ₹5,000', desc: 'Bracelets & chains', href: '/silver-jewellery/bracelets?price=3000-5000', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600' },
  { label: 'Above ₹5,000', desc: 'Heavy kolusu & statement', href: '/silver-jewellery/anklets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600' },
]

const COMING_SOON = ['Earrings', 'Toe Rings', 'Nose Pins', 'Bangles', 'Necklaces', 'Jewellery Sets']

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function CollectionsPage() {
  const schemaProducts = CATEGORIES.map((c) => ({
    name: c.name,
    url: `${SITE.domain}${getCollectionUrl(c.handle)}`,
    image: c.image,
    price: '0',
  }))

  return (
    <>
      <SchemaScript
        schema={[
          collectionPageSchema({
            name: 'Shop Pure Silver Jewellery Online — Handcrafted Since 1997',
            description:
              'Handcrafted 92.5 BIS hallmarked silver jewellery from Tirunelveli since 1997. Shop kolusu, bracelets, chains, pendants and rings.',
            url: `${SITE.domain}/silver-jewellery`,
            products: schemaProducts,
          }),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Silver Jewellery', url: '/silver-jewellery' },
          ]),
        ]}
      />

      <main className="bg-white min-h-screen">

        {/* ── Hero ── */}
        <div className="relative bg-[#230532] overflow-hidden">
          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,#D4AF37 0,#D4AF37 1px,transparent 0,transparent 48px),repeating-linear-gradient(90deg,#D4AF37 0,#D4AF37 1px,transparent 0,transparent 48px)',
            }}
          />
          {/* Gold glow top-right */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-[100px]"
            style={{ background: '#D4AF37' }}
          />
          {/* Subtle glow bottom-left */}
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10 blur-[100px]"
            style={{ background: '#EAE2F0' }}
          />

          <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-16 md:py-24 text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <nav aria-label="Breadcrumb" className="mb-8">
              <p className={`${montserrat.className} text-[#EAE2F0]/50 text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-2.5`}>
                <Link href="/" className="hover:text-[#D4AF37] transition-colors duration-300">Home</Link>
                <span className="text-[#D4AF37]/40">/</span>
                <span className="text-white">Silver Jewellery</span>
              </p>
            </nav>

            {/* Gold rule + eyebrow */}
            <div className="flex items-center justify-center gap-5 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
              <span className={`${montserrat.className} text-[#D4AF37] text-[10px] uppercase tracking-[0.4em] font-semibold`}>
                Bakya since 1997
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
            </div>

            <h1 className={`${playfair.className} text-white text-[38px] md:text-[64px] font-bold leading-[1.1] tracking-wide mb-3`}>
              Pure Silver Jewellery
            </h1>
            <p className={`${playfair.className} text-[#EAE2F0]/80 text-[18px] md:text-[26px] font-normal italic mb-8`}>
              Handcrafted in Tirunelveli
            </p>

            <div className="inline-flex items-center justify-center px-6 py-2 border border-[#D4AF37]/30 rounded-full bg-white/5 backdrop-blur-sm">
              <p className={`${montserrat.className} text-[#EAE2F0]/70 text-[9px] md:text-[10px] uppercase tracking-[0.25em]`}>
                BIS Hallmarked 92.5 Silver &nbsp;<span className="text-[#D4AF37] mx-1">✦</span>&nbsp; Ships Across Tamil Nadu
              </p>
            </div>
          </div>

          {/* Trust strip inside hero at bottom */}
          <div className="border-t border-white/10 bg-black/10 backdrop-blur-md">
            <div className={`${montserrat.className} max-w-[1280px] mx-auto px-4 py-4 flex items-center justify-center flex-wrap gap-x-10 gap-y-3`}>
              {[
                'BIS Hallmarked 92.5 Silver',
                'Handcrafted in Tirunelveli',
                'Ships Across Tamil Nadu',
                'Trusted Since 1997',
              ].map((item) => (
                <span key={item} className="flex items-center gap-2.5 text-[9px] md:text-[10px] uppercase tracking-[0.22em] text-[#EAE2F0]/50 font-medium">
                  <span className="text-[#D4AF37]/80 text-[7px]">✦</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-14 md:py-20">

          {/* SEO intro */}
          <p className={`${montserrat.className} text-stone-500 text-[13px] md:text-[15px] max-w-3xl mx-auto text-center leading-loose mb-16 md:mb-24`}>
            Bakya is Tirunelveli's trusted silver jewellery brand — crafting BIS hallmarked 92.5 silver
            kolusu, rings, chains, pendants and bracelets since 1997. Every piece is certified,
            handcrafted, and shipped across Tamil Nadu.
          </p>

          {/* ══════════════════════════════════════════════════════ */}
          {/* SECTION 1 — 5 COLLECTIONS                             */}
          {/* ══════════════════════════════════════════════════════ */}
          <section aria-labelledby="collections-heading" className="mb-16 md:mb-20">
            <SectionHead id="collections-heading" eyebrow="Shop by Category" title="Our 5 Silver Collections" />

            {/* Editorial grid: kolusu (featured, tall left) + 2×2 right */}
            <div className="grid grid-cols-1 md:grid-cols-[2.2fr_1fr_1fr] md:grid-rows-2 gap-4 md:gap-6">

              {/* Featured — Kolusu */}
              {CATEGORIES.filter((c) => c.featured).map((cat) => (
                <Link
                  key={cat.handle}
                  href={getCollectionUrl(cat.handle)}
                  className="group relative overflow-hidden rounded-[24px] md:row-span-2 aspect-[4/5] md:aspect-auto md:min-h-[560px] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 shadow-sm hover:shadow-xl transition-all duration-500"
                  aria-label={`Shop ${cat.name}`}
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 44vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0518] via-[#0d0518]/40 to-[#0d0518]/10 opacity-90 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Inner elegant border */}
                  <div className="absolute inset-3 md:inset-4 rounded-[16px] border border-white/10 group-hover:border-[#D4AF37]/30 transition-colors duration-700 pointer-events-none" />

                  <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between z-10">
                    {/* Top row: badge + number */}
                    <div className="flex items-start justify-between">
                      <span className={`${montserrat.className} text-[10px] text-[#D4AF37] font-semibold uppercase tracking-[0.25em] bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-[#D4AF37]/30 shadow-lg`}>
                        {cat.badge}
                      </span>
                      <span className={`${playfair.className} text-white/10 text-[80px] font-bold leading-none -mt-3 -mr-2 select-none group-hover:text-white/15 transition-colors duration-500`}>
                        {cat.num}
                      </span>
                    </div>
                    {/* Bottom: text */}
                    <div className="transform group-hover:-translate-y-2 transition-transform duration-500 ease-out">
                      <h2 className={`${playfair.className} text-white text-[36px] md:text-[46px] font-bold leading-tight mb-3`}>
                        {cat.name}
                      </h2>
                      <p className={`${montserrat.className} text-[#EAE2F0]/70 text-[13px] md:text-[14px] leading-relaxed mb-6 max-w-sm`}>
                        {cat.tagline}
                      </p>
                      <div className={`${montserrat.className} inline-flex items-center gap-3 text-white text-[11px] font-semibold uppercase tracking-[0.2em] bg-white/10 backdrop-blur-md border border-white/20 hover:border-[#D4AF37]/60 px-7 py-3.5 rounded-full group-hover:bg-[#D4AF37]/20 group-hover:text-[#D4AF37] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.1)]`}>
                        Shop Collection <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Other 4 in 2×2 grid */}
              {CATEGORIES.filter((c) => !c.featured).map((cat) => (
                <Link
                  key={cat.handle}
                  href={getCollectionUrl(cat.handle)}
                  className="group relative overflow-hidden rounded-[20px] aspect-[4/3] md:aspect-auto focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 shadow-sm hover:shadow-lg transition-all duration-500"
                  aria-label={`Shop ${cat.name}`}
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 22vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.07]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0518]/95 via-[#0d0518]/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Inner elegant border */}
                  <div className="absolute inset-2 md:inset-3 rounded-[12px] border border-white/10 group-hover:border-[#D4AF37]/30 transition-colors duration-700 pointer-events-none" />

                  <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-between z-10">
                    <span className={`${playfair.className} text-white/15 text-[56px] font-bold leading-none self-end select-none group-hover:text-white/25 transition-colors duration-500`}>
                      {cat.num}
                    </span>
                    <div className="transform group-hover:-translate-y-1 transition-transform duration-500 ease-out">
                      <span className={`${montserrat.className} text-[9px] text-[#D4AF37] font-semibold uppercase tracking-[0.25em] block mb-2`}>
                        {cat.badge}
                      </span>
                      <h2 className={`${playfair.className} text-white text-2xl md:text-[28px] font-bold leading-tight mb-1.5`}>
                        {cat.name}
                      </h2>
                      <p className={`${montserrat.className} text-[#EAE2F0]/60 text-[11px] leading-relaxed mb-3`}>{cat.tagline}</p>
                      <span className={`${montserrat.className} inline-flex items-center gap-1.5 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0`}>
                        Explore <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════ */}
          {/* SECTION 2 — BROWSE ALL                                */}
          {/* ══════════════════════════════════════════════════════ */}
          <section aria-labelledby="browse-heading" className="mb-16 md:mb-20">
            <SectionHead id="browse-heading" eyebrow="Find What You Need" title="Browse Silver Jewellery" />

            {/* 5 category rows */}
            <div className="rounded-[20px] border border-[#EDE8E0]/70 overflow-hidden bg-white mb-8 shadow-sm">
              <div className="divide-y divide-[#EDE8E0]/60">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.handle}
                    className="group/row flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 hover:bg-[#FAF8F5] transition-all duration-300"
                  >
                    {/* Category name */}
                    <Link
                      href={getCollectionUrl(cat.handle)}
                      className="sm:w-48 flex-shrink-0 flex items-center gap-4"
                    >
                      <span className={`${montserrat.className} text-[11px] font-bold text-[#D4AF37] w-6 flex-shrink-0 opacity-70 group-hover/row:opacity-100 transition-opacity`}>
                        {cat.num}
                      </span>
                      <p className={`${montserrat.className} text-[#230532] font-semibold text-[14px] group-hover/row:text-[#D4AF37] transition-colors`}>
                        {cat.name}
                      </p>
                    </Link>

                    {/* Sub-category chips */}
                    <div className="flex flex-wrap gap-2.5 flex-1 pl-10 sm:pl-0">
                      {cat.chips.map((chip) => (
                        <Link
                          key={chip.label}
                          href={chip.href}
                          className={`${montserrat.className} text-[11px] text-stone-500 border border-stone-200 bg-white px-4 py-1.5 rounded-full hover:bg-[#230532] hover:border-[#230532] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap`}
                        >
                          {chip.label}
                        </Link>
                      ))}
                    </div>

                    {/* View All */}
                    <Link
                      href={getCollectionUrl(cat.handle)}
                      className={`${montserrat.className} hidden sm:flex items-center gap-1.5 text-[10px] text-[#D4AF37] font-semibold uppercase tracking-[0.2em] flex-shrink-0 opacity-0 group-hover/row:opacity-100 transition-all duration-300 translate-x-2 group-hover/row:translate-x-0`}
                    >
                      View All <span className="text-[14px] leading-none">›</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick browse: Occasion / Gender / Style / Budget */}
            <div className="rounded-[20px] bg-gradient-to-br from-[#FAF8F5] to-white border border-[#EDE8E0]/70 px-6 md:px-8 py-7 shadow-sm">
              <p className={`${montserrat.className} flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-6`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                Quick Browse
              </p>
              <div className="space-y-4">
                {FILTER_GROUPS.map((group) => (
                  <div key={group.label} className="flex flex-wrap sm:flex-nowrap items-start gap-4">
                    <span className={`${montserrat.className} text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-400 sm:w-[84px] flex-shrink-0 pt-1.5`}>
                      {group.label}
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {group.chips.map((chip) => (
                        <Link
                          key={chip.label}
                          href={chip.href}
                          className={`${montserrat.className} text-[12px] text-[#230532] border border-[#EDE8E0] bg-white px-4 py-1.5 rounded-full hover:bg-[#230532] hover:border-[#230532] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap`}
                        >
                          {chip.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════ */}
          {/* SECTION 3 — SHOP BY OCCASION                          */}
          {/* ══════════════════════════════════════════════════════ */}

          {/* BANNER 1 (Before Occasions) */}
          <div className="relative w-full rounded-[24px] overflow-hidden mb-16 min-h-[300px] md:min-h-[400px] flex items-center shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=1600"
              alt="Simple. Stylish. Silver."
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#230532]/90 via-[#230532]/60 to-transparent" />
            <div className="relative z-10 px-8 md:px-16 max-w-lg">
              <h2 className={`${playfair.className} text-white text-[36px] md:text-[52px] font-bold leading-tight mb-3`}>
                Simple. Stylish. Silver.
              </h2>
              <p className={`${montserrat.className} text-[#EAE2F0] text-[13px] md:text-[16px] mb-8 font-medium`}>
                Everyday essentials with modern elegance
              </p>
              <Link href="/silver-jewellery" className={`${montserrat.className} inline-flex items-center justify-center bg-[#D4AF37] text-[#230532] font-bold uppercase tracking-widest text-[11px] px-8 py-3.5 rounded-full hover:bg-white transition-colors shadow-lg`}>
                Explore All Collection
              </Link>
            </div>
          </div>

          <section aria-labelledby="occasion-heading" className="mb-16 md:mb-20">
            <SectionHead id="occasion-heading" eyebrow="Contemporary silver jewellery for a refined and versatile look." title="New Collections" />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              {OCCASION_CARDS.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group relative rounded-xl md:rounded-[20px] overflow-hidden aspect-square focus:outline-none focus:ring-2 focus:ring-[#D4AF37] shadow-sm hover:shadow-xl transition-shadow duration-500"
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.08]"
                  />
                  {/* Bottom gold-to-dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/90 via-[#D4AF37]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Subtle inner border */}
                  <div className="absolute inset-2 md:inset-2.5 rounded-[12px] border border-white/20 group-hover:border-white/50 transition-colors duration-500 pointer-events-none" />

                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex flex-col items-center justify-end z-10">
                    <h3 className={`${playfair.className} text-white font-bold text-[18px] md:text-[22px] leading-tight text-center drop-shadow-md transform group-hover:-translate-y-1 transition-transform duration-300`}>
                      {card.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* BANNER 2 (After Occasions) */}
          <div className="relative w-full rounded-[24px] overflow-hidden mb-16 min-h-[300px] md:min-h-[400px] flex items-center shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=1600"
              alt="Timeless Antique Elegance"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#FAF8F5]/95 via-[#FAF8F5]/80 to-transparent" />
            <div className="relative z-10 px-8 md:px-16 w-full flex justify-end text-right">
              <div className="max-w-md">
                <h2 className={`${playfair.className} text-[#230532] text-[32px] md:text-[46px] font-bold leading-tight mb-3`}>
                  Timeless Antique Elegance
                </h2>
                <p className={`${montserrat.className} text-[#230532]/70 text-[12px] md:text-[14px] mb-4 font-medium leading-relaxed`}>
                  Inspired by heritage craftsmanship, discover intricately designed jewellery that reflects tradition, artistry, and royal beauty.
                </p>
                <p className={`${montserrat.className} text-[#230532] text-[12px] font-semibold mb-2`}>
                  Making Charges Starting at
                </p>
                <p className={`${playfair.className} text-[#230532] text-[48px] md:text-[64px] font-bold leading-none mb-6`}>
                  4%
                </p>
                <Link href="/temple-silver-jewellery" className={`${montserrat.className} inline-flex items-center justify-center bg-[#230532] text-white font-bold uppercase tracking-widest text-[11px] px-8 py-3.5 rounded-full hover:bg-[#D4AF37] hover:text-[#230532] transition-colors shadow-lg`}>
                  Explore All Collection
                </Link>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════ */}
          {/* SECTION 4 — SHOP BY BUDGET                            */}
          {/* ══════════════════════════════════════════════════════ */}
          <section aria-labelledby="budget-heading" className="mb-16 md:mb-20">
            <SectionHead id="budget-heading" eyebrow="Genuine Silver at Every Price Point" title="Shop by Budget" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PRICE_RANGES.map((card) => (
                <Link
                  key={card.label}
                  href={card.href}
                  className="group relative rounded-[20px] overflow-hidden p-6 flex flex-col justify-end h-[160px] md:h-[200px] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] shadow-sm hover:shadow-lg transition-shadow duration-500"
                >
                  <Image
                    src={card.image}
                    alt={card.label}
                    fill
                    className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#230532]/90 via-[#230532]/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Inner border */}
                  <div className="absolute inset-2 md:inset-2.5 rounded-[14px] border border-white/20 group-hover:border-[#D4AF37]/50 transition-colors duration-500 pointer-events-none" />

                  <div className="relative z-10 text-center transform group-hover:-translate-y-1 transition-transform duration-300">
                    <p className={`${playfair.className} text-white text-[18px] md:text-[22px] font-bold leading-tight drop-shadow-sm`}>
                      {card.label}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════ */}
          {/* Coming Soon                                            */}
          {/* ══════════════════════════════════════════════════════ */}
          <div className="rounded-2xl bg-[#FAF8F5] border border-[#EDE8E0] px-6 py-8 text-center mb-2">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
              <p className={`${montserrat.className} text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]/70 font-semibold`}>
                Coming Soon
              </p>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
            </div>
            <h3 className={`${playfair.className} text-[#230532] text-[18px] font-bold mb-4`}>
              More Silver Collections
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {COMING_SOON.map((name) => (
                <span
                  key={name}
                  className={`${montserrat.className} text-[11px] text-stone-400 border border-stone-200 rounded-full px-4 py-1.5 cursor-default select-none`}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* ── Bottom CTA ── */}
        <MatchCTA />
      </main>
    </>
  )
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function SectionHead({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div className="mb-10 md:mb-12 flex flex-col items-center justify-center">
      <div className="flex items-center gap-4 text-left">
        <div className="w-[3px] bg-[#230532] h-12 md:h-14" />
        <div className="flex flex-col justify-center">
          <h2 id={id} className={`${playfair.className} text-[#230532] text-[24px] md:text-[34px] font-bold leading-tight mb-0.5`}>
            {title}
          </h2>
          <span className={`${montserrat.className} text-[10px] md:text-[12px] text-[#230532]/80 font-medium leading-tight max-w-sm`}>
            {eyebrow}
          </span>
        </div>
      </div>
    </div>
  )
}

function MatchCTA() {
  const whatsappPhone = SITE.social.whatsapp.replace(/[^0-9]/g, '')
  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-br from-[#FAF8F5] to-[#EAE2F0] py-20 md:py-28 flex flex-col items-center justify-center text-center px-6 border-t border-[#EDE8E0]">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(#230532 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#230532]/5 rounded-full blur-[100px]" />

      <div className="relative z-10 flex items-center justify-center gap-4 md:gap-5 mb-5">
        <span className="text-[#D4AF37]/60 text-2xl" aria-hidden="true">✦</span>
        <h2 className={`${playfair.className} text-[#230532] text-[28px] md:text-[42px] font-bold tracking-wide`}>
          Find Your Perfect Silver Match
        </h2>
        <span className="text-[#D4AF37]/60 text-2xl" aria-hidden="true">✦</span>
      </div>

      <p className={`${montserrat.className} text-[#230532]/70 text-[14px] md:text-[16px] max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed font-medium`}>
        Have questions about our pure silver collections, customising a design, or tracking your order?
        We&apos;re just a message away.
      </p>

      <div className={`${montserrat.className} relative z-10 bg-white/80 backdrop-blur-xl px-2 py-2 md:py-2 md:px-2 rounded-full border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row items-center gap-2 sm:gap-2`}>
        <a
          href={`tel:${SITE.phone}`}
          className="text-[#230532] font-semibold text-[13px] md:text-[14px] tracking-widest flex items-center justify-center gap-2.5 hover:bg-[#FAF8F5] px-6 py-3.5 rounded-full transition-all duration-300 w-full sm:w-auto"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="text-[#D4AF37]">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          {SITE.phone}
        </a>
        <span className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-stone-200 to-transparent" />
        <a
          href={`mailto:${SITE.email}`}
          className="text-[#230532] font-semibold text-[13px] md:text-[14px] tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 hover:bg-[#FAF8F5] px-6 py-3.5 rounded-full transition-all duration-300 w-full sm:w-auto"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="text-[#D4AF37]">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          {SITE.email}
        </a>
        <span className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-stone-200 to-transparent" />
        <a
          href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(SITE.whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white bg-[#230532] font-semibold text-[13px] md:text-[14px] tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 hover:bg-[#3a1450] px-8 py-3.5 rounded-full transition-all duration-300 w-full sm:w-auto shadow-md hover:shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true" className="text-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.49" />
          </svg>
          WhatsApp Us
        </a>
      </div>
    </div>
  )
}
