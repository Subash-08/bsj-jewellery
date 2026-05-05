"use client";

import Image from "next/image";
import Link from "next/link";

export default function LatestArrivals({ collections }: { collections: any[] }) {
  let displayItems = collections && collections.length > 0 ? [...collections] : [];

  if (displayItems.length > 0) {
    while (displayItems.length < 12) {
      displayItems = [...displayItems, ...collections];
    }
  } else {
    displayItems = Array(12).fill({
      title: "Latest Collection",
      handle: "all",
      image: {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
      },
    });
  }

  // To make a smooth infinite marquee, we double the list
  const marqueeItems = [...displayItems, ...displayItems];

  return (
    <section
      className="relative mx-auto max-w-[1300px] py-6 md:py-8 bg-white overflow-hidden flex flex-col items-center"
      aria-labelledby="latest-arrival-heading"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,700;1,400&family=Playfair+Display:wght@500;700&display=swap');
        
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <header className="flex flex-col items-center text-center px-4 mb-10 md:mb-12 z-20">
        <div className="inline-flex items-center gap-[10px] relative">
          <svg className="w-[23px] h-[23px] text-[#230532]" viewBox="0 0 23 23" fill="currentColor" aria-hidden="true">
            <path d="M11.5 0L14.5939 8.40615L23 11.5L14.5939 14.5939L11.5 23L8.40615 14.5939L0 11.5L8.40615 8.40615L11.5 0Z" />
          </svg>
          <div className="p-[10px] inline-flex items-center justify-center">
            <h2
              id="latest-arrival-heading"
              className="text-[#230532] text-[36px] font-playfair font-bold mt-[-1px]"
            >
              Latest Arrival
            </h2>
          </div>
          <svg className="w-[23px] h-[23px] text-[#230532]" viewBox="0 0 23 23" fill="currentColor" aria-hidden="true">
            <path d="M11.5 0L14.5939 8.40615L23 11.5L14.5939 14.5939L11.5 23L8.40615 14.5939L0 11.5L8.40615 8.40615L11.5 0Z" />
          </svg>
        </div>
        <p className="text-black mt-2 font-montserrat italic font-normal text-[18px] max-w-[531px] text-center">
          Discover our newest designs, crafted for modern elegance
        </p>
      </header>

      {/* Marquee Gallery with Exact Curved Masking */}
      <div className="w-full relative h-[271px] overflow-hidden my-4 z-10 flex justify-center bg-white">

        {/* The scrolling track */}
        <div className="absolute inset-0 flex animate-scroll w-max gap-[15px] items-center px-[15px]">
          {marqueeItems.map((item, i) => {
            const imageUrl =
              item?.image?.url ||
              item?.image?.src ||
              item?.featuredImage?.url ||
              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800";

            return (
              <Link
                href={`/collections/${item.handle || "all"}`}
                key={i}
                className="relative w-[261px] h-[261px] flex-shrink-0 group overflow-hidden block"
              >
                <Image
                  src={imageUrl}
                  alt={item.title || "Latest arrival product"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="261px"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <span className="text-white font-montserrat font-medium text-[16px] drop-shadow-md text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Top white ellipse mask */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[150vw] min-w-[1885px] max-w-[3000px] bg-white rounded-[50%] z-10 pointer-events-none"
          style={{ height: '142px', top: '-115px' }}
        ></div>

        {/* Bottom white ellipse mask */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[150vw] min-w-[1885px] max-w-[3000px] bg-white rounded-[50%] z-10 pointer-events-none"
          style={{ height: '142px', bottom: '-102px' }}
        ></div>
      </div>

      {/* Button */}
      <div className="mt-[40px] z-20">
        <Link
          href="/collections"
          className="inline-flex items-center justify-center px-[10px] py-[10px] min-w-[200px] bg-[#230532] text-white rounded-[4px] font-montserrat font-bold text-[18px] hover:bg-[#3a1e4a] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          Explore All Collection
        </Link>
      </div>

    </section>
  );
}
