import { Mail, Phone, MapPin, ShieldCheck, Lock, RefreshCw, Truck, MessageCircle } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="bg-white min-h-screen pb-20 font-sans">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                .font-montserrat { font-family: 'Montserrat', sans-serif; }
                .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
                .font-playfair { font-family: 'Playfair Display', serif; }
            `}</style>

            {/* 1. Hero Section */}
            <section className="relative w-full h-[300px] md:h-[350px] flex flex-col items-center justify-center text-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"
                />
                <div className="absolute inset-0 bg-stone-900/40" /> {/* Dark overlay */}
                <div className="relative z-10 px-4 mt-10">
                    <div className="flex items-center justify-center gap-4 text-white mb-2">
                        <span className="text-2xl">✦</span>
                        <h1 className="text-4xl md:text-5xl font-playfair font-semibold">
                            Contact us
                        </h1>
                        <span className="text-2xl">✦</span>
                    </div>
                    <p className="mt-2 text-white font-montserrat italic text-lg max-w-xl mx-auto drop-shadow-md">
                        We're here to help you shine — reach out to us anytime.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 max-w-6xl mt-16">

                {/* 2. Contact Form & Why Contact Us */}
                <section className="mb-20">
                    <div className="flex flex-col md:flex-row items-stretch">

                        {/* Left side: Form */}
                        <div className="flex-1 p-4 md:p-10 md:pl-0 bg-white md:pr-16">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-[13px] font-jakarta font-semibold text-[#18181b] mb-2">
                                            First name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            placeholder="First name"
                                            required
                                            className="w-full border border-stone-300 rounded-[4px] px-4 py-3 font-montserrat text-[14px] focus:border-[#230532] outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-[13px] font-jakarta font-semibold text-[#18181b] mb-2">
                                            Last name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            placeholder="Last name"
                                            required
                                            className="w-full border border-stone-300 rounded-[4px] px-4 py-3 font-montserrat text-[14px] focus:border-[#230532] outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-[13px] font-jakarta font-semibold text-[#18181b] mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="you@gmail.com"
                                        required
                                        className="w-full border border-stone-300 rounded-[4px] px-4 py-3 font-montserrat text-[14px] focus:border-[#230532] outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-[13px] font-jakarta font-semibold text-[#18181b] mb-2">
                                        Phone number
                                    </label>
                                    <div className="flex border border-stone-300 rounded-[4px] overflow-hidden focus-within:border-[#230532] transition-colors">
                                        <select className="bg-transparent pl-4 pr-2 py-3 border-r border-stone-300 font-montserrat text-[14px] text-stone-600 outline-none">
                                            <option>In ⌄</option>
                                        </select>
                                        <input
                                            type="tel"
                                            id="phone"
                                            placeholder="+91 12345 67890"
                                            className="w-full px-4 py-3 font-montserrat text-[14px] outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-[13px] font-jakarta font-semibold text-[#18181b] mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        required
                                        className="w-full border border-stone-300 rounded-[4px] px-4 py-3 font-montserrat text-[14px] focus:border-[#230532] outline-none transition-colors resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-[#230532] text-white px-6 py-3.5 rounded-[4px] hover:opacity-90 transition-opacity w-full font-jakarta text-[14px] font-semibold tracking-wide mt-2"
                                >
                                    Send message
                                </button>
                            </form>
                        </div>

                        {/* Right side visual: Why Contact Us */}
                        <div className="flex-1 relative bg-[#180323] overflow-hidden text-white min-h-[500px]">
                            <div className="absolute inset-0 bg-[url('/contact-img1.png')] bg-cover bg-center opacity-50"></div>

                            <div className="relative z-10 p-10 md:p-14">
                                <h3 className="font-playfair font-semibold text-[28px] mb-8 tracking-wide">Why Contact Us</h3>

                                <ul className="space-y-6">
                                    <li>
                                        <h4 className="font-montserrat italic text-[15px] mb-1 text-white">
                                            • Personalized Jewellery Guidance
                                        </h4>
                                        <p className="font-montserrat text-[14px] font-light text-white/70 pl-3 leading-relaxed">
                                            Get expert advice to find the perfect piece for your style and occasion.
                                        </p>
                                    </li>
                                    <li>
                                        <h4 className="font-montserrat italic text-[15px] mb-1 text-white">
                                            • Hassle-Free Support
                                        </h4>
                                        <p className="font-montserrat text-[14px] font-light text-white/70 pl-3 leading-relaxed">
                                            From product queries to order assistance, we make everything simple and smooth.
                                        </p>
                                    </li>
                                    <li>
                                        <h4 className="font-montserrat italic text-[15px] mb-1 text-white">
                                            • Trusted & Certified Service
                                        </h4>
                                        <p className="font-montserrat text-[14px] font-light text-white/70 pl-3 leading-relaxed">
                                            We ensure authenticity, transparency, and complete peace of mind.
                                        </p>
                                    </li>
                                    <li>
                                        <h4 className="font-montserrat italic text-[15px] mb-1 text-white">
                                            • Quick & Reliable Response
                                        </h4>
                                        <p className="font-montserrat text-[14px] font-light text-white/70 pl-3 leading-relaxed">
                                            Our team is always ready to assist you with prompt and helpful solutions.
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Chat Section */}
                <section className="mb-24 flex flex-col items-center">
                    <h3 className="font-montserrat text-[14px] text-stone-600 mb-1 font-medium">Quick Chat</h3>
                    <div className="flex items-center gap-4 text-[#230532] mb-2">
                        <span className="text-xl">✦</span>
                        <h2 className="text-[28px] font-playfair font-semibold">Chat With Us</h2>
                        <span className="text-xl">✦</span>
                    </div>
                    <p className="font-montserrat text-[14px] text-[#18181b] font-medium mb-10">
                        Start a conversation with our experts
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl">
                        {/* Box 1 */}
                        <div className="flex-1 border border-stone-300 rounded-sm bg-white text-center">
                            <div className="border-b border-stone-300 py-2 px-2">
                                <span className="font-jakarta text-[11px] text-stone-600 font-medium tracking-wide">Talk directly with our team</span>
                            </div>
                            <div className="py-4 px-4 flex items-center justify-center gap-3">
                                <Phone size={18} className="text-[#230532] fill-[#230532]" />
                                <span className="font-jakarta font-semibold text-[#18181b] text-[16px]">Call Us : +91 12345 67890</span>
                            </div>
                        </div>

                        {/* Box 2 */}
                        <div className="flex-1 border border-stone-300 rounded-sm bg-white text-center">
                            <div className="border-b border-stone-300 py-2 px-2">
                                <span className="font-jakarta text-[11px] text-stone-600 font-medium tracking-wide">Get instant assistance</span>
                            </div>
                            <div className="py-4 px-4 flex items-center justify-center gap-3">
                                <MessageCircle size={20} className="text-[#230532] fill-[#230532]" />
                                <span className="font-jakarta font-semibold text-[#18181b] text-[16px]">Chat with Us</span>
                            </div>
                        </div>

                        {/* Box 3 */}
                        <div className="flex-1 border border-stone-300 rounded-sm bg-white text-center">
                            <div className="border-b border-stone-300 py-2 px-2">
                                <span className="font-jakarta text-[11px] text-stone-600 font-medium tracking-wide">We'll respond within 24 hours</span>
                            </div>
                            <div className="py-4 px-4 flex items-center justify-center gap-3">
                                <Mail size={20} className="text-[#230532] fill-[#230532]" />
                                <span className="font-jakarta font-semibold text-[#18181b] text-[16px]">Email Us</span>
                            </div>
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
                {/* 6. Trust Strip */}
                <section className="pb-16">
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
