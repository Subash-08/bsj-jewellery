"use client";

import Image from "next/image";
import Link from "next/link";

export default function LatestArrivals({ collections }: { collections: any[] }) {
  let displayItems = collections && collections.length > 0 ? [...collections] : [];

  if (displayItems.length > 0) {
    while (displayItems.length < 6) {
      displayItems = [...displayItems, ...collections];
    }
    displayItems = displayItems.slice(0, 6);
  } else {
    displayItems = Array(6).fill({
      title: "Latest Collection",
      handle: "all",
      image: {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
      },
    });
  }

  // 🔥 Updated transforms (REAL curve effect)
  const transforms = [
    "rotateY(25deg) scale(0.9, 0.75) translateX(15%) translateY(30px)",
    "rotateY(15deg) scale(0.95, 0.85) translateX(5%) translateY(15px)",
    "rotateY(5deg) scale(1, 1) translateX(1%) translateY(0px)",
    "rotateY(-5deg) scale(1, 1) translateX(-1%) translateY(0px)",
    "rotateY(-15deg) scale(0.95, 0.85) translateX(-5%) translateY(15px)",
    "rotateY(-25deg) scale(0.9, 0.75) translateX(-15%) translateY(30px)",
  ];

  return (<section className="py-16 md:py-24 bg-white overflow-hidden flex flex-col items-center"> <style>{`         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500;1,600&family=Montserrat:wght@400;500;600;700&display=swap');
        .font-serif-title { font-family: 'Cormorant Garamond', serif; }
      `}</style>

    {/* Header */}
    <div className="flex flex-col items-center text-center mb-10 md:mb-16">
      <div className="flex items-center gap-3 md:gap-4">
        <span className="text-[#230532] text-xl md:text-2xl">✦</span>
        <h2 className="text-[#230532] text-3xl md:text-[42px] font-serif-title font-bold tracking-wide">
          Latest Arrival
        </h2>
        <span className="text-[#230532] text-xl md:text-2xl">✦</span>
      </div>
      <p className="text-[#230532] italic font-serif-title text-lg md:text-[22px] mt-2 md:mt-3 font-medium opacity-90">
        Discover our newest designs, crafted for modern elegance
      </p>
    </div>

    {/* 3D Curved Layout */}
    <div
      className="relative w-full max-w-[1400px] h-[240px] sm:h-[340px] md:h-[460px] flex justify-center items-center px-4"
      style={{
        perspective: "1500px",
        transformStyle: "preserve-3d",
      }}
    >
      {displayItems.map((item, i) => {
        const imageUrl =
          item?.image?.url ||
          item?.image?.src ||
          item?.featuredImage?.url ||
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800";

        return (
          <Link
            href={`/collections/${item.handle || "all"}`}
            key={i}
            className="relative w-[16.66%] h-full block group -mx-2"
            style={{
              transform: transforms[i],
              transformOrigin: "center center",
              transition:
                "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
              boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
            }}
          >
            <Image
              src={imageUrl}
              alt={item.title || "Collection"}
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 16vw, 250px"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-2 text-center">
              <span className="text-white font-medium text-xs sm:text-sm md:text-base font-sans drop-shadow-md">
                {item.title}
              </span>
            </div>

            {/* Hover lift effect */}
            <div className="absolute inset-0 transition-transform duration-500 group-hover:-translate-y-3 group-hover:scale-105" />
          </Link>
        );
      })}
    </div>

    {/* Button */}
    <div className="mt-12 md:mt-16">
      <Link
        href="/collections"
        className="bg-[#230532] text-white px-8 md:px-10 py-3 md:py-3.5 rounded text-sm md:text-base font-sans font-medium tracking-wide hover:bg-[#3a1e4a] hover:scale-105 transition-all duration-300 inline-block shadow-md"
      >
        Explore All Collection
      </Link>
    </div>
  </section>


  );
}
