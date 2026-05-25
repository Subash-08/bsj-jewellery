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

const PAGE_URL = `${SITE.domain}/daily-wear-silver-jewellery`

export const metadata: Metadata = {
  title: 'Daily Wear Silver Jewellery | Lightweight 92.5 Silver | Bakya',
  description:
    'Shop lightweight daily wear silver jewellery for women — 92.5 BIS hallmarked anklets, rings, chains & bracelets. Comfortable for all-day wear. Handcrafted in Tirunelveli. Ships Tamil Nadu.',
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Daily Wear Silver Jewellery | Lightweight 92.5 Silver | Bakya',
    description:
      'Lightweight 92.5 BIS hallmarked silver jewellery for daily wear — anklets, rings, chains & bracelets. Handcrafted in Tirunelveli since 1997.',
    url: PAGE_URL,
  },
}

const QUICK_ANSWER =
  "The best daily wear silver jewellery from Bakya: lightweight fashion kolusu (anklets), plain silver rings (1.5–2.5g), snake design chains (18\"), and box chain bracelets — all in 92.5 BIS hallmarked silver, designed for all-day comfort. Priced ₹800–₹4,500."

const INTRO =
  "Daily wear silver jewellery must do two things exceptionally well: look beautiful and feel effortless through a full day of activity. At Bakya, our daily wear collection is built around lightweight designs in 92.5 BIS hallmarked sterling silver — pieces that you wear in the morning and forget you're wearing by noon. Our most popular daily wear pieces include fashion kolusu (light silver anklets at 8–12 grams per pair), minimalist silver rings (1.5–2.5 grams), the snake design silver chain (flat and flexible at 16–18 inches), and the box chain bracelet for all-day wrist wear. Every piece is BIS hallmarked with HUID verification, crafted at our Tirunelveli workshop by artisans who have spent decades perfecting silver jewellery for everyday Tamil women."

const FAQS = [
  {
    q: 'What silver jewellery is best for daily wear?',
    a: 'For daily wear, choose lightweight pieces: fashion kolusu (8–14g), plain or simple stone rings (1.5–3g), snake design chains (18"), and slim bracelets (5–7g). These weigh less and are less likely to catch on clothing or cause discomfort.',
  },
  {
    q: 'Can I wear 92.5 silver jewellery every day?',
    a: 'Yes. 92.5 BIS hallmarked sterling silver is designed for regular wear. It may develop a subtle patina over time due to skin contact and air — this is natural and easily restored with a soft silver polishing cloth.',
  },
  {
    q: 'How do I care for silver jewellery I wear daily?',
    a: 'Wipe with a dry cloth after each wear to remove moisture and skin oils. Store in a dry pouch at night. Avoid contact with perfume, lotions, and household chemicals. For tarnish, use a soft silver polishing cloth or a mild baking soda solution.',
  },
  {
    q: 'Does daily wear silver jewellery tarnish quickly?',
    a: 'Genuine 92.5 silver tarnishes slowly — much slower than silver-plated items. Daily wear accelerates the patina slightly due to skin contact, but a polish every few weeks keeps it bright. This is a hallmark of real silver, not a defect.',
  },
  {
    q: 'What is the lightest silver kolusu for daily wear?',
    a: 'Our fashion kolusu designs weigh 8–14 grams per pair — made for all-day wear without discomfort. These differ from our heavier bridal kolusu (31–37g). Confirm the weight in each product listing before ordering.',
  },
  {
    q: 'Are daily wear silver rings available in adjustable sizes?',
    a: 'Our rings are available in fixed Indian sizes (6–22). Plain bands and thin rings in this range are the most comfortable for daily wear. Contact us on WhatsApp for size guidance before placing your order.',
  },
]

