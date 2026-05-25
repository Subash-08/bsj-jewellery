import Link from 'next/link'
import type { Metadata } from 'next'
import { Playfair_Display, Montserrat } from 'next/font/google'
import { SITE } from '@/lib/seo.config'
import { faqSchema, collectionPageSchema, breadcrumbSchema } from '@/lib/schema'
import { SchemaScript } from '@/components/seo/SchemaScript'
import { QuickAnswer } from '@/components/seo/QuickAnswer'
import { getCollectionProducts } from '@/lib/shopify/client'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductGridMixedLayout } from '@/components/collection-showcase/ProductGridMixedLayout'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '600', '700'] })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600'] })

const PAGE_URL = `${SITE.domain}/silver-gifts-for-women`

export const metadata: Metadata = {
  title: 'Silver Jewellery Gifts for Women | 92.5 BIS Hallmarked | Bakya',
  description:
    'Buy silver jewellery gifts for women — BIS hallmarked 92.5 silver bracelets, pendants & rings in gift-ready packaging. Perfect for birthdays, anniversaries & Tamil festivals. Bakya, Tirunelveli.',
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Silver Jewellery Gifts for Women | 92.5 BIS Hallmarked | Bakya',
    description:
      'BIS hallmarked 92.5 silver bracelets, pendants & rings in gift-ready packaging. Birthdays, anniversaries, Pongal, Diwali. Ships Tamil Nadu.',
    url: PAGE_URL,
  },
}

const QUICK_ANSWER =
  "The best silver jewellery gifts for women from Bakya: heart stone bracelet (bestseller), heart silver rings, religious pendants, and silver chains — all in 92.5 BIS hallmarked silver, gift-packaged, priced ₹800–₹4,500. Ships across Tamil Nadu in 3–5 business days."

const INTRO =
  "A silver jewellery gift carries meaning that most gifts cannot match — it is wearable, cherished, and holds its intrinsic value. At Bakya, our silver jewellery gifts for women are crafted in 92.5 BIS hallmarked sterling silver at our Tirunelveli workshop, where artisans have been perfecting silver craft since 1997. Our most gifted pieces include the heart stone bracelet (our bestselling gift item), heart silver rings in multiple designs, religious pendants for naming ceremonies and house warmings, and classic silver chains. Every gift order is packed in a Bakya premium jewellery box with a silver care card — no additional gift wrapping needed. We ship across Tamil Nadu and pan-India, with orders dispatched in 1–2 business days."

const FAQS = [
  {
    q: 'What is the best silver jewellery gift for a woman?',
    a: 'The heart stone bracelet is our most gifted piece — beautiful, lightweight (7.71g), and universally appreciated. For more personal gifts, heart silver rings or religious pendants are equally popular choices.',
  },
  {
    q: 'What occasions are silver jewellery gifts suitable for?',
    a: "Silver jewellery from Bakya is gifted for birthdays, anniversaries, Valentine's Day, Mother's Day, baby shower, naming ceremonies, thread ceremonies, first salary celebrations, and Tamil festivals like Pongal and Diwali.",
  },
  {
    q: 'Does the gift come in packaging?',
    a: 'Yes. All Bakya jewellery comes in a premium jewellery box with a silver care card — suitable for gifting without any additional wrapping. We are adding personalised gift message cards soon.',
  },
  {
    q: 'What is the price range for silver gifts for women?',
    a: 'Silver jewellery gifts from Bakya are priced ₹800–₹4,500. Pendants start from ₹800, rings from ₹1,000, chains from ₹1,200, and bracelets from ₹2,000 — all in 92.5 BIS hallmarked sterling silver.',
  },
  {
    q: 'Is 92.5 BIS hallmarked silver a good gift?',
    a: 'Yes — BIS hallmarked silver jewellery is a certified gift. The HUID on each piece can be verified on the BIS CARE app, giving the recipient confidence in the quality. It holds intrinsic silver value and can be worn for years.',
  },
  {
    q: 'Do you ship silver gift jewellery pan-India?',
    a: 'Yes. We ship silver jewellery gifts across Tamil Nadu (3–5 business days) and pan-India. Orders are dispatched within 1–2 business days in secure packaging.',
  },
]

