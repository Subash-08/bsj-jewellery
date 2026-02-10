import Link from 'next/link';
import { Package, Search, ArrowRight } from 'lucide-react';

export default function TrackOrderPage() {
    return (
        <main className="bg-white min-h-screen pt-32">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Track Your Order</h1>
                    <p className="text-gray-600 mb-8">Enter your order number and email to track your shipment</p>

                    <div className="bg-stone-50 border border-stone-200 rounded-lg p-8">
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                    Order Number
                                </label>
                                <input
                                    type="text"
                                    id="orderNumber"
                                    placeholder="e.g., BSJ123456"
                                    className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Search size={20} />
                                Track Order
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-stone-200">
                            <div className="flex items-start gap-3 text-sm text-gray-600">
                                <Package size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900 mb-1">Need help?</p>
                                    <p>Contact our support team at <a href="mailto:support@bsjjewellery.com" className="text-rose-600 hover:underline">support@bsjjewellery.com</a></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <Link href="/shop" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium">
                            Continue Shopping
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
