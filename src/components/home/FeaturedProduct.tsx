import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/shopify/product';
import { Section } from '@/components/layout/Section';

export default function FeaturedProduct({ product }: { product: Product }) {
  if (!product) return null;

  return (
    <Section className="bg-white">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          
          {/* Left Column - Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-[4/5] w-full relative rounded-lg overflow-hidden shadow-sm group">
              <Image 
                src={product.featuredImage?.url || ''} 
                alt={product.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            </div>
            {/* Decorative block */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#FAF8F5] -z-10 rounded-full blur-2xl"></div>
          </div>

          {/* Right Column - Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <span className="text-amber-600 uppercase tracking-widest text-xs font-bold mb-4">Spotlight</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 mb-6 leading-tight">
              {product.title}
            </h2>
            <p className="text-lg text-stone-600 font-sans mb-10 leading-relaxed max-w-lg">
              {product.description || "Experience unparalleled craftsmanship and timeless design. This piece showcases meticulously set gems and exquisite detailing, perfect for elevating any occasion."}
            </p>
            
            <Link 
              href={`/products/${product.handle}`} 
              className="inline-flex items-center gap-3 bg-stone-900 text-white px-10 py-4 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-amber-600 transition-colors self-start shadow-md"
            >
              Discover Piece <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

        </div>
    </Section>
  );
}
