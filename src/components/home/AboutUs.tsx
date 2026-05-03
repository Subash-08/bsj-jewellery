"use client";
import Link from "next/link";

export default function AboutUs() {
  return (
    <section className="w-full flex flex-col mt-8 md:mt-16">
      
      {/* Title above banner */}
      <div className="flex justify-center items-center mb-8 md:mb-12">
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-[#230532] text-xl md:text-2xl">✦</span>
          <h2 className="text-[#230532] text-3xl md:text-[42px] font-serif font-bold tracking-wide">About Us</h2>
          <span className="text-[#230532] text-xl md:text-2xl">✦</span>
        </div>
      </div>

      {/* Top Banner Section */}
      <div className="relative w-full min-h-[500px] md:h-[550px] bg-[#1d0b28] overflow-hidden flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1596460107916-430662021049?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-right bg-no-repeat opacity-60 md:opacity-100"
        />
        {/* Deep purple gradient overlay for readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#230532] via-[#230532]/90 to-[#230532]/20" />

        {/* Content Container */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 w-full">
          <div className="max-w-[650px] text-white">
            <h2 className="text-3xl md:text-[44px] font-serif font-bold mb-6 md:mb-8 leading-[1.2] tracking-wide">
              Crafting Timeless Elegance in Every Detail
            </h2>
            <p className="text-sm md:text-[15px] font-sans font-light leading-relaxed mb-10 opacity-90 pr-4 md:pr-0">
              At Bakya, we believe jewellery is more than an accessory — it is a reflection of heritage, craftsmanship, and personal expression. Each piece is thoughtfully designed and crafted with precision, blending traditional artistry with modern elegance. From everyday essentials to bridal masterpieces, our collections are created to celebrate every moment with authenticity and timeless beauty.
            </p>

            <ul className="space-y-3 mb-10 text-sm md:text-[14px] font-sans font-normal opacity-90">
              <li className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Handcrafted with precision</span>
              </li>
              <li className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>BIS Hallmarked & Certified</span>
              </li>
              <li className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Designed for modern elegance</span>
              </li>
            </ul>

            <Link 
              href="/pages/about" 
              className="inline-block bg-[#F1D380] text-[#230532] px-8 py-3 rounded text-[15px] font-sans font-bold tracking-wide hover:bg-[#e0c06b] transition-colors shadow-lg"
            >
              Explore Our Story
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
