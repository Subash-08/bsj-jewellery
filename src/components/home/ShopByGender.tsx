"use client";
import Image from "next/image";
import Link from "next/link";

interface Collection {
  title: string;
  handle: string;
  image?: { url: string; src?: string };
  featuredImage?: { url: string };
}

export default function ShopByGender({ collections }: { collections: Collection[] }) {
  // Try to find collections that match gender names, or use fallbacks
  const getGenderData = (name: string, fallbackImage: string) => {
    const found = collections?.find(c => c.title.toLowerCase().includes(name.toLowerCase()));
    return {
      title: name,
      handle: found ? found.handle : `all?q=${name}`,
      image: found?.image?.url || found?.image?.src || found?.featuredImage?.url || fallbackImage
    };
  };

  const genders = [
    getGenderData("Women", "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"),
    getGenderData("Men", "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"),
    getGenderData("Kids", "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&q=80&w=800")
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-16">
          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-[#230532] text-xl md:text-2xl">✦</span>
            <h2 className="text-[#230532] text-3xl md:text-[42px] font-serif font-bold tracking-wide">Shop By Genders</h2>
            <span className="text-[#230532] text-xl md:text-2xl">✦</span>
          </div>
          <p className="text-[#230532] italic font-serif text-lg md:text-[20px] mt-2 md:mt-3 font-medium opacity-90">
            Discover jewellery designed for everyone
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {genders.map((gender, idx) => (
            <Link 
              href={`/collections/${gender.handle}`} 
              key={idx}
              className="group flex flex-col items-center"
            >
              <div className="w-full aspect-square relative overflow-hidden bg-gray-100 mb-6">
                <Image
                  src={gender.image}
                  alt={gender.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="text-[#230532] text-2xl md:text-[28px] font-serif font-bold transition-colors group-hover:text-[#521770]">
                {gender.title}
              </h3>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
