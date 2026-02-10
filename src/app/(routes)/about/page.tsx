import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="bg-white min-h-screen pt-32">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">About BSJ Jewellery</h1>
                        <p className="text-lg text-gray-600">Crafting timeless elegance since generations</p>
                    </div>

                    {/* Story Section */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Our Story</h2>
                        <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                            <p>
                                BSJ Jewellery has been a trusted name in fine jewelry for generations. What started as a small family business
                                has grown into one of the most respected jewelry houses, known for our commitment to quality, craftsmanship,
                                and customer satisfaction.
                            </p>
                            <p>
                                Our journey began with a simple vision: to create exquisite jewelry pieces that celebrate life's precious moments.
                                Today, we continue that tradition by combining traditional craftsmanship with contemporary designs, ensuring that
                                every piece tells a unique story.
                            </p>
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Our Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-rose-50 border border-rose-100 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality</h3>
                                <p className="text-gray-700">
                                    We use only the finest materials and maintain the highest standards of craftsmanship in every piece we create.
                                </p>
                            </div>
                            <div className="bg-rose-50 border border-rose-100 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust</h3>
                                <p className="text-gray-700">
                                    Building lasting relationships with our customers through transparency, honesty, and exceptional service.
                                </p>
                            </div>
                            <div className="bg-rose-50 border border-rose-100 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
                                <p className="text-gray-700">
                                    Blending traditional techniques with modern designs to create jewelry that's both timeless and contemporary.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Why Choose BSJ Jewellery?</h2>
                        <ul className="space-y-4 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="text-rose-600 mt-1">✓</span>
                                <span><strong>Certified Jewelry:</strong> All our gold and diamond jewelry comes with proper certification</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-rose-600 mt-1">✓</span>
                                <span><strong>Free Shipping:</strong> Pan India free shipping on orders above ₹10,000</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-rose-600 mt-1">✓</span>
                                <span><strong>Lifetime Exchange:</strong> Exchange your old jewelry for new designs anytime</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-rose-600 mt-1">✓</span>
                                <span><strong>Custom Designs:</strong> We create bespoke pieces tailored to your preferences</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-rose-600 mt-1">✓</span>
                                <span><strong>Expert Guidance:</strong> Our jewelry consultants help you find the perfect piece</span>
                            </li>
                        </ul>
                    </div>

                    {/* CTA */}
                    <div className="text-center bg-gradient-to-br from-rose-50 to-white border border-rose-100 rounded-lg p-8">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Visit Our Store</h2>
                        <p className="text-gray-600 mb-6">Experience our collection in person and let our experts guide you</p>
                        <Link
                            href="/contact"
                            className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-md font-medium transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
