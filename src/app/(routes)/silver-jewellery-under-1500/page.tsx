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

const PAGE_URL = `${SITE.domain}/silver-jewellery-under-1500`

export const metadata: Metadata = {
  title: 'Silver Jewellery Under ₹1,500 | 92.5 BIS Hallmarked | Bakya',
  description:
    'Buy genuine 92.5 BIS hallmarked silver jewellery under ₹1,500 — rings, pendants & chains for women. Not silver-plated. Handcrafted in Tirunelveli. Ships Tamil Nadu.',
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Silver Jewellery Under ₹1,500 | 92.5 BIS Hallmarked | Bakya',
    description:
      'Genuine 92.5 BIS hallmarked silver rings, pendants & chains under ₹1,500. Not silver-plated. Handcrafted in Tirunelveli since 1997.',
    url: PAGE_URL,
  },
}

const QUICK_ANSWER =
  "Bakya's genuine 92.5 BIS hallmarked silver jewellery under ₹1,500 includes: silver rings (₹1,000–₹1,499), religious pendants (₹800–₹1,499), and thin silver chains (₹1,200–₹1,499). All are certified sterling silver — not silver-plated brass."

const INTRO =
  "Finding real 92.5 BIS hallmarked silver jewellery under ₹1,500 is challenging because most pieces in this price range are silver-plated brass — not genuine silver. At Bakya, we offer authentic 92.5 sterling silver in three categories under ₹1,500: silver rings (lightweight 1.5–2.5g designs priced ₹1,000–₹1,499), religious pendants in gold-plated 92.5 silver (₹800–₹1,499), and ball and snake design chains for kids and slim women's chains (₹1,200–₹1,499). Every piece carries a BIS hallmark with HUID — verifiable on the BIS CARE mobile app. Handcrafted in Tirunelveli by Bakya since 1997."

const FAQS = [
  {
    q: 'Is silver jewellery under ₹1,500 real silver?',
    a: 'At Bakya, yes. All our jewellery — including pieces under ₹1,500 — is made in 92.5 BIS hallmarked sterling silver with HUID certification. Most online sellers in this price range sell silver-plated brass. The difference is that genuine silver carries a BIS hallmark verifiable on the BIS CARE app.',
  },
  {
    q: 'What silver jewellery can I buy under ₹1,500?',
    a: 'Under ₹1,500 from Bakya: silver rings (plain, heart, single stone — ₹1,000–₹1,499), religious pendants (Ganesha, Trishul, Cross, Islamic — ₹800–₹1,499), and thin silver chains for kids or minimalist women (₹1,200–₹1,499). All in 92.5 BIS hallmarked silver.',
  },
  {
    q: 'How do I verify that silver jewellery is genuine?',
    a: 'Look for a BIS hallmark on the piece — a six-sided seal with 925 marking and a HUID alphanumeric code. Download the BIS CARE app, enter the HUID, and verify the piece is registered as genuine 92.5 silver. Every Bakya piece has this.',
  },
  {
    q: 'Why does silver jewellery under ₹1,500 seem cheap?',
    a: 'Genuine silver jewellery in this price range is lightweight — typically 1.5–5 grams. The low price reflects the small weight of silver, not compromised quality. A 2-gram ring in 92.5 silver contains 1.85 grams of pure silver — value that silver-plated pieces cannot match.',
  },
  {
    q: 'Can I gift silver jewellery under ₹1,500?',
    a: 'Yes — silver pendants (₹800–₹1,499) are our most-gifted items in this price range. A Vinayagar (Ganesha) or Cross pendant for a naming ceremony or religious occasion is meaningful, certified, and thoughtfully packaged.',
  },
  {
    q: 'Does Bakya offer silver for kids under ₹1,500?',
    a: 'Yes. Our thin silver ball chain (14-inch, for kids) and small stone rings are available under ₹1,500. Contact us on WhatsApp to confirm current stock for kids\' sizes.',
  },
]

