import { getProducts, getCollections } from '@/lib/shopify/client';
import { Suspense } from 'react';
import Hero from '@/components/home/Hero';
import CategorySlider from '@/components/home/CategorySlider';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import SplitProductShowcase from '@/components/home/SplitProductShowcase';
import ProductGrid from '@/components/features/ProductGrid';
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

export default async function HomePage() {
  let products: any[] = [];
  let allProducts: any[] = [];
  let collections: any[] = [];

  try {
    collections = await getCollections();
  } catch (e) {
    console.error('Failed to fetch collections', e);
  }

  try {
    const result = await getProducts();
    products = result.products || [];
  } catch (e) {
    console.error('Failed to fetch best sellers, using mock data:', e);
    products = mockProducts;
  }

  try {
    const allResult = await getProducts({});
    allProducts = allResult.products || [];
    if (allProducts.length === 0) allProducts = mockProducts;
  } catch (e) {
    console.error('Failed to fetch all products, using mock data:', e);
    allProducts = mockProducts;
  }

  return (
    <main>
      <Hero />

      <CategorySlider collections={collections} />

      <FeaturedCollections collections={collections} />

      <Suspense fallback={<ProductSkeleton />}>
        <SplitProductShowcase
          title="Celebration Edit"
          description="Life is one big celebration. Dance, dazzle and enjoy with the finest festive jewellery designs."
          products={products.slice(0, 6)}
          imageSrc="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
        />
      </Suspense>

      {/* <Suspense fallback={<ProductSkeleton />}>
        <ProductGrid title="New Arrivals" products={allProducts.slice(0, 6)} />
      </Suspense> */}

      <PromoBanner />
      <StyleGridServer />
      <FinalCTA />

      <WhyChooseUs />


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
  );
}
