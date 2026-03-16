import { getProducts, getCollections } from '@/lib/shopify/client';
import { Suspense } from 'react';
import Hero from '@/components/home/Hero';
import CategorySlider from '@/components/home/CategorySlider';
import ProductGrid from '@/components/features/ProductGrid';

export const revalidate = 3600;

import { mockProducts } from '@/lib/shopify/mock';

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
      <div className="mt-[50px]">
        < Hero />
      </div>

      <CategorySlider collections={collections} />

      <Suspense fallback={<div className="text-center py-20">Loading trending products...</div>}>
        <ProductGrid title="Trending Products" products={products.slice(0, 4)} />
      </Suspense>

      <Suspense fallback={<div className="text-center py-20">Loading new arrivals...</div>}>
        <ProductGrid title="New Arrivals" products={allProducts.slice(0, 8)} />
      </Suspense>
    </main >
  );
}
