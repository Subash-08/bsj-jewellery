import { getProduct, getCollectionProducts, getProductRecommendations, getComplementaryProducts } from '@/lib/shopify/client';
import { ProductCard } from '@/components/product/ProductCard';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Product } from '@/types/shopify/product';
import type { ReviewSummaryData, JudgeMeReview } from '@/types/review';
import ProductPageClient from '@/components/product/ProductPageClient';
import { getReviews, getReviewSummary, extractNumericProductId } from '@/lib/judgeme';
import { getShopifyHandle, getProductUrl } from '@/lib/routes';
import Link from 'next/link';
import { Playfair_Display, Montserrat } from 'next/font/google';
import { SITE } from '@/lib/seo.config';
import { productSchema, faqSchema, collectionPageSchema, breadcrumbSchema, webPageSchema } from '@/lib/schema';
import { SchemaScript } from '@/components/seo/SchemaScript';
import { QuickAnswer } from '@/components/seo/QuickAnswer';

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '600', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

// ─── FILTER PAGES ────────────────────────────────────────────────────────────

type FilterPageData = {
    h1: string
    metaTitle: string
    metaDescription: string
    quickAnswer: string
    intro: string
    faqs: Array<{ q: string; a: string }>
}

const FILTER_PAGES: Record<string, Record<string, FilterPageData>> = {
    anklets: {
        'bridal-kolusu': {
            h1: 'Bridal Silver Kolusu — Traditional Tamil Nadu Anklets for the Bride',
            metaTitle: 'Bridal Silver Kolusu Online | Traditional Tamil Anklets | Bakya',
            metaDescription:
                'Shop traditional bridal silver kolusu handcrafted in Tirunelveli. Heavy 90-purity silver anklets — snake design, chain kolusu & more. Perfect for Tamil weddings. Bakya since 1997.',
            quickAnswer:
                'Bridal silver kolusu from Bakya are crafted in 90-purity traditional silver, weighing 31–37 grams per pair. Our snake design and chain kolusu are the most popular bridal choices, ideal for Tamil Nadu weddings.',
            intro:
                "In Tamil Nadu, no bride's ensemble is complete without her kolusu. The gentle sound of silver anklets has announced brides at Tamil weddings for centuries. At Bakya, we handcraft traditional bridal kolusu in 90-purity silver — the same grade used for heavy anklets for generations. Each pair weighs between 31 and 37 grams, made to be worn from wedding day through a lifetime. Our snake design kolusu and chain kolusu are the most sought-after bridal choices — substantial, beautifully detailed, and crafted in Tirunelveli.",
            faqs: [
                { q: 'What is the best kolusu design for Tamil brides?', a: 'The snake design kolusu and chain kolusu are the most traditional and popular bridal choices. Both weigh between 36–37 grams, are crafted in 90-purity silver, and carry the heft expected of bridal jewellery.' },
                { q: 'What purity silver is used in bridal kolusu?', a: 'Traditional bridal kolusu at Bakya are made in 90-purity silver, which is the authentic South Indian standard for heavy handcrafted anklets. This grade is more malleable, allowing the thick textured patterns that define a proper kolusu.' },
                { q: 'How heavy should a bridal kolusu be?', a: 'A proper bridal kolusu should weigh between 25–40 grams per pair. Our bridal designs weigh 31.42g (plain), 36.32g (chain kolusu), and 36.72g (snake design).' },
                { q: 'Do you ship bridal kolusu across Tamil Nadu?', a: 'Yes. We ship to Chennai, Madurai, Coimbatore, Trichy, Salem, Tirunelveli, Nagercoil and all cities across Tamil Nadu. Delivery in 3–5 business days.' },
                { q: 'Can I order matching kolusu pairs for bridal functions?', a: 'All our kolusu are sold as pairs. Contact us on WhatsApp for bulk orders for bridal functions, mehendi, or family purchases.' },
            ],
        },
    },
    rings: {
        'under-2000': {
            h1: 'Silver Rings Under ₹2,000 — 92.5 BIS Hallmarked for Women',
            metaTitle: 'Silver Rings Under 2000 | 92.5 BIS Hallmarked | Bakya',
            metaDescription: 'Buy genuine 92.5 BIS hallmarked silver rings under ₹2,000 at Bakya. Heart rings, stone rings & more for women. Handcrafted in Tirunelveli. Ships across Tamil Nadu.',
            quickAnswer: 'Bakya offers 15 silver ring designs under ₹2,000 — all in 92.5 BIS hallmarked sterling silver. Our heart, stone, and infinity rings are priced between ₹1,000 and ₹1,999.',
            intro: 'Finding genuine 92.5 silver rings under ₹2,000 in India is harder than it should be. Many online sellers offer silver-plated brass at that price point. At Bakya, every ring under ₹2,000 is made in genuine 92.5 BIS hallmarked sterling silver — lightweight (1.5–3.4 grams), beautifully detailed, and certified. Our most popular affordable rings include the butterfly white stone ring, the infinity stone ring, the heart with arrow ring, and the classic multiple heart design.',
            faqs: [
                { q: 'Are silver rings under ₹2,000 real silver?', a: 'At Bakya, yes. All our silver rings — including those priced under ₹2,000 — are made in 92.5 BIS hallmarked sterling silver with HUID certification. You can verify authenticity by scanning the hallmark using the BIS CARE app.' },
                { q: 'Which silver ring designs are available under ₹2,000?', a: 'Our butterfly white stone, heart with arrow, infinity stone, multiple heart, single white stone heart, and 2-eye heart rings are all priced under ₹2,000. Each is handcrafted in Tirunelveli.' },
                { q: 'What is the smallest silver ring weight?', a: 'Our lightest ring is the single white stone heart at 1.55 grams. Most rings in this price range weigh between 1.5 and 2.5 grams — ideal for daily wear.' },
                { q: 'Do you offer silver rings in adjustable sizes?', a: 'Our rings are available in fixed Indian sizes (6–22). Contact us on WhatsApp with your size before ordering to ensure the right fit.' },
                { q: 'What is BIS hallmarking on silver rings?', a: 'BIS (Bureau of Indian Standards) hallmarking certifies that your ring contains exactly 92.5% pure silver. The HUID code on each piece can be verified on the BIS CARE mobile app for complete peace of mind.' },
            ],
        },
        'heart-rings': {
            h1: 'Heart Silver Rings for Women — 92.5 BIS Hallmarked Sterling Silver',
            metaTitle: 'Heart Silver Rings for Women | 92.5 Sterling Silver | Bakya',
            metaDescription: 'Buy handcrafted heart silver rings in 92.5 BIS hallmarked sterling silver. Multiple heart, heart stone, heart arrow & guardian love designs. Ships Tamil Nadu. Bakya since 1997.',
            quickAnswer: 'Bakya offers 7 heart silver ring designs — multiple heart, heart with arrow, single heart two circle, guardian love, rose gold heart, heart gold finish, and 2-eye heart. All in 92.5 BIS hallmarked silver, priced ₹1,000–₹2,500.',
            intro: 'Heart rings are the most gifted silver jewellery item in India — and for good reason. A beautifully crafted heart ring in genuine 92.5 silver lasts a lifetime and carries real emotional value. At Bakya, we offer seven distinct heart ring designs — from the minimalist multiple heart band to the ornate guardian love ring with intricate stone setting. Each design is handcrafted in Tirunelveli, weighs between 1.5 and 3.4 grams, and is BIS hallmarked for verified silver purity.',
            faqs: [
                { q: 'What heart ring designs does Bakya offer?', a: 'We offer 7 heart ring designs: multiple heart, heart with arrow, single heart two circle, rose gold heart finish, guardian love ring, heart gold finish, and 2-eye heart. All are available in 92.5 BIS hallmarked sterling silver.' },
                { q: 'Are Bakya heart rings good for gifting?', a: 'Yes — heart rings are our most gifted silver item. They come in gift-ready packaging with a silver care card. The guardian love ring and rose gold heart finish are the most popular gifting choices.' },
                { q: 'What is the price range for heart silver rings?', a: 'Our heart silver rings are priced between ₹1,000 and ₹2,500 depending on the design and weight. All are in 92.5 BIS hallmarked sterling silver.' },
                { q: 'Can heart rings be resized?', a: 'Silver rings can be resized by a professional jeweller. We recommend confirming your ring size before ordering. Contact us on WhatsApp for size guidance.' },
                { q: 'Do you have couple heart rings?', a: 'Yes. Our single heart two circle ring and guardian love ring are popular couple ring designs available in matching pairs. Contact us on WhatsApp for couple ring inquiries.' },
            ],
        },
    },
    bracelets: {
        gifting: {
            h1: 'Silver Bracelets for Gifting — 92.5 BIS Hallmarked | Bakya',
            metaTitle: 'Silver Bracelets for Gifting | 92.5 BIS Hallmarked | Bakya',
            metaDescription: 'Buy handcrafted 92.5 BIS silver bracelets as a gift — heart stone, lock design, square gold plated & music charm. Gift-ready packaging. Ships Tamil Nadu. Bakya since 1997.',
            quickAnswer: 'The best silver bracelets for gifting from Bakya: heart stone bracelet, lock design bracelet, music charm bracelet, and square gold plated bracelet — all in 92.5 BIS silver (5.95–7.71g), gift-packaged, priced ₹2,000–₹4,500.',
            intro: 'A silver bracelet is one of the most thoughtful gifts you can give — it is wearable, meaningful, and holds its value. At Bakya, our silver bracelets for gifting are handcrafted in 92.5 BIS hallmarked sterling silver at our Tirunelveli workshop. Four designs are available: the heart stone bracelet (our bestseller for gifting), the lock design bracelet (popular for couples), the music charm bracelet, and the square gold plated bracelet. Each bracelet weighs 5.95–7.71 grams and ships in a Bakya gift box with a silver care card.',
            faqs: [
                { q: 'Which silver bracelet is best for gifting?', a: 'The heart stone bracelet is our most gifted design — it is beautiful, lightweight (7.71g), and universally appreciated. The lock design bracelet is popular for couples and close friends.' },
                { q: 'Does the bracelet come in gift packaging?', a: 'Yes. All Bakya bracelets are packaged in a premium jewellery box with a silver care card — no additional gift wrapping needed.' },
                { q: 'What occasions are silver bracelets suitable for?', a: 'Silver bracelets from Bakya are gifted for birthdays, anniversaries, graduations, first salary celebrations, Tamil festivals (Pongal, Diwali), and weddings.' },
                { q: 'What is the price range for gifting bracelets?', a: 'Our silver bracelets are priced between ₹2,000 and ₹4,500 depending on design and weight. All are in 92.5 BIS hallmarked sterling silver.' },
                { q: 'Do you ship silver gift bracelets pan-India?', a: 'Yes. We ship across Tamil Nadu (3–5 business days) and pan-India. Orders are dispatched within 1–2 business days in secure packaging.' },
            ],
        },
    },
    chains: {
        'mens-chains': {
            h1: 'Silver Chains for Men — 92.5 BIS Hallmarked Sterling Silver',
            metaTitle: 'Silver Chains for Men | 92.5 Sterling Silver | Bakya',
            metaDescription: 'Buy 92.5 BIS hallmarked silver chains for men at Bakya. Ball chain, box chain, snake design & bullet type — 18–20.5 inch lengths. Handcrafted in Tirunelveli. Ships Tamil Nadu.',
            quickAnswer: "Bakya's silver chains for men are available in ball plain, box small, snake design, and bullet type designs — all in 92.5 BIS hallmarked sterling silver, 18–20.5 inches long, priced ₹1,200–₹3,500.",
            intro: "Silver chains for men are becoming increasingly popular in India — worn alone as a minimalist neck piece or layered with a pendant. At Bakya, we offer four silver chain designs suited to men's wear: the classic ball chain (round spherical links, casual and versatile), the box chain (square links, structured and modern), the snake design chain (flat flexible links, sleek and everyday), and the bullet type chain (distinctive elongated links for a bolder look). All are in 92.5 BIS hallmarked sterling silver, 18–20.5 inches in length, and priced for everyday wear.",
            faqs: [
                { q: 'Which silver chain design is most popular for men?', a: 'The ball chain and snake design chain are the most popular for men. The ball chain has a casual everyday look, while the snake chain is sleek and versatile enough for both casual and formal wear.' },
                { q: 'What length silver chains are available for men?', a: "Our men's chains are available in 18-inch and 20.5-inch lengths. The 20.5-inch length sits at the collarbone and is the most popular for men wearing a chain alone." },
                { q: 'Can I wear a silver chain with a pendant?', a: 'Yes. All our chains are designed to pair with our pendant collection. The snake design chain pairs best with our Trishul, Om, and Cross pendants.' },
                { q: 'How do I care for a silver chain for daily wear?', a: 'Wipe with a soft cloth after each wear. Store in a dry pouch. Avoid contact with sweat, cologne, and water. For tarnish, use a mild baking soda solution.' },
                { q: 'Are Bakya silver chains BIS hallmarked?', a: 'Yes. All Bakya silver chains — including those for men — carry BIS hallmarking with HUID certification. This verifies 92.5% pure silver content.' },
            ],
        },
    },
    pendants: {
        religious: {
            h1: 'Religious Silver Pendants — Ganesha, Trishul & Cross | Bakya',
            metaTitle: 'Religious Silver Pendants | Ganesha Trishul Cross Islamic | Bakya',
            metaDescription: 'Buy 92.5 gold plated BIS silver religious pendants — Vinayagar, Trishul, Cross, and Islamic designs. Handcrafted in Tirunelveli by Bakya since 1997. Ships across Tamil Nadu.',
            quickAnswer: 'Bakya religious silver pendants include Vinayagar (Ganesha), Trishul, Cross (simple and ornate), and Islamic crescent designs — all in 92.5 gold-plated BIS hallmarked silver, priced ₹800–₹1,500. Ideal for gifting at naming ceremonies and religious occasions.',
            intro: 'Religious silver pendants carry deep meaning — worn close to the heart as a symbol of faith, protection, and devotion. At Bakya, our religious pendant collection is handcrafted in 92.5 sterling silver with gold micron plating at our Tirunelveli workshop. We offer designs for Hindu, Christian, and Islamic devotion: the Vinayagar dollar pendant (our bestselling religious piece), the Trishul dollar pendant, the Cross pendant, the round Muslim dollar pendant, and the square Muslim dollar pendant. Each pendant is lightweight (under 5 grams), BIS hallmarked, and comes gift-ready.',
            faqs: [
                { q: 'What religious pendant designs does Bakya offer?', a: 'We offer: Vinayagar (Ganesha) dollar pendant, Trishul dollar pendant, Cross pendant, round Muslim dollar pendant, and square Muslim dollar pendant. All in 92.5 gold-plated BIS hallmarked silver.' },
                { q: 'Are religious pendants good for gifting?', a: 'Yes — our religious pendants are among our most-gifted items for naming ceremonies, thread ceremonies, first communion, Eid, and house-warming gifts.' },
                { q: 'What silver purity are the religious pendants?', a: 'All religious pendants are made in 92.5 sterling silver with gold micron plating, BIS hallmarked with HUID certification.' },
                { q: 'Do the pendants come with a chain?', a: 'Pendants are sold separately from chains. We recommend pairing with our snake design silver chain (16 or 18 inch) for the best look.' },
                { q: 'How long does the gold plating last?', a: 'With proper care (avoiding water, perfume, and chemicals), our gold micron plating typically lasts 1–2 years. Avoid storing in humid conditions.' },
            ],
        },
    },
}

