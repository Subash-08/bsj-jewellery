import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display, Montserrat } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600'] });

const SILVER_CATEGORIES = [
  { name: 'Anklet', image: 'https://images.unsplash.com/photo-1602752250013-1a067ed776c8?auto=format&fit=crop&q=80&w=600', handle: 'silver-anklets' },
  { name: 'Bracelet', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600', handle: 'silver-bracelets' },
  { name: 'Chain', image: 'https://images.unsplash.com/photo-1599643478514-4a4e0f69a1ba?auto=format&fit=crop&q=80&w=600', handle: 'silver-chains' },
  { name: 'Pendants', image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600', handle: 'silver-pendants' },
  { name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b6348e?auto=format&fit=crop&q=80&w=600', handle: 'silver-rings' },
];

const GOLD_CATEGORIES = [
  { name: 'Necklace', image: 'https://images.unsplash.com/photo-1599643478514-4a4e0f69a1ba?auto=format&fit=crop&q=80&w=600', handle: 'gold-necklace' },
  { name: 'Ring', image: 'https://images.unsplash.com/photo-1605100804763-247f67b6348e?auto=format&fit=crop&q=80&w=600', handle: 'gold-ring' },
  { name: 'Bangles', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600', handle: 'gold-bangles' },
  { name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600', handle: 'gold-earrings' },
  { name: 'Mangalsutra', image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600', handle: 'gold-mangalsutra' },
];

const DIAMOND_CATEGORIES = [
  { name: 'Pendants', image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600', handle: 'diamond-pendants' },
  { name: 'Ring', image: 'https://images.unsplash.com/photo-1605100804763-247f67b6348e?auto=format&fit=crop&q=80&w=600', handle: 'diamond-ring' },
  { name: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600', handle: 'diamond-bracelets' },
  { name: 'Necklace', image: 'https://images.unsplash.com/photo-1599643478514-4a4e0f69a1ba?auto=format&fit=crop&q=80&w=600', handle: 'diamond-necklace' },
  { name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600', handle: 'diamond-earrings' },
];

const NEW_COLLECTIONS = [
  { name: 'Solitaire', image: 'https://images.unsplash.com/photo-1605100804763-247f67b6348e?auto=format&fit=crop&q=80&w=600', handle: 'solitaire' },
  { name: 'Antique', image: 'https://images.unsplash.com/photo-1602752250013-1a067ed776c8?auto=format&fit=crop&q=80&w=600', handle: 'antique' },
  { name: 'Temple Wear', image: 'https://images.unsplash.com/photo-1599643478514-4a4e0f69a1ba?auto=format&fit=crop&q=80&w=600', handle: 'temple' },
  { name: 'Floral', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600', handle: 'floral' },
  { name: 'Office Wear', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600', handle: 'office' },
];

export default function CollectionsPage() {
  return (
    <main className="bg-white min-h-screen">

      {/* ── Top Hero Banner ── */}
      <div className="relative w-full h-[180px] md:h-[240px] bg-[#230532] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#230532] via-[#3a1450] to-[#230532] opacity-90" />
        <div className="absolute inset-0 bg-[url('https://cdn.shopify.com/s/files/1/0704/8554/0995/files/category-hero.jpg?v=1778577733')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        
        <div className="relative z-10 flex flex-col items-center">
           <div className="flex items-center gap-4 mb-2">
             <span className="text-[#F1D380] text-lg">✦</span>
             <h1 className={`${playfair.className} text-white text-3xl md:text-[44px] font-bold tracking-wider`}>Shop by Category</h1>
             <span className="text-[#F1D380] text-lg">✦</span>
           </div>
           <p className={`${montserrat.className} text-[#F1D380] text-xs md:text-sm font-light tracking-widest uppercase mt-2`}>
             Discover our handcrafted luxury collections
           </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 mt-6 md:mt-10 mb-20">

        {/* Breadcrumb */}
        <div className={`${montserrat.className} text-[11px] md:text-[12px] text-stone-400 mb-10 flex items-center gap-2 uppercase tracking-wider`}>
          <Link href="/" className="hover:text-[#230532] transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="text-[#230532] font-semibold">Collections</span>
        </div>

        {/* ── SECTION 1: SILVER ── */}
        <div className="mb-16 md:mb-20">
          <SectionTitle title="Silver Jewellery" subtitle="Find out the perfect one for your beloved" />
          <CategoryGrid items={SILVER_CATEGORIES} />
          <PromoBanner 
            image="https://images.unsplash.com/photo-1596460107916-430662021049?auto=format&fit=crop&q=80&w=2000"
            title="Simple. Stylish. Silver."
            subtitle="Elevate your everyday with pure elegance."
            align="left"
          />
        </div>

        {/* ── SECTION 2: GOLD ── */}
        <div className="mb-16 md:mb-20">
          <SectionTitle title="Golden Jewellery" subtitle="Find out the perfect one for your beloved" />
          <CategoryGrid items={GOLD_CATEGORIES} />
          <PromoBanner 
            image="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=2000"
            title="Celebrate in Gold"
            subtitle="Embrace luxury with our timeless gold collections."
            discount="0% Making Charges"
            align="right"
          />
        </div>

        {/* ── SECTION 3: DIAMOND ── */}
        <div className="mb-16 md:mb-20">
          <SectionTitle title="Diamond Jewellery" subtitle="Shine bright with every step you take" />
          <CategoryGrid items={DIAMOND_CATEGORIES} />
          <PromoBanner 
            image="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=2000"
            title="Shine with Every Moment."
            subtitle="Diamonds that celebrate your eternal love."
            discount="Flat 20% Off"
            align="left"
          />
        </div>

        {/* ── SECTION 4: NEW COLLECTIONS ── */}
        <div className="mb-16 md:mb-20">
          <SectionTitle title="New Collections" subtitle="Explore our latest arrivals" />
          <CategoryGrid items={NEW_COLLECTIONS} />
          <PromoBanner 
            image="https://images.unsplash.com/photo-1602752250013-1a067ed776c8?auto=format&fit=crop&q=80&w=2000"
            title="Timeless Antique Elegance"
            subtitle="Beautiful heritage designs for the modern bride."
            align="right"
          />
        </div>

      </div>

      {/* ── Bottom CTA ── */}
      <MatchCTA />

    </main>
  );
}

function SectionTitle({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="flex justify-center mb-8 md:mb-10">
      <div className="flex flex-col border-l-[3px] border-[#230532] pl-4 text-left">
        <h2 className={`${playfair.className} text-[#230532] text-[26px] md:text-[32px] font-bold leading-none mb-2 tracking-wide`}>{title}</h2>
        <p className={`${montserrat.className} text-stone-500 text-[12px] md:text-[14px] tracking-wide`}>{subtitle}</p>
      </div>
    </div>
  );
}

function CategoryGrid({ items }: { items: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-10 md:mb-12">
      {items.map((item, i) => (
        <Link href={`/collections/${item.handle}`} key={i} className="group relative w-full aspect-[4/5] md:aspect-square overflow-hidden rounded shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#e0c06b]/30 hover:border-[#FACE7A] transition-colors">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Bottom Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#230532]/90 via-[#230532]/40 to-transparent pt-16 pb-4 flex justify-center items-end">
            <span className={`${montserrat.className} text-white text-[13px] md:text-[14px] font-semibold uppercase tracking-[0.15em]`}>
              {item.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function PromoBanner({ image, title, subtitle, discount, align }: { image: string, title: string, subtitle: string, discount?: string, align: 'left' | 'right' }) {
  return (
    <div className="relative w-full h-[200px] md:h-[280px] overflow-hidden rounded-[2px] shadow-lg group">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover group-hover:scale-[1.03] transition-transform duration-1000"
      />
      {/* Dark overlay for text readability */}
      <div className={`absolute inset-0 bg-black/40 flex flex-col justify-center px-6 md:px-16 ${align === 'left' ? 'items-start text-left' : 'items-end text-right'}`}>
        <div className="max-w-[500px]">
          <h3 className={`${playfair.className} text-white text-2xl md:text-[40px] font-bold leading-tight mb-2 md:mb-3`}>{title}</h3>
          <p className={`${montserrat.className} text-white/90 text-[13px] md:text-[16px] font-light mb-4 md:mb-5`}>{subtitle}</p>
          {discount && <p className={`${montserrat.className} text-[#FACE7A] text-2xl md:text-[34px] font-bold mb-4 md:mb-5 tracking-wider leading-none`}>{discount}</p>}
          <Link
            href="/collections/all"
            className={`${montserrat.className} inline-block bg-[#F1D380] text-[#230532] px-6 py-2.5 text-[12px] md:text-[13px] font-bold uppercase tracking-[0.1em] hover:bg-white transition-colors shadow-md`}
          >
            Explore All Collection
          </Link>
        </div>
      </div>
    </div>
  );
}

function MatchCTA() {
  return (
    <div className="w-full bg-[#EAE2F0] py-16 md:py-20 flex flex-col items-center justify-center text-center px-6">
      <div className="flex items-center gap-3 md:gap-4 mb-4">
        <span className="text-[#230532] text-xl">✦</span>
        <h2 className={`${playfair.className} text-[#230532] text-[26px] md:text-[34px] font-bold tracking-wide`}>Find Your Perfect Match — We're Here to Help</h2>
        <span className="text-[#230532] text-xl">✦</span>
      </div>
      <p className={`${montserrat.className} text-[#230532] text-[14px] md:text-[16px] max-w-2xl mx-auto mb-8 md:mb-10 opacity-80 leading-relaxed`}>
        Have questions about diamonds, customizing a design, or tracking your order? We're just a message away.
      </p>

      <div className={`${montserrat.className} bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-[#230532]/20 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-sm`}>
        <span className="text-[#230532] font-semibold text-[13px] md:text-[15px] tracking-widest flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          +91 98765 43210
        </span>
        <span className="hidden sm:block w-px h-5 bg-[#230532]/30"></span>
        <span className="text-[#230532] font-semibold text-[13px] md:text-[15px] tracking-wider uppercase flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          care@bakyajewels.com
        </span>
      </div>
    </div>
  );
}