export default async function SilverJewelleryUnder1500Page() {
  const whatsappPhone = SITE.social.whatsapp.replace(/[^0-9]/g, '')
  const [pendantResult, ringResult, chainResult] = await Promise.all([
    getCollectionProducts({ handle: 'pendant', sortKey: 'PRICE' }).catch(() => undefined),
    getCollectionProducts({ handle: 'ring', sortKey: 'PRICE' }).catch(() => undefined),
    getCollectionProducts({ handle: 'chain', sortKey: 'PRICE' }).catch(() => undefined),
  ])
  const under1500 = [
    ...(pendantResult?.products ?? []).filter(p => parseFloat(p.priceRange.minVariantPrice.amount) <= 1500).slice(0, 4),
    ...(ringResult?.products ?? []).filter(p => parseFloat(p.priceRange.minVariantPrice.amount) <= 1500).slice(0, 4),
    ...(chainResult?.products ?? []).filter(p => parseFloat(p.priceRange.minVariantPrice.amount) <= 1500).slice(0, 4),
  ]

  return (
    <>
      <SchemaScript
        schema={[
          collectionPageSchema({
            name: 'Silver Jewellery Under ₹1,500 — 92.5 BIS Hallmarked | Bakya',
            description:
              'Genuine 92.5 BIS hallmarked silver rings, pendants & chains under ₹1,500.',
            url: PAGE_URL,
            products: [],
          }),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Silver Jewellery Under ₹1,500', url: '/silver-jewellery-under-1500' },
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
              <span className="text-[#EAE2F0]/50">Silver Jewellery Under ₹1,500</span>
            </p>
          </nav>
          <h1 className={`${playfair.className} text-white text-2xl md:text-[38px] font-bold max-w-3xl mx-auto leading-tight`}>
            Silver Jewellery Under ₹1,500 — 92.5 BIS Hallmarked
          </h1>
          <p className={`${montserrat.className} text-[#EAE2F0]/70 text-[13px] mt-3 max-w-xl mx-auto`}>
            Genuine sterling silver — not silver-plated. Verified with HUID.
          </p>
        </div>

        <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-10">

          {/* Intro Text - Minimal, catalog-style */}
          <div className="mb-10 text-center">
            <h2 className={`${playfair.className} text-[#230532] text-[22px] md:text-[28px] font-bold mb-4`}>
              Genuine Silver Under &#8377;1,500
            </h2>
            <p className={`${montserrat.className} text-stone-600 text-[13px] md:text-[14px] leading-relaxed max-w-2xl mx-auto`}>
              Real 92.5 BIS hallmarked sterling silver — not silver-plated. Every piece HUID verified.
            </p>
          </div>

          {/* Mixed Editorial Product Grid */}
          <div className="mb-10">
            {under1500.length > 0 ? (
              <ProductGridMixedLayout
                products={under1500}
                collectionHandle="all"
                editorialBlocks={[
                  {
                    position: 3,
                    type: "collection-story",
                    content: {
                      title: "92.5 BIS Certified",
                      description: "Every piece carries a HUID hallmark verifiable on the BIS CARE app. Genuine silver at every price point.",
                    }
                  },
                  {
                    position: 8,
                    type: "large-image",
                    content: {
                      title: "Affordable Luxury",
                      description: "Real silver. Real craftsmanship. Accessible prices.",
                      imageUrl: under1500[3]?.images?.[0]?.url || under1500[0]?.images?.[0]?.url || 'https://images.unsplash.com/photo-1622398925373-3f9efa8ce462?auto=format&fit=crop&q=80&w=1200'
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

          {/* BIS trust note */}
          <div className="mb-10 rounded-lg border border-amber-200 bg-amber-50 px-6 py-5">
            <p className={`${montserrat.className} text-amber-800 text-[13px] font-semibold mb-1`}>
              How to verify genuine silver
            </p>
            <p className={`${montserrat.className} text-amber-700 text-[13px] leading-relaxed`}>
              Every Bakya piece carries a BIS hallmark with a HUID (Hallmark Unique Identification) code.
              Download the <strong>BIS CARE app</strong>, enter the HUID printed on your jewellery, and
              instantly verify it is registered as 92.5 certified sterling silver. Silver-plated pieces
              will not have this code.
            </p>
          </div>

          {/* FAQ */}
          <section aria-labelledby="faq-heading" className="mb-12">
            <h2
              id="faq-heading"
              className={`${playfair.className} text-[#230532] text-2xl md:text-[28px] font-bold mb-6`}
            >
              Budget Silver — Common Questions
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
                href="/silver-jewellery/pendants"
                className={`${montserrat.className} text-[#230532] text-[12px] font-semibold border border-[#230532] px-4 py-2 rounded-full hover:bg-[#EAE2F0] transition-colors`}
              >
                Silver Pendants
              </Link>
              <Link
                href="/silver-jewellery/rings"
                className={`${montserrat.className} text-stone-500 text-[12px] border border-stone-300 px-4 py-2 rounded-full hover:bg-stone-50 transition-colors`}
              >
                Silver Rings
              </Link>
              <Link
                href="/daily-wear-silver-jewellery"
                className={`${montserrat.className} text-stone-500 text-[12px] border border-stone-300 px-4 py-2 rounded-full hover:bg-stone-50 transition-colors`}
              >
                Daily Wear
              </Link>
              <Link
                href="/silver-gifts-for-women"
                className={`${montserrat.className} text-stone-500 text-[12px] border border-stone-300 px-4 py-2 rounded-full hover:bg-stone-50 transition-colors`}
              >
                Silver Gifts
              </Link>
              <Link
                href="/silver-jewellery"
                className={`${montserrat.className} text-stone-500 text-[12px] border border-stone-300 px-4 py-2 rounded-full hover:bg-stone-50 transition-colors`}
              >
                All Silver Jewellery
              </Link>
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent('Hi Bakya! I want to know about silver jewellery options under ₹1,500.')}`}
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
