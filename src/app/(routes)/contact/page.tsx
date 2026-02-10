import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="bg-white min-h-screen pt-32">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Contact Us</h1>
                        <p className="text-lg text-gray-600">We'd love to hear from you. Get in touch with us today!</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Send us a Message</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            required
                                            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            required
                                            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        required
                                        className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={6}
                                        required
                                        className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Send size={20} />
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Get in Touch</h2>

                            <div className="space-y-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="bg-rose-100 p-3 rounded-lg">
                                        <MapPin className="text-rose-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Visit Our Store</h3>
                                        <p className="text-gray-600">
                                            123 Jewelry Street<br />
                                            Main Market, City<br />
                                            State - 123456, India
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-rose-100 p-3 rounded-lg">
                                        <Phone className="text-rose-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                                        <p className="text-gray-600">
                                            +91 98765 43210<br />
                                            +91 98765 43211
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-rose-100 p-3 rounded-lg">
                                        <Mail className="text-rose-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                                        <p className="text-gray-600">
                                            support@bsjjewellery.com<br />
                                            sales@bsjjewellery.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-rose-100 p-3 rounded-lg">
                                        <Clock className="text-rose-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                                        <p className="text-gray-600">
                                            Monday - Saturday: 10:00 AM - 8:00 PM<br />
                                            Sunday: 11:00 AM - 6:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="bg-stone-100 rounded-lg h-64 flex items-center justify-center">
                                <p className="text-stone-500">Map Location</p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-16">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Do you offer custom jewelry design?</h3>
                                <p className="text-gray-600 text-sm">Yes! We specialize in creating bespoke jewelry pieces tailored to your preferences.</p>
                            </div>
                            <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">What is your return policy?</h3>
                                <p className="text-gray-600 text-sm">We offer a 7-day return policy on all purchases. Items must be in original condition.</p>
                            </div>
                            <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Do you provide certification?</h3>
                                <p className="text-gray-600 text-sm">Yes, all our gold and diamond jewelry comes with proper certification from recognized labs.</p>
                            </div>
                            <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">How long does delivery take?</h3>
                                <p className="text-gray-600 text-sm">Standard delivery takes 5-7 business days. Express delivery options are also available.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
