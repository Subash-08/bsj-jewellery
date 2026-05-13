"use client";
import Link from "next/link";
import Image from "next/image";
import { Playfair_Display, Montserrat } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export default function AboutUs() {
  return (
    <section className="w-full flex flex-col mt-8 md:mt-16">
      
      {/* Title above banner */}
      <div className="flex justify-center items-center mb-8 md:mb-12">
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-[#230532] text-xl md:text-2xl">✦</span>
          <h2 className={`${playfair.className} text-[#230532] text-3xl md:text-[42px] font-bold tracking-wide`}>
            About Us
          </h2>
          <span className="text-[#230532] text-xl md:text-2xl">✦</span>
        </div>
      </div>

      {/* Top Banner Section */}
      <div className="relative w-full min-h-[550px] md:min-h-[550px] lg:h-[600px] bg-[#1d0b28] overflow-hidden flex items-center py-12 md:py-0">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-40 md:opacity-100">
          <Image
            src="https://images.unsplash.com/photo-1596460107916-430662021049?auto=format&fit=crop&q=80&w=2000"
            alt="Jewellery Craftsmanship"
            fill
            className="object-cover object-right md:object-[75%_center]"
            sizes="100vw"
            priority
          />
        </div>
        
        {/* Deep purple gradient overlay for readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t md:bg-gradient-to-r from-[#230532] via-[#230532]/95 md:via-[#230532]/80 to-transparent md:to-[#230532]/10" />

        {/* Content Container */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 w-full">
          <div className="max-w-[600px] lg:max-w-[650px] text-white">
            <h2 className={`${playfair.className} text-[32px] sm:text-4xl lg:text-[44px] font-bold mb-6 md:mb-8 leading-[1.2] tracking-wide`}>
              Crafting Timeless Elegance in Every Detail
            </h2>
            
            <p className={`${montserrat.className} text-[15px] sm:text-[16px] font-light leading-[1.8] mb-8 md:mb-10 text-white/90`}>
              At Bakya, we believe jewellery is more than an accessory — it is a reflection of heritage, craftsmanship, and personal expression. Each piece is thoughtfully designed and crafted with precision, blending traditional artistry with modern elegance. From everyday essentials to bridal masterpieces, our collections are created to celebrate every moment with authenticity and timeless beauty.
            </p>

            <ul className={`${montserrat.className} space-y-4 mb-10 text-[14px] sm:text-[15px] font-normal text-white/90`}>
              <li className="flex items-center gap-4">
                <div className="flex-shrink-0 text-[#F1D380]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>Handcrafted with precision</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex-shrink-0 text-[#F1D380]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>BIS Hallmarked & Certified</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex-shrink-0 text-[#F1D380]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>Designed for modern elegance</span>
              </li>
            </ul>

            <Link 
              href="/pages/about" 
              className={`${montserrat.className} inline-flex items-center justify-center bg-[#F1D380] text-[#230532] px-8 py-3.5 rounded text-[14px] sm:text-[15px] font-bold tracking-[0.05em] uppercase hover:bg-[#e0c06b] hover:scale-[1.02] transition-all shadow-lg`}
            >
              Explore Our Story
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
