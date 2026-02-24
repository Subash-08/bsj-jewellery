import { getProducts } from '@/lib/shopify/client';
import { Suspense } from 'react';
import Hero from '@/components/features/Hero';
import ProductGrid from '@/components/features/ProductGrid';

export const revalidate = 3600;

import { mockProducts } from '@/lib/shopify/mock';

export default async function HomePage() {
  let products: any[] = [];
  let allProducts: any[] = [];

  try {
    const productsRes = await getProducts();
    products = productsRes || [];
  } catch (e) {
    console.error('Failed to fetch best sellers, using mock data:', e);
    products = mockProducts;
  }

  try {
    const allProductsRes = await getProducts({});
    allProducts = allProductsRes || [];
    if (allProducts.length === 0) allProducts = mockProducts;
  } catch (e) {
    console.error('Failed to fetch all products, using mock data:', e);
    allProducts = mockProducts;
  }

  return (
    <main className="bg-white min-h-screen pt-32">
      <Hero />
      <Suspense fallback={<div className="text-center py-20">Loading best sellers...</div>}>
        <ProductGrid title="Best Sellers" products={products.slice(0, 4)} />
      </Suspense>

      <Suspense fallback={<div className="text-center py-20">Loading collection...</div>}>
        <ProductGrid title="New Arrivals" products={allProducts.slice(0, 8)} />
      </Suspense>
    </main>
  );
}
