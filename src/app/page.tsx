import { getProducts, getCollections } from '@/lib/shopify/client';
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

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Bakya — Silver Kolusu, Chains, Bracelets & Rings | Since 1997',
  description:
    'Bakya by Bagyalakshmi Jewellers — handcrafted 92.5 BIS hallmarked silver jewellery from Tirunelveli since 1997. Silver kolusu, chains, bracelets, pendants & rings. Ships across Tamil Nadu.',
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
    const result = await getProducts();
    products = result.products || [];
  } catch (e) {
    console.error('Failed to fetch best sellers, using mock data:', e);
    if (useMock) products = mockProducts;
  }

  try {
    const allResult = await getProducts({});
    allProducts = allResult.products || [];
    if (allProducts.length === 0 && useMock) allProducts = mockProducts;
  } catch (e) {
    console.error('Failed to fetch all products, using mock data:', e);
    if (useMock) allProducts = mockProducts;
  }

  const homePageSchema = webPageSchema({
    type: 'WebPage',
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
    {
      q: 'Does Bakya accept custom silver jewellery orders?',
      a: 'Yes. Bakya accepts custom orders for silver kolusu, chains, and other jewellery pieces. Contact us on WhatsApp with your design requirements and preferred weight/purity.',
    },
  ])

  return (
    <>
      <SchemaScript schema={[homePageSchema, homeFaqSchema]} />
    <main>
      <Hero />

      <TrustSection />

      <CategorySlider collections={collections} />

      {/* <FeaturedCollections collections={collections} /> */}
      <Suspense fallback={<ProductSkeleton />}>
        <BestSellers products={products} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <LatestArrivals collections={collections} />
      </Suspense>

      <ShopByGender collections={collections} />
      {/* Rebuild trigger */}



      <Suspense fallback={<ProductSkeleton />}>
        <SplitProductShowcase
          title="Celebration Edit"
          description="Life is one big celebration. Dance, dazzle and enjoy with the finest festive jewellery designs."
          products={products.slice(0, 6)}
          imageSrc="https://cdn.shopify.com/s/files/1/0704/8554/0995/files/ChatGPT_Image_May_14_2026_12_43_53_PM.webp?v=1778747781"
        />
      </Suspense>

      <PromoBanner />
      {/* <StyleGridServer /> */}
      <FinalCTA />

      <WhyChooseUs />

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
