"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/shopify/product';
import { usePriceFormatter } from '@/hooks/usePriceFormatter';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

// ── Icons for the bottom row removed in favor of Image components ──

function BestSellerCard({ product }: { product: Product }) {
  const { format } = usePriceFormatter(product.priceRange.minVariantPrice.currencyCode);
  const price = product.priceRange.minVariantPrice.amount;
  const image = product.featuredImage;

  const collection = product.collections?.edges?.find(
    (e: any) => e.node.handle !== "frontpage"
  )?.node?.handle || "all";

  return (
    <Link href={`/collections/${collection}/${product.handle}`} className="group flex flex-col relative block">
      <div className="relative aspect-square overflow-hidden mb-3 bg-gray-100">
        {image ? (
          <Image
            src={image.url}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-[#f1eeea]" />
        )}

        {/* Heart Icon (Top right, white box) */}
        <div className="absolute top-2 right-2 p-1.5 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer z-10"
          onClick={(e) => { e.preventDefault(); /* toggle wishlist logic */ }}>
          <Heart size={15} className="text-gray-600" />
        </div>

        {/* Navigation Arrows (Visible on hover) */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-white/70 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer hover:bg-white/90"
          onClick={(e) => e.preventDefault()}>
          <ChevronLeft size={16} className="text-gray-800" />
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/70 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer hover:bg-white/90"
          onClick={(e) => e.preventDefault()}>
          <ChevronRight size={16} className="text-gray-800" />
        </div>

        {/* Quick View */}
        <div className="absolute bottom-3 right-3 px-3.5 py-1.5 bg-white/70 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer hover:bg-white/90"
          onClick={(e) => e.preventDefault()}>
          <span className="text-[11px] font-medium text-[#222]">Quick View</span>
        </div>
      </div>

      <div className="flex flex-col gap-[3px] px-1 pb-4">
        <h3 className="text-[13px] md:text-[14px] text-[#333333] font-medium truncate font-sans">{product.title}</h3>
        <p className="text-[11px] md:text-[12px] text-[#888888] font-sans font-light">22K Gold • BIS Hallmarked</p>
        <p className="text-[15px] md:text-[17px] font-bold text-[#230532] mt-1 font-sans">{format(price)}</p>
        <p className="text-[9px] text-black tracking-[0.1em] mt-0.5 font-sans uppercase">#BEST SELLER</p>
      </div>
    </Link>
  );
}

export default function BestSellers({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="w-full bg-[#FCFBFA] py-16 md:py-24 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500;1,600&family=Montserrat:wght@400;500;600;700&display=swap');
        .font-serif-title { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-[#230532] text-xl md:text-2xl">✦</span>
            <h2 className="text-[#230532] text-3xl md:text-[42px] font-serif-title font-bold tracking-wide">Our Best Sellers</h2>
            <span className="text-[#230532] text-xl md:text-2xl">✦</span>
          </div>
          <p className="text-[#230532] italic font-serif-title text-lg md:text-[22px] mt-2 md:mt-3 font-medium opacity-90">
            Most loved designs chosen by our customers
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {products.slice(0, 8).map((product) => (
            <BestSellerCard key={product.id} product={product} />
          ))}
        </div>

        {/* Trust Icons Bottom Row */}
        <div className="mt-20 md:mt-28 flex flex-wrap justify-between items-start gap-y-10 gap-x-4 opacity-90 px-2 md:px-4">
          <div className="flex flex-col items-center flex-1 min-w-[80px] gap-4">
            <div className="relative w-14 h-14 md:w-20 md:h-20">
              <Image src="/svgviewer-png-output.png" alt="100% Certified Jewellery" fill className="object-contain" />
            </div>
            <span className="text-[11px] md:text-xs text-center text-[#230532] font-sans font-medium leading-tight">100% Certified<br />Jewellery</span>
          </div>
          <div className="flex flex-col items-center flex-1 min-w-[80px] gap-4">
            <div className="relative w-14 h-14 md:w-20 md:h-20">
              <Image src="/svgviewer-png-output (1).png" alt="1 Year Free Insurance" fill className="object-contain" />
            </div>
            <span className="text-[11px] md:text-xs text-center text-[#230532] font-sans font-medium leading-tight">1 Year Free<br />Insurance</span>
          </div>
          <div className="flex flex-col items-center flex-1 min-w-[80px] gap-4">
            <div className="relative w-14 h-14 md:w-20 md:h-20">
              <Image src="/svgviewer-png-output (2).png" alt="BIS Hallmarked Gold" fill className="object-contain" />
            </div>
            <span className="text-[11px] md:text-xs text-center text-[#230532] font-sans font-medium leading-tight">BIS Hallmarked Gold</span>
          </div>
          <div className="flex flex-col items-center flex-1 min-w-[80px] gap-4">
            <div className="relative w-14 h-14 md:w-20 md:h-20">
              <Image src="/svgviewer-png-output (3).png" alt="Easy Returns" fill className="object-contain" />
            </div>
            <span className="text-[11px] md:text-xs text-center text-[#230532] font-sans font-medium leading-tight">Easy Returns</span>
          </div>
          <div className="flex flex-col items-center flex-1 min-w-[80px] gap-4">
            <div className="relative w-14 h-14 md:w-20 md:h-20">
              <Image src="/svgviewer-png-output (4).png" alt="Free Shipping" fill className="object-contain" />
            </div>
            <span className="text-[11px] md:text-xs text-center text-[#230532] font-sans font-medium leading-tight">Free Shipping</span>
          </div>
          <div className="flex flex-col items-center flex-1 min-w-[80px] gap-4">
            <div className="relative w-14 h-14 md:w-16 md:h-16">
              <Image src="/svgviewer-png-output (5).png" alt="Premium Craftsmanship" fill className="object-contain" />
            </div>
            <span className="text-[11px] md:text-xs text-center text-[#230532] font-sans font-medium leading-tight">Premium<br />Craftsmanship</span>
          </div>
        </div>

      </div>
    </section>
  );
}
