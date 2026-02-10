import { getCollections } from '@/lib/shopify/client';
import Link from 'next/link';

export default async function CollectionsPage() {
    let collections: any[] = [];
    try {
        const res = await getCollections();
        collections = res || [];
    } catch (e) {
        console.error('Failed to fetch collections, returning empty:', e);
        // You could mock collections here too if desired, but empty list is safe
        collections = [];
    }

    return (
        <main className="p-10 bg-white min-h-screen">
            <h1 className="text-4xl font-serif text-center mb-12">Our Collections</h1>
            {collections.length === 0 ? (
                <div className="text-center">
                    <p className="text-lg text-gray-500">No collections found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10">
                    {collections.map((c) => (
                        <Link href={`/collections/${c.handle}`} key={c.handle} className="group block">
                            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden rounded-lg mb-4">
                                {c.image?.url ? (
                                    <img
                                        src={c.image.url}
                                        alt={c.image.altText || c.title}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                        <span className="text-sm">No Image</span>
                                    </div>
                                )}
                            </div>
                            <h2 className="text-2xl font-serif text-gray-900 group-hover:text-rose-600 transition-colors">
                                {c.title}
                            </h2>
                            <p className="text-gray-500 line-clamp-2 mt-1 max-w-sm">
                                {c.description}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}