export default async function SilverGiftsForWomenPage() {
  const whatsappPhone = SITE.social.whatsapp.replace(/[^0-9]/g, '')
  const [braceletResult, ringResult] = await Promise.all([
    getCollectionProducts({ handle: 'bracelet' }).catch(() => undefined),
    getCollectionProducts({ handle: 'ring' }).catch(() => undefined),
  ])
  const products = [
    ...(braceletResult?.products?.slice(0, 4) ?? []),
    ...(ringResult?.products?.slice(0, 4) ?? []),
  ]

  return (
    <>
      <SchemaScript
        schema={[
          collectionPageSchema({
            name: 'Silver Jewellery Gifts for Women — BIS Hallmarked | Bakya',
            description:
              'BIS hallmarked 92.5 silver bracelets, pendants & rings in gift-ready packaging.',
            url: PAGE_URL,
            products: [],
          }),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Silver Gifts for Women', url: '/silver-gifts-for-women' },
          ]),
        ]}
      />

      <main className="bg-white min-h-screen">

        {/* Hero */}
        <div className="bg-[#230532] py-10 md:py-14 px-4 text-center">
          <nav aria-label="Breadcrumb" className="mb-4">
            <p className={`${montserrat.className} text-[#EAE2F0]/70 text-[11px] uppercase tracking-widest flex items-center justify-center gap-2`}>
              <Link href="/" className="hover:text-[#EAE2F0] transition-colors">Home</Link>
              <span>&rsaquo;</span>
              <span className="text-[#EAE2F0]/50">Silver Gifts for Women</span>
            </p>
          </nav>
          <h1 className={`${playfair.className} text-white text-2xl md:text-[38px] font-bold max-w-3xl mx-auto leading-tight`}>
            Silver Jewellery Gifts for Women — BIS Hallmarked
          </h1>
          <p className={`${montserrat.className} text-[#EAE2F0]/70 text-[13px] mt-3 max-w-xl mx-auto`}>
            Bracelets • Rings • Pendants • Chains — Gift-ready packaging, ships Tamil Nadu
          </p>
        </div>

        <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-10">

          {/* Intro Text - Minimal, catalog-style */}
          <div className="mb-10 text-center">
            <h2 className={`${playfair.className} text-[#230532] text-[22px] md:text-[28px] font-bold mb-4`}>
              Curated Silver Gifts
            </h2>
            <p className={`${montserrat.className} text-stone-600 text-[13px] md:text-[14px] leading-relaxed max-w-2xl mx-auto`}>
              Bracelets, rings &amp; pendants in 92.5 BIS hallmarked silver — gift-ready packaging included.
            </p>
          </div>

          {/* Mixed Editorial Product Grid */}
          <div className="mb-14">
            {products.length > 0 ? (
              <ProductGridMixedLayout
                products={products}
                collectionHandle="all"
                editorialBlocks={[
                  {
                    position: 4,
                    type: "image-collage",
                    content: {
                      title: "Gift-Ready",
                      description: "Premium packaging with every order. No extra wrapping needed.",
                      imageUrl: products[1]?.images?.[0]?.url || products[0]?.images?.[0]?.url || 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
                      imageUrl2: products[2]?.images?.[0]?.url || products[0]?.images?.[1]?.url || 'https://images.unsplash.com/photo-1602752250013-1a067ed776c8?auto=format&fit=crop&q=80&w=800'
                    }
                  },
                  {
                    position: 9,
                    type: "quote-block",
                    content: {
                      quote: "A silver jewellery gift carries meaning that most gifts cannot match — it is wearable, cherished, and holds its intrinsic value.",
                    }
                  }
                ]}
              />
            ) : (
              <div className="rounded-[16px] border border-[#EDE8E0] bg-[#FAF8F5] py-16 text-center shadow-sm">
                <p className={`${montserrat.className} text-stone-400 text-sm`}>Products coming soon</p>
              </div>
            )}
          </div>

          {/* FAQ */}
          <section aria-labelledby="faq-heading" className="mb-12">
            <h2
              id="faq-heading"
              className={`${playfair.className} text-[#230532] text-2xl md:text-[28px] font-bold mb-6`}
            >
              Silver Gifts — Common Questions
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <details
                  key={i}
                  className="border border-stone-200 rounded-lg overflow-hidden group"
                >
                  <summary className={`${montserrat.className} font-semibold text-[#230532] cursor-pointer text-[14px] md:text-[15px] px-5 py-4 list-none flex items-center justify-between hover:bg-[#EAE2F0]/30 transition-colors`}>
                    {faq.q}
                    <span className="text-[#D4AF37] text-lg ml-3 flex-shrink-0">+</span>
                  </summary>
                  <p className={`${montserrat.className} text-stone-600 text-[14px] leading-relaxed px-5 pb-4 pt-1`}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* Internal links + WhatsApp CTA */}
          <div className="pt-6 border-t border-stone-100">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/silver-jewellery/bracelets"
                className={`${montserrat.className} text-[#230532] text-[12px] font-semibold border border-[#230532] px-4 py-2 rounded-full hover:bg-[#EAE2F0] transition-colors`}
              >
                Silver Bracelets
              </Link>
              <Link
                href="/silver-jewellery/rings"
                className={`${montserrat.className} text-stone-500 text-[12px] border border-stone-300 px-4 py-2 rounded-full hover:bg-stone-50 transition-colors`}
              >
                Silver Rings
              </Link>
              <Link
                href="/temple-silver-jewellery"
                className={`${montserrat.className} text-stone-500 text-[12px] border border-stone-300 px-4 py-2 rounded-full hover:bg-stone-50 transition-colors`}
              >
                Temple Jewellery
              </Link>
              <Link
                href="/silver-jewellery"
                className={`${montserrat.className} text-stone-500 text-[12px] border border-stone-300 px-4 py-2 rounded-full hover:bg-stone-50 transition-colors`}
              >
                All Silver Jewellery
              </Link>
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent('Hi Bakya! I want to know about silver jewellery gift options for women.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${montserrat.className} ml-auto flex items-center gap-2 text-[12px] font-semibold text-white bg-[#25D366] px-4 py-2 rounded-full hover:bg-[#20bd5a] transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.49" /></svg>
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
