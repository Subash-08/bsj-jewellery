import { getProducts, getCollections, getCollectionProducts } from '@/lib/shopify/client';
import { filterDisplayCollections } from '@/lib/shopify/collections.config';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SchemaScript } from '@/components/seo/SchemaScript';
import { webPageSchema, faqSchema } from '@/lib/schema';
import { SITE } from '@/lib/seo.config';
import { TrustSection } from '@/components/sections/TrustSection';
import Hero from '@/components/home/Hero';
import CategorySlider from '@/components/home/CategorySlider';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import SplitProductShowcase from '@/components/home/SplitProductShowcase';
import ProductGrid from '@/components/features/ProductGrid';
import BestSellers from '@/components/home/BestSellers';
import LatestArrivals from '@/components/home/LatestArrivals';
import ShopByOccasion from '@/components/home/ShopByOccasion';
import ShopByGender from '@/components/home/ShopByGender';
import AboutUs from '@/components/home/AboutUs';
import HelpSection from '@/components/home/HelpSection';
import PromoBanner from '@/components/home/PromoBanner';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import FeaturedProduct from '@/components/home/FeaturedProduct';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import InstagramFeed from '@/components/home/InstagramFeed';
import FinalCTA from '@/components/home/FinalCTA';
import ProductSkeleton from '@/components/home/ProductSkeleton';
import SectionSkeleton from '@/components/home/SectionSkeleton';
import { mockProducts } from '@/lib/shopify/mock';
import StyleGridServer from '@/components/home/style-grid/StyleGridServer';
import Link from 'next/link';

// Move this URL out of JSX into a named constant
const CELEBRATION_IMAGE =
  'https://cdn.shopify.com/s/files/1/0704/8554/0995/files/ChatGPT_Image_May_14_2026_12_43_53_PM.webp?v=1778747781';
// TODO: Replace with a proper gifting/celebration jewellery image

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Bakya by Bagyalakshmi Jewellers | Handcrafted Silver Jewellery Since 1997',
  description:
    'Bakya by Bagyalakshmi Jewellers offers handcrafted 92.5 BIS hallmarked silver jewellery from Tirunelveli since 1997. Shop silver kolusu, rings, chains, bracelets and pendants online with delivery across Tamil Nadu and India.',
  alternates: { canonical: 'https://www.bakya.in' },
};

