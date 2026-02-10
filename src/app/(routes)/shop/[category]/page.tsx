import { getProducts } from '@/lib/shopify/client';
import { mockProducts } from '@/lib/shopify/mock';
import ProductGrid from '@/components/features/ProductGrid';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CATEGORY_DATA } from '@/lib/categories';

export const revalidate = 3600;

type Props = {
    params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
    return CATEGORY_DATA.map((cat) => ({
        category: cat.id,
    }));
}

export default async function CategoryPage(props: Props) {
    const params = await props.params;
    const categoryId = params.category;

    // Find category data
    const category = CATEGORY_DATA.find(cat => cat.id === categoryId);

    let products: any[] = [];

    try {
        const productsRes = await getProducts({});
        products = productsRes || [];
        if (products.length === 0) products = mockProducts;
    } catch (e) {
        console.error('Failed to fetch products, using mock data:', e);
        products = mockProducts;
    }

    // Filter products by category
    // Normalize the category ID to match productType
    const categoryProducts = products.filter(product => {
        if (!product.productType) return false;

        // Normalize both strings for comparison
        const normalizedProductType = product.productType.toLowerCase().replace(/s$/, ''); // Remove trailing 's'
        const normalizedCategory = categoryId.toLowerCase().replace(/-/g, ' ').replace(/s$/, ''); // Remove hyphens and trailing 's'

        // Check for matches
        return normalizedProductType === normalizedCategory ||
            normalizedProductType.includes(normalizedCategory) ||
            normalizedCategory.includes(normalizedProductType);
    });

    return (
        <main className="bg-white min-h-screen pt-32">
            <div className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <Link href="/shop" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-4">
                        <ArrowLeft size={16} />
                        Back to Shop
                    </Link>
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4 capitalize">
                        {category?.name || categoryId}
                    </h1>
                    <p className="text-gray-600">
                        {category ? `Explore our collection of ${category.name.toLowerCase()}` : 'Browse our jewelry collection'}
                    </p>
                </div>

                {categoryProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto">
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">No products available in this category yet</h2>
                            <p className="text-gray-600 mb-8">Check back soon for new arrivals!</p>
                            <Link
                                href="/shop"
                                className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                            >
                                Browse All Products
                            </Link>
                        </div>
                    </div>
                ) : (
                    <ProductGrid title="" products={categoryProducts} />
                )}
            </div>
        </main>
    );
}
