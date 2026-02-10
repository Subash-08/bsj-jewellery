import { getProducts } from '@/lib/shopify/client';
import { mockProducts } from '@/lib/shopify/mock';
import ProductGrid from '@/components/features/ProductGrid';
import Link from 'next/link';

export const revalidate = 3600;

export default async function ShopPage() {
    let products: any[] = [];

    try {
        const productsRes = await getProducts({});
        products = productsRes || [];
        if (products.length === 0) products = mockProducts;
    } catch (e) {
        console.error('Failed to fetch products, using mock data:', e);
        products = mockProducts;
    }

    return (
        <main className="bg-white min-h-screen pt-32">
            <div className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Shop All Jewelry</h1>
                    <p className="text-gray-600">Discover our complete collection of exquisite jewelry pieces</p>
                </div>

                <ProductGrid title="" products={products} />
            </div>
        </main>
    );
}