export default async function HomePage() {
  let products: any[] = [];
  let allProducts: any[] = [];
  let collections: any[] = [];

  try {
    collections = await getCollections();
  } catch (e) {
    console.error('Failed to fetch collections', e);
  }

  const useMock = process.env.NODE_ENV === 'development'

  try {
    const bestSellersResult = await getCollectionProducts({ handle: 'best-sellers' });
    const bestSellers = bestSellersResult?.products || [];

    if (bestSellersResult && bestSellers.length > 0) {
      products = bestSellers;
    } else {
      console.warn(
        '[HomePage] best-sellers collection empty or missing — falling back to general products'
      );
      try {
        const fallback = await getProducts();
        products = fallback.products || [];
      } catch {
        products = process.env.NODE_ENV === 'development' ? mockProducts.slice(0, 8) : [];
      }
    }
  } catch (e) {
    console.error('[HomePage] Failed to fetch best-sellers collection:', e);
    products = process.env.NODE_ENV === 'development' ? mockProducts.slice(0, 8) : [];
  }

  // Gifting Edit — fetched from the curated 'gifting-edit' Shopify collection
  let giftingProducts: any[] = [];
  try {
    const giftingResult = await getCollectionProducts({ handle: 'gifting-edit' });
    const gifting = giftingResult?.products || [];

    if (giftingResult && gifting.length > 0) {
      giftingProducts = gifting;
    } else {
      console.warn(
        '[HomePage] gifting-edit collection empty or missing — using fallback products'
      );
      giftingProducts = products.slice(0, 6);
    }
  } catch (e) {
    console.error('[HomePage] Failed to fetch gifting-edit collection:', e);
    giftingProducts = products.slice(0, 6);
  }

  try {
    const allResult = await getProducts({});
    allProducts = allResult.products || [];
    if (allProducts.length === 0 && useMock) allProducts = mockProducts;
  } catch (e) {
    console.error('[HomePage] Failed to fetch all products:', e);
    allProducts = process.env.NODE_ENV === 'development' ? mockProducts : [];
  }

  const homePageSchema = webPageSchema({
    type: ['WebPage', 'CollectionPage'],
    name: 'Bakya — Handcrafted Silver Jewellery from Tirunelveli since 1997',
    description:
      'BIS hallmarked 92.5 silver kolusu, bracelets, chains & rings. Trusted since 1997. Ships across Tamil Nadu.',
    url: SITE.domain,
    breadcrumbs: [{ name: 'Home', url: SITE.domain }],
  })

  const homeFaqSchema = faqSchema([
    {
      q: 'Is Bakya silver jewellery BIS hallmarked?',
      a: 'Yes. All silver jewellery sold by Bakya by Bagyalakshmi Jewellers carries BIS hallmark certification with HUID, confirming silver purity of 92.5 (sterling) or 90 purity.',
    },
    {
      q: 'Does Bakya ship silver jewellery outside Tirunelveli?',
      a: 'Yes. Bakya ships silver jewellery across Tamil Nadu and India. Orders are dispatched in 1–2 business days and delivered within 3–5 business days.',
    },
    {
      q: 'What is the return policy for silver jewellery at Bakya?',
      a: 'Bakya offers a 7-day return window from the date of delivery. Items must be unused and in original condition. Contact us via WhatsApp or email to initiate a return.',
    },
    {
      q: 'How do I care for my silver jewellery?',
      a: 'Store your silver jewellery in a dry pouch away from moisture and perfumes. Clean with a soft silver polishing cloth to restore shine. Avoid exposing to household chemicals or soaking in water.',
    },
  ])

  return (
    <>
      <SchemaScript schema={[homePageSchema, homeFaqSchema]} />
      <main>
        <Hero />

        <TrustSection />

        <CategorySlider collections={filterDisplayCollections(collections)} />

        {/* <FeaturedCollections collections={collections} /> */}
        <Suspense fallback={<ProductSkeleton />}>
          <BestSellers products={products} />
        </Suspense>

        {/* REPLACED: LatestArrivals → ShopByOccasion (better conversion, matches actual inventory) */}
        {/* <Suspense fallback={<SectionSkeleton />}>
        <LatestArrivals collections={filterDisplayCollections(collections)} />
      </Suspense> */}

        <ShopByOccasion />

        <ShopByGender collections={filterDisplayCollections(collections)} />
        {/* Rebuild trigger */}



        <Suspense fallback={<ProductSkeleton />}>
          <SplitProductShowcase
            title="Silver Gifts She'll Love"
            description="Handcrafted BIS hallmarked silver — from ₹999. Gift-ready packaging on every order."
            ctaText="Shop Gifting →"
            ctaHref="/silver-gifts-for-women"
            products={giftingProducts}
            imageSrc={CELEBRATION_IMAGE}
          />
        </Suspense>

        <PromoBanner />
        {/* <StyleGridServer /> */}
        <FinalCTA />
        <section className="relative overflow-hidden py-16 md:py-24 px-4">
          {/* Soft Background Accent */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5]" />

          <div className="relative max-w-4xl mx-auto text-center">

            {/* Small Label */}
            <p className="text-[11px] md:text-xs uppercase tracking-[0.3em] text-[#9B8B7A] mb-4 font-medium">
              Bakya by Bagyalakshmi Jewellers
            </p>

            {/* Main Heading */}
            <h1 className="font-playfair text-3xl md:text-5xl font-semibold leading-tight text-[#230532] max-w-3xl mx-auto">
              Handcrafted 92.5 Silver Jewellery Since 1997
            </h1>

            {/* Description */}
            <p className="mt-6 text-sm md:text-base leading-8 text-[#5B5146] max-w-2xl mx-auto font-dm-sans">
              Discover handcrafted silver kolusu, rings, chains, bracelets and temple jewellery from Tirunelveli — designed for everyday elegance, meaningful gifting and timeless tradition.
            </p>

            {/* Collection Links */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">

              {[
                {
                  label: "Silver Rings",
                  href: "/silver-jewellery/rings",
                },
                {
                  label: "Silver Anklets",
                  href: "/silver-jewellery/anklets",
                },
                {
                  label: "Temple Jewellery",
                  href: "/temple-silver-jewellery",
                },
                {
                  label: "Daily Wear Jewellery",
                  href: "/daily-wear-silver-jewellery",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-5 py-2.5 rounded-full border border-[#E7DED2] text-sm text-[#4A3F35] hover:bg-[#230532] hover:text-white transition-all duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap justify-center gap-6 mt-10 text-xs md:text-sm text-[#7B6D60] font-medium">

              <span>✓ BIS Hallmarked</span>
              <span>✓ Secure Payments</span>
              <span>✓ Since 1997</span>
              <span>✓ Ships Across India</span>

            </div>
          </div>
        </section>
        {/* <WhyChooseUs /> */}

        <AboutUs />
        <HelpSection />

        {/* {products.length > 0 && <FeaturedProduct product={products[0]} />} */}
        <Suspense fallback={<SectionSkeleton />}>
          <InstagramFeed />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Testimonials />
        </Suspense>



        <Suspense fallback={<SectionSkeleton />}>
          <FAQ />
        </Suspense>


      </main>
    </>
  );
}
