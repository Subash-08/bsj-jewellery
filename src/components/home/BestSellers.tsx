"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/shopify/product';
import { usePriceFormatter } from '@/hooks/usePriceFormatter';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { useWishlist } from '@/hooks/useWishlist';

// ── Icons for the bottom row removed in favor of Image components ──

function BestSellerCard({ product }: { product: Product }) {
  const { format } = usePriceFormatter(product.priceRange.minVariantPrice.currencyCode);
  const price = product.priceRange.minVariantPrice.amount;
  const image = product.featuredImage;

  const collection = product.collections?.edges?.find(
    (e: any) => e.node.handle !== "frontpage"
  )?.node?.handle || "all";

  const { toggleWishlist, isInWishlist } = useWishlist();
  const wish = isInWishlist(product.id);

  return (
    <Link href={`/collections/${collection}/${product.handle}`} className="group flex flex-col relative block w-full">
      <div className="relative aspect-square overflow-hidden bg-[#f1eeea]">
        {image && (
          <Image
            src={image.url}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        {/* Heart Icon */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
          className="absolute top-3 right-3 z-10 focus:outline-none"
          aria-label="Wishlist"
        >
          <Heart size={20} strokeWidth={1.5} className={`transition-colors ${wish ? "fill-red-500 text-red-500" : "text-white/80 hover:text-black"}`} />
        </button>

        {/* Quick View */}
        <div className="absolute bottom-0 right-0 px-[10px] py-[4px] bg-[#ffffff66] backdrop-blur-sm rounded-tl-[24px] opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center cursor-pointer hover:bg-[#ffffff99]"
          onClick={(e) => e.preventDefault()}>
          <span className="text-[14px] font-medium font-sans text-white leading-normal">Quick View</span>
        </div>
      </div>

      <div className="flex flex-col gap-[6px] pt-[16px]">
        <div className="flex flex-col">
          <h3 className="text-[14px] text-[#1a1a1a] font-medium truncate font-sans leading-[22px]">{product.title}</h3>
          <p className="text-[12px] text-[#777777] font-medium font-sans leading-[22px]">22K Gold • BIS Hallmarked</p>
        </div>
        <div className="flex flex-col">
          <p className="text-[18px] font-bold text-[#230532] font-sans leading-[22px]">{format(price)}</p>
          <p className="text-[10px] text-[#535353] tracking-[0.5px] font-sans uppercase font-normal leading-[22px]">#BEST SELLER</p>
        </div>
      </div>
    </Link>
  );
}

export default function BestSellers({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="w-full bg-[#fffff] py-4 md:py-8 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }
      `}</style>

      <div className="max-w-[1300px] w-full mx-auto px-4 md:px-8 flex flex-col items-center gap-[32px]">

        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-[507px]">
          <div className="flex items-center gap-[10px]">
            <span className="text-[#230532] text-[23px] leading-none">✦</span>
            <h2 className="text-[#230532] text-[28px] md:text-[36px] font-playfair font-bold">Our Best Sellers</h2>
            <span className="text-[#230532] text-[23px] leading-none">✦</span>
          </div>
          <p className="text-[#000000] italic font-sans text-[16px] md:text-[18px] font-normal leading-[22px] mt-1">
            Most loved designs chosen by our customers
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-[48px] md:gap-y-[32px] w-full">
          {products.slice(0, 8).map((product) => (
            <BestSellerCard key={product.id} product={product} />
          ))}
        </div>

        {/* Trust Icons Bottom Row */}
        <div className="mt-10 md:mt-14 flex flex-wrap justify-between items-start gap-y-10 gap-x-4 opacity-90 px-2 md:px-4 w-full">
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