export default async function DailyWearSilverJewelleryPage() {
  const whatsappPhone = SITE.social.whatsapp.replace(/[^0-9]/g, '')
  const [ankletResult, ringResult, chainResult] = await Promise.all([
    getCollectionProducts({ handle: 'anklet' }).catch(() => undefined),
    getCollectionProducts({ handle: 'ring' }).catch(() => undefined),
    getCollectionProducts({ handle: 'chain' }).catch(() => undefined),
  ])
  const products = [
    ...(ankletResult?.products?.slice(0, 3) ?? []),
    ...(ringResult?.products?.slice(0, 3) ?? []),
    ...(chainResult?.products?.slice(0, 3) ?? []),
  ]

  return (
    <>
      <SchemaScript
        schema={[
          collectionPageSchema({
            name: 'Daily Wear Silver Jewellery for Women — Lightweight 92.5 Silver | Bakya',
            description:
              'Lightweight 92.5 BIS hallmarked silver jewellery for daily wear — anklets, rings, chains & bracelets.',
            url: PAGE_URL,
            products: [],
          }),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Daily Wear Silver Jewellery', url: '/daily-wear-silver-jewellery' },
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
              <span className="text-[#EAE2F0]/50">Daily Wear Silver Jewellery</span>
            </p>
          </nav>
          <h1 className={`${playfair.className} text-white text-2xl md:text-[38px] font-bold max-w-3xl mx-auto leading-tight`}>
            Daily Wear Silver Jewellery for Women — Lightweight 92.5 Silver
          </h1>
          <p className={`${montserrat.className} text-[#EAE2F0]/70 text-[13px] mt-3 max-w-xl mx-auto`}>
            Kolusu • Rings • Chains • Bracelets — Crafted for all-day comfort
          </p>
        </div>

        <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-10">

          {/* Intro Text - Kept minimal */}
          <div className="mb-10 text-center">
            <h2 className={`${playfair.className} text-[#230532] text-[22px] md:text-[28px] font-bold mb-4`}>
              Everyday Silver Elegance
            </h2>
            <p className={`${montserrat.className} text-stone-600 text-[13px] md:text-[14px] leading-relaxed max-w-2xl mx-auto`}>
              Designed for all-day comfort. Lightweight kolusu, rings, chains & bracelets in 92.5 BIS hallmarked silver.
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
                    position: 2,
                    type: "large-image",
                    content: {
                      title: "Daily Wear Collection",
                      description: "Effortless pieces you wear in the morning and forget you're wearing by noon.",
                      imageUrl: products[0]?.images?.[1]?.url || products[0]?.images?.[0]?.url || 'https://images.unsplash.com/photo-1605100804763-247f67b6348e?auto=format&fit=crop&q=80&w=1200'
                    }
                  },
                  {
                    position: 6,
                    type: "quote-block",
                    content: {
                      quote: "Jewellery must do two things exceptionally well: look beautiful and feel effortless.",
                    }
                  }
                ]}
              />
            ) : (
              <div className="rounded-[16px] border border-[#EDE8E0] bg-[#FAF8F5] py-16 text-center shadow-sm">
                <p className={`${montserrat.className} text-stone-400 text-sm`}>Products coming soon</p>
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/silver-jewellery/anklets" className={`${montserrat.className} inline-block text-[#230532] text-sm font-semibold border border-[#230532] px-5 py-2.5 rounded-full hover:bg-[#EAE2F0] transition-colors`}>
                All Kolusu →
              </Link>
              <Link href="/silver-jewellery/rings" className={`${montserrat.className} inline-block text-stone-500 text-sm border border-stone-300 px-5 py-2.5 rounded-full hover:bg-stone-50 transition-colors`}>
                All Rings →
              </Link>
              <Link href="/silver-jewellery/chains" className={`${montserrat.className} inline-block text-stone-500 text-sm border border-stone-300 px-5 py-2.5 rounded-full hover:bg-stone-50 transition-colors`}>
                All Chains →
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <section aria-labelledby="faq-heading" className="mb-12">
            <h2
              id="faq-heading"
              className={`${playfair.className} text-[#230532] text-2xl md:text-[28px] font-bold mb-6`}
            >
              Daily Wear Silver — Common Questions
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
                href="/silver-jewellery/anklets"
                className={`${montserrat.className} text-[#230532] text-[12px] font-semibold border border-[#230532] px-4 py-2 rounded-full hover:bg-[#EAE2F0] transition-colors`}
              >
                Silver Kolusu
              </Link>
              <Link
                href="/silver-jewellery/rings"
                className={`${montserrat.className} text-stone-500 text-[12px] border border-stone-300 px-4 py-2 rounded-full hover:bg-stone-50 transition-colors`}
              >
                Silver Rings
              </Link>
              <Link
                href="/silver-jewellery/chains"
                className={`${montserrat.className} text-stone-500 text-[12px] border border-stone-300 px-4 py-2 rounded-full hover:bg-stone-50 transition-colors`}
              >
                Silver Chains
              </Link>
              <Link
                href="/silver-jewellery-under-1500"
                className={`${montserrat.className} text-stone-500 text-[12px] border border-stone-300 px-4 py-2 rounded-full hover:bg-stone-50 transition-colors`}
              >
                Under ₹1,500
              </Link>
              <Link
                href="/silver-jewellery"
                className={`${montserrat.className} text-stone-500 text-[12px] border border-stone-300 px-4 py-2 rounded-full hover:bg-stone-50 transition-colors`}
              >
                All Silver Jewellery
              </Link>
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent('Hi Bakya! I want to know about lightweight silver jewellery for daily wear.')}`}
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
