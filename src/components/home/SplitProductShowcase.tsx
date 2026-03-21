"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/shopify/product';
import { usePriceFormatter } from '@/hooks/usePriceFormatter';
import { Heart } from 'lucide-react';
import { useState } from 'react';

function SimpleProductCard({ product }: { product: Product }) {
  const { format } = usePriceFormatter(product.priceRange.minVariantPrice.currencyCode);
  const price = product.priceRange.minVariantPrice.amount;
  const image = product.featuredImage;
  const [wish, setWish] = useState(false);

  const collection = product.collections?.edges?.find(
    (e: any) => e.node.handle !== "frontpage"
  )?.node?.handle || "all";

  return (
    <Link href={`/collections/${collection}/${product.handle}`} className="group bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-sm overflow-hidden relative block">
      <div className="relative aspect-square bg-[#f9f9f9] overflow-hidden">
        {image ? (
          <Image
            src={image.url}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : null}
        <button
          onClick={(e) => {
            e.preventDefault();
            setWish(!wish);
          }}
          className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5 shadow-sm hover:bg-white transition z-10"
        >
          <Heart size={14} className={wish ? "fill-amber-500 text-amber-500" : "text-stone-400"} />
        </button>
      </div>
      <div className="p-3 text-left">
        <h3 className="text-sm text-stone-700 line-clamp-1 mb-1 font-sans">{product.title}</h3>
        <p className="text-sm font-semibold text-stone-900 font-serif">{format(price)}</p>
      </div>
    </Link>
  );
}

export default function SplitProductShowcase({
  title,
  description,
  products,
  imageSrc
}: {
  title: string;
  description: string;
  products: Product[];
  imageSrc: string;
}) {
  if (!products?.length) return null;

  return (
    <section className="py-16 md:py-20 bg-[#FAF8F5]">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%]">

          {/* LEFT: Products */}
          <div className="px-4 sm:px-6 lg:pl-16 lg:pr-10 lg:py-8">
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">
              {title}
            </h2>
            <p className="text-sm text-stone-500 mb-8 max-w-md font-sans">
              {description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
              {products.slice(0, 6).map((product) => (
                <SimpleProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/collections"
                className="inline-block border border-stone-300 px-6 py-2 text-xs uppercase tracking-widest hover:border-amber-500 hover:text-amber-600 transition bg-white"
              >
                View All
              </Link>
            </div>
          </div>

          {/* RIGHT: Image */}
          <div className="relative w-full h-full min-h-[420px] lg:min-h-[480px]">
            <Image
              src={imageSrc}
              alt="Jewellery Model"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>

        </div>
      </div>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