// ─────────────────────────────────────────────────────────────────────────────

type Props = {
    params: Promise<{ category: string; product: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;

    // Filter page branch — keep as-is
    const filterData = FILTER_PAGES[params.category]?.[params.product];
    if (filterData) {
        return {
            title: filterData.metaTitle,
            description: filterData.metaDescription,
            alternates: {
                canonical: `${SITE.domain}/silver-jewellery/${params.category}/${params.product}`,
            },
            robots: { index: true, follow: true },
            openGraph: {
                title: filterData.metaTitle,
                description: filterData.metaDescription,
                url: `${SITE.domain}/silver-jewellery/${params.category}/${params.product}`,
            },
        };
    }

    // Regular product branch
    const product = await getProduct(params.product);
    if (!product) return { robots: { index: false } };

    const productUrl = `${SITE.domain}/silver-jewellery/${params.category}/${params.product}`;
    const productImage = product.images?.[0]?.url ?? `${SITE.domain}/og-default.jpg`;

    // Build clean SEO title — no double brand name
    const cleanTitle = product.seo?.title
        ? product.seo.title.replace(/\|\s*Bakya\s*$/i, '').trim()
        : product.title.replace(/\|\s*Bakya.*/i, '').trim();
    const seoTitle = `${cleanTitle} | Bakya`;

    // Build clean meta description — not the bullet-list body copy
    const seoDescription = product.seo?.description
        && product.seo.description.length >= 60
        && product.seo.description.length <= 165
        ? product.seo.description
        : `Buy ${cleanTitle} handcrafted in 92.5 BIS hallmarked sterling silver. ${product.productType ? `Premium ${product.productType.toLowerCase()} for women.` : ''} Trusted by families since 1997. Ships across Tamil Nadu.`.slice(0, 160);

    const keywords = [
        cleanTitle.toLowerCase(),
        '92.5 silver',
        'BIS hallmarked silver',
        product.productType?.toLowerCase() ?? 'silver jewellery',
        'silver jewellery Tamil Nadu',
        'Tirunelveli jewellers',
        'Bakya',
    ].filter(Boolean);

    return {
        title: seoTitle,
        description: seoDescription,
        keywords,
        alternates: { canonical: productUrl },
        robots: { index: true, follow: true },
        openGraph: {
            type: 'website',
            title: seoTitle,
            description: seoDescription,
            url: productUrl,
            images: [{
                url: productImage,
                width: product.images?.[0]?.width ?? 800,
                height: product.images?.[0]?.height ?? 800,
                alt: product.images?.[0]?.altText ?? `${cleanTitle} — Bakya Silver Jewellery`,
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: seoTitle,
            description: seoDescription,
            images: [productImage],
        },
    };
}

export default async function ProductPage(props: Props) {
    const params = await props.params;

    // ── Filter page branch ────────────────────────────────────────────────────
    const filterData = FILTER_PAGES[params.category]?.[params.product];
    if (filterData) {
        const pageUrl = `${SITE.domain}/silver-jewellery/${params.category}/${params.product}`;
        const categoryLabel = params.category.charAt(0).toUpperCase() + params.category.slice(1);
        const filterLabel = filterData.h1.split('—')[0]?.trim() ?? filterData.h1;
        const whatsappPhone = SITE.social.whatsapp.replace(/[^0-9]/g, '');
        const shopifyHandle = getShopifyHandle(params.category);
        const filterResult = await getCollectionProducts({ handle: shopifyHandle }).catch(() => undefined);
        const filterProducts = filterResult?.products?.slice(0, 8) ?? [];
        return (
            <>
                <SchemaScript schema={[
                    collectionPageSchema({ name: filterData.h1, description: filterData.metaDescription, url: pageUrl, products: [] }),
                    faqSchema(filterData.faqs),
                    breadcrumbSchema([
                        { name: 'Home', url: '/' },
                        { name: 'Silver Jewellery', url: '/silver-jewellery' },
                        { name: categoryLabel, url: `/silver-jewellery/${params.category}` },
                        { name: filterLabel, url: pageUrl },
                    ]),
                ]} />
                <main className="bg-white min-h-screen">
                    <div className="bg-[#230532] py-10 md:py-14 px-4 text-center">
                        <nav aria-label="Breadcrumb" className="mb-4">
                            <p className={`${montserrat.className} text-[#EAE2F0]/70 text-[11px] uppercase tracking-widest flex items-center justify-center gap-2`}>
                                <Link href="/" className="hover:text-[#EAE2F0] transition-colors">Home</Link>
                                <span>&rsaquo;</span>
                                <Link href="/silver-jewellery" className="hover:text-[#EAE2F0] transition-colors">Silver Jewellery</Link>
                                <span>&rsaquo;</span>
                                <Link href={`/silver-jewellery/${params.category}`} className="hover:text-[#EAE2F0] transition-colors">{categoryLabel}</Link>
                            </p>
                        </nav>
                        <h1 className={`${playfair.className} text-white text-2xl md:text-[38px] font-bold max-w-3xl mx-auto leading-tight`}>
                            {filterData.h1}
                        </h1>
                    </div>
                    <div className="max-w-[1060px] mx-auto px-4 md:px-8 py-10">
                        <QuickAnswer answer={filterData.quickAnswer} />
                        <p className={`${montserrat.className} text-stone-600 text-[15px] leading-relaxed mb-10 max-w-2xl`}>{filterData.intro}</p>
                        <div className="mb-14">
                            <h2 className={`${playfair.className} text-[#230532] text-xl md:text-2xl font-bold mb-5`}>
                                {filterLabel}
                            </h2>
                            {filterProducts.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {filterProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} collectionHandle={params.category} />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-lg border border-[#EDE8E0] bg-[#FAF8F5] py-10 text-center">
                                    <p className={`${montserrat.className} text-stone-400 text-sm`}>Products coming soon</p>
                                </div>
                            )}
                            <div className="mt-6">
                                <Link href={`/silver-jewellery/${params.category}`} className={`${montserrat.className} inline-block text-[#230532] text-sm font-semibold border border-[#230532] px-5 py-2.5 rounded-full hover:bg-[#EAE2F0] transition-colors`}>
                                    Browse All {categoryLabel} →
                                </Link>
                            </div>
                        </div>
                        <section aria-labelledby="faq-heading" className="mb-12">
                            <h2 id="faq-heading" className={`${playfair.className} text-[#230532] text-2xl md:text-[28px] font-bold mb-6`}>Common Questions</h2>
                            <div className="space-y-3">
                                {filterData.faqs.map((faq, i) => (
                                    <details key={i} className="border border-stone-200 rounded-lg overflow-hidden">
                                        <summary className={`${montserrat.className} font-semibold text-[#230532] cursor-pointer text-[14px] md:text-[15px] px-5 py-4 list-none flex items-center justify-between hover:bg-[#EAE2F0]/30 transition-colors`}>
                                            {faq.q}<span className="text-[#D4AF37] text-lg ml-3 flex-shrink-0">+</span>
                                        </summary>
                                        <p className={`${montserrat.className} text-stone-600 text-[14px] leading-relaxed px-5 pb-4 pt-1`}>{faq.a}</p>
                                    </details>
                                ))}
                            </div>
                        </section>
                        <div className="pt-6 border-t border-stone-100">
                            <div className="flex flex-wrap items-center gap-3">
                                <Link href={`/silver-jewellery/${params.category}`} className={`${montserrat.className} text-[#230532] text-[12px] font-semibold border border-[#230532] px-4 py-2 rounded-full hover:bg-[#EAE2F0] transition-colors`}>All {categoryLabel}</Link>
                                <Link href="/silver-jewellery" className={`${montserrat.className} text-stone-500 text-[12px] border border-stone-300 px-4 py-2 rounded-full hover:bg-stone-50 transition-colors`}>All Silver Jewellery</Link>
                                <Link href="/silver-gifts-for-women" className={`${montserrat.className} text-stone-500 text-[12px] border border-stone-300 px-4 py-2 rounded-full hover:bg-stone-50 transition-colors`}>Silver Gifts</Link>
                                <a href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Hi Bakya! I want to know more about ${filterLabel}`)}`} target="_blank" rel="noopener noreferrer" className={`${montserrat.className} ml-auto flex items-center gap-2 text-[12px] font-semibold text-white bg-[#25D366] px-4 py-2 rounded-full hover:bg-[#20bd5a] transition-colors`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.49" /></svg>
                                    Ask on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }
    // ─────────────────────────────────────────────────────────────────────────────

    const product = await getProduct(params.product);

    if (!product) {
        notFound();
    }

    const shopifyCollectionHandle = getShopifyHandle(params.category);

    // Validate if product belongs to this category
    const belongsToCategory = product.collections?.edges.some(
        (edge) => edge.node.handle === shopifyCollectionHandle
    );

    if (!belongsToCategory && shopifyCollectionHandle !== 'all') {
        notFound();
    }

    const { jewelryMetafields } = product;

    // ── Specifications ──────────────────────────────────────────────────
    const specifications = [
        { label: 'Metal Type', value: jewelryMetafields?.['Metal Type'] },
        { label: 'Purity', value: jewelryMetafields?.['Purity Percentage'] ? `${jewelryMetafields['Purity Percentage']}%` : (jewelryMetafields?.['Purity'] || null) },
        { label: 'Gross Weight', value: jewelryMetafields?.['Gross Weight'] ? `${jewelryMetafields['Gross Weight']} g` : null },
        { label: 'Net Weight', value: jewelryMetafields?.['Net Weight'] ? `${jewelryMetafields['Net Weight']} g` : null },
        { label: 'Stone Weight', value: jewelryMetafields?.['Stone Weight'] ? `${jewelryMetafields['Stone Weight']} carats` : null },
        { label: 'Stone Type', value: jewelryMetafields?.['Stone Type'] },
        { label: 'Stone Shape', value: jewelryMetafields?.['Stone Shape'] },
        { label: 'Stone Color', value: jewelryMetafields?.['Stone Color'] },
        { label: 'Category', value: jewelryMetafields?.['Jewellery Category'] },
        { label: 'Occasion', value: jewelryMetafields?.['Occasion'] },
        { label: 'Gender', value: jewelryMetafields?.['Gender'] },
        { label: 'Certification', value: jewelryMetafields?.['Certification Available'] ? 'Certified' : null },
        { label: 'Hallmark', value: jewelryMetafields?.['Hallmark Type'] },
        { label: 'Metal Color', value: jewelryMetafields?.['Metal Color'] },
        { label: 'Country of Origin', value: jewelryMetafields?.['Country of Origin'] },
    ].filter(spec => spec.value);

    // ── Price Breakdown ────────────────────────────────────────────────
    const priceBreakdown = {
        metalRate: jewelryMetafields?.['Metal Rate'] ? String(jewelryMetafields['Metal Rate']) : undefined,
        makingCharges: jewelryMetafields?.['Making Charge Value'] ? String(jewelryMetafields['Making Charge Value']) : undefined,
        gst: jewelryMetafields?.['GST Percentage'] ? String(jewelryMetafields['GST Percentage']) : undefined,
        gstAmount: jewelryMetafields?.['GST Amount'] ? String(jewelryMetafields['GST Amount']) : undefined,
    };

    // ── Breadcrumb ─────────────────────────────────────────────────────
    const currentCollectionNode = product.collections?.edges.find(e => e.node.handle === shopifyCollectionHandle)?.node;
    const breadcrumb = {
        collectionTitle: currentCollectionNode?.title || (shopifyCollectionHandle === 'all' ? 'All Jewellery' : product.productType || ''),
        collectionHandle: shopifyCollectionHandle,
        shortTitle: product.title.replace(/\s*\|\s*Bakya/i, '').slice(0, 60),
    };

    let relatedProducts: Product[] = [];

    try {
        // ONLY manual products (Shopify admin)
        relatedProducts = await getComplementaryProducts(product.handle);

        // Optional fallback (ONLY if empty)
        if (!relatedProducts.length && shopifyCollectionHandle) {
            const result = await getCollectionProducts({ handle: shopifyCollectionHandle });

            relatedProducts = result?.products
                ?.filter((p) => p.id !== product.id)
                ?.slice(0, 4) || [];
        }

    } catch (err) {
        console.error('Related product error:', err);
    }

    // ── JSON-LD Structured Data ────────────────────────────────────────
    const minPrice = product.priceRange.minVariantPrice;
    const productUrl = `${SITE.domain}/silver-jewellery/${shopifyCollectionHandle}/${params.product}`;

    // Reviews are disabled — use empty data
    const emptyReviews: { reviews: JudgeMeReview[]; summary: ReviewSummaryData } = { reviews: [], summary: { average: 0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } } };
    const reviewData = emptyReviews;

    // Extract weight and GTIN from metafields
    const weightRaw = product.jewelryMetafields?.['Net Weight'] || product.jewelryMetafields?.['Gross Weight'];
    const weightGrams = weightRaw ? parseFloat(String(weightRaw)) : undefined;
    const barcode = (product.variants?.[0] as any)?.barcode ?? undefined;

    const productSchemaData = productSchema({
        name: product.title,
        description: product.description,
        images: product.images.map(img => img.url),
        price: minPrice.amount,
        currency: minPrice.currencyCode,
        sku: product.variants?.[0]?.sku || product.handle,
        mpn: product.variants?.[0]?.sku || product.handle,
        ...(barcode ? { gtin13: barcode } : {}),
        ...(weightGrams ? { weightGrams } : {}),
        url: productUrl,
        category: product.productType,
        availability: product.availableForSale ? 'InStock' : 'OutOfStock',
        merchantReturnLink: `${SITE.domain}/return-refund-policy`,
    });

    const breadcrumbData = breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Silver Jewellery', url: '/silver-jewellery' },
        { name: breadcrumb.collectionTitle || product.productType, url: `/silver-jewellery/${shopifyCollectionHandle}` },
        { name: product.title.replace(/\|\s*Bakya.*/i, '').trim().slice(0, 60), url: productUrl },
    ]);

    const webPageData = webPageSchema({
        type: 'ItemPage',
        name: product.seo?.title || product.title,
        description: product.seo?.description || product.description?.slice(0, 160) || '',
        url: productUrl,
    });

    const cleanProductTitle = product.title.replace(/\|\s*Bakya.*/i, '').trim();
    const productFaqs = [
        {
            q: `Is the ${cleanProductTitle} made of real silver?`,
            a: `Yes. This is genuine 92.5 BIS hallmarked sterling silver with HUID certification. You can verify purity by scanning the hallmark using the BIS CARE app.`,
        },
        {
            q: 'What is the return policy?',
            a: 'We offer a 7-day return policy for damaged or wrong items. Contact us at bagyalakshmijewellers97@gmail.com within 7 days of receiving your order.',
        },
        {
            q: 'How long does delivery take?',
            a: 'Standard delivery takes 3–5 business days across Tamil Nadu. Orders are dispatched within 1–2 business days from our Tirunelveli workshop.',
        },
        {
            q: 'Is this product good for gifting?',
            a: 'Yes. All Bakya silver jewellery ships in a premium jewellery box with a silver care card, making it ready to gift without extra packaging.',
        },
    ];

    return (
        <>
            <SchemaScript schema={[
                productSchemaData,
                breadcrumbData,
                webPageData,
                faqSchema(productFaqs),
            ]} />
            <ProductPageClient
                product={product}
                specifications={specifications}
                priceBreakdown={priceBreakdown}
                breadcrumb={breadcrumb}
                relatedProducts={relatedProducts}
                initialReviews={reviewData.reviews}
                initialSummary={reviewData.summary}
            />
        </>
    );
}