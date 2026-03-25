import { Mail, Phone, MapPin, ShieldCheck, Lock, RefreshCw, Truck } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="bg-[#FAF8F5] min-h-screen pt-32 pb-20 font-sans">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* 1. Hero Section */}
                <section className="py-20 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-stone-900">
                        Get in Touch
                    </h1>
                    <p className="mt-4 text-stone-600 max-w-xl mx-auto">
                        Have questions about our jewellery or need assistance? We're here to help you.
                    </p>
                </section>

                {/* 2. Contact Info Cards */}
                <section className="mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition text-center flex flex-col items-center">
                            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-600">
                                <Phone size={24} />
                            </div>
                            <h3 className="font-serif text-xl text-stone-900 mb-2">Phone</h3>
                            <a href="tel:+919790790527" className="mt-auto font-medium text-stone-600 hover:text-stone-900 transition-colors">
                                9790790527
                            </a>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition text-center flex flex-col items-center">
                            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-600">
                                <Mail size={24} />
                            </div>
                            <h3 className="font-serif text-xl text-stone-900 mb-2">Email</h3>
                            <a href="mailto:bagyalakhsmijewellers97@gmail.com" className="mt-auto font-medium text-stone-600 hover:text-stone-900 transition-colors text-sm break-all">
                                bagyalakhsmijewellers97@gmail.com
                            </a>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition text-center flex flex-col items-center">
                            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-600">
                                <MapPin size={24} />
                            </div>
                            <h3 className="font-serif text-xl text-stone-900 mb-2">Address</h3>
                            <span className="mt-auto text-stone-600 text-sm">
                                BAGYALAKSHMI JEWELLERY<br />
                                57A/12, KOOLAKKADAI BAZAAR<br />
                                TOWN, 627006 Tirunelveli<br />
                                TN, India
                            </span>
                        </div>
                    </div>
                </section>

                {/* 3. Contact Form */}
                <section className="mb-20 bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-10 items-stretch">
                        <div className="p-8 md:p-12 order-2 md:order-1">
                            <h2 className="text-3xl font-serif text-stone-900 mb-8">Send a Message</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-stone-700 mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            required
                                            className="w-full border border-stone-200 rounded-md px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-stone-700 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            required
                                            className="w-full border border-stone-200 rounded-md px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        className="w-full border border-stone-200 rounded-md px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-2">
                                        Phone Number <span className="text-stone-400 font-normal">(Optional)</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className="w-full border border-stone-200 rounded-md px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-stone-700 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        required
                                        className="w-full border border-stone-200 rounded-md px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        required
                                        className="w-full border border-stone-200 rounded-md px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-stone-900 text-white px-6 py-3 rounded-md hover:bg-black transition w-full md:w-auto font-medium tracking-wide mt-2"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                        {/* Right side visual */}
                        <div className="relative bg-stone-100 hidden md:block order-1 md:order-2 overflow-hidden">
                            <div className="absolute inset-0 bg-stone-200 w-full h-full flex flex-col items-center justify-center p-12 text-center z-0">
                                <div className="absolute inset-0 opacity-[0.25] bg-[url('https://images.unsplash.com/photo-1599643477877-52642ed56930?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center mix-blend-multiply"></div>
                                <div className="relative z-10 p-10 border border-stone-900/10 bg-white/70 backdrop-blur-md rounded-lg max-w-sm">
                                    <h3 className="font-serif text-3xl text-stone-900 mb-3">Timeless Craft</h3>
                                    <p className="text-stone-600 font-light leading-relaxed">
                                        Discover pieces that transcend time. We are devoted to bringing your vision to life with uncompromising quality.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Trust Strip */}
                <section className="border-t border-stone-200/60 pt-16 pb-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
                        <div className="flex flex-col items-center group">
                            <ShieldCheck className="text-amber-600 mb-4 group-hover:scale-110 transition-transform duration-300" size={32} strokeWidth={1.5} />
                            <h4 className="font-serif text-stone-900 font-medium mb-1 text-lg">Hallmark Certified</h4>
                            <p className="text-sm text-stone-500 font-light">100% Guaranteed Purity</p>
                        </div>
                        <div className="flex flex-col items-center group">
                            <Lock className="text-amber-600 mb-4 group-hover:scale-110 transition-transform duration-300" size={32} strokeWidth={1.5} />
                            <h4 className="font-serif text-stone-900 font-medium mb-1 text-lg">Secure Payment</h4>
                            <p className="text-sm text-stone-500 font-light">Encrypted Transactions</p>
                        </div>
                        <div className="flex flex-col items-center group">
                            <RefreshCw className="text-amber-600 mb-4 group-hover:scale-110 transition-transform duration-300" size={32} strokeWidth={1.5} />
                            <h4 className="font-serif text-stone-900 font-medium mb-1 text-lg">Easy Returns</h4>
                            <p className="text-sm text-stone-500 font-light">Hassle-free process</p>
                        </div>
                        <div className="flex flex-col items-center group">
                            <Truck className="text-amber-600 mb-4 group-hover:scale-110 transition-transform duration-300" size={32} strokeWidth={1.5} />
                            <h4 className="font-serif text-stone-900 font-medium mb-1 text-lg">Free Shipping</h4>
                            <p className="text-sm text-stone-500 font-light">Fully Insured Delivery</p>
                        </div>
                    </div>
                </section>

                {/* 4. Google Map */}
                <section className="mb-24">
                    <h2 className="text-3xl font-serif text-stone-900 mb-8 text-center">Visit Our Store</h2>
                    <div className="rounded-lg shadow-sm overflow-hidden bg-white p-2 border border-stone-100">
                        <iframe
                            src="https://www.google.com/maps?q=Bagyalakshmi+Jewellery+Tirunelveli&output=embed"
                            className="w-full h-[400px] rounded-md border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Bagyalakshmi Jewellery Location"
                        />
                    </div>
                </section>

                {/* 5. FAQ Section */}
                <section className="mb-24 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-serif text-stone-900 mb-10 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <details className="group bg-white rounded-lg shadow-sm px-6 py-5 [&_summary::-webkit-details-marker]:hidden border border-stone-100">
                            <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-medium text-stone-900 select-none">
                                Do you offer certified jewellery?
                                <span className="transition duration-300 group-open:-rotate-180 text-amber-600">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="mt-4 text-stone-600 leading-relaxed font-light">
                                Yes, all our gold, diamond, and precious stone jewellery pieces come with proper certification from recognized gemological laboratories to guarantee authenticity and quality.
                            </p>
                        </details>

                        <details className="group bg-white rounded-lg shadow-sm px-6 py-5 [&_summary::-webkit-details-marker]:hidden border border-stone-100">
                            <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-medium text-stone-900 select-none">
                                What is your return policy?
                                <span className="transition duration-300 group-open:-rotate-180 text-amber-600">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="mt-4 text-stone-600 leading-relaxed font-light">
                                We offer a secure and simple return process. If you are not completely satisfied with your purchase, you may return the item in its original, unworn condition within our stated return period.
                            </p>
                        </details>

                        <details className="group bg-white rounded-lg shadow-sm px-6 py-5 [&_summary::-webkit-details-marker]:hidden border border-stone-100">
                            <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-medium text-stone-900 select-none">
                                Do you provide custom designs?
                                <span className="transition duration-300 group-open:-rotate-180 text-amber-600">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="mt-4 text-stone-600 leading-relaxed font-light">
                                Absolutely. We specialize in bespoke jewellery design. Our expert artisans will work closely with you to bring your dream design to life, from initial sketches to the final masterpiece.
                            </p>
                        </details>

                        <details className="group bg-white rounded-lg shadow-sm px-6 py-5 [&_summary::-webkit-details-marker]:hidden border border-stone-100">
                            <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-medium text-stone-900 select-none">
                                How long does delivery take?
                                <span className="transition duration-300 group-open:-rotate-180 text-amber-600">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="mt-4 text-stone-600 leading-relaxed font-light">
                                Ready-to-ship items typically arrive within 3-5 business days. Custom orders or personalized pieces may take a bit longer to ensure the meticulous craftsmanship meets our premium standards.
                            </p>
                        </details>
                    </div>
                </section>



            </div>
        </main>
    );
}
