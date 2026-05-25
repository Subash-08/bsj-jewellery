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
import type { EditorialBlock } from '@/components/collection-showcase/ProductGridMixedLayout'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '600', '700'] })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600'] })

const PAGE_URL = `${SITE.domain}/temple-silver-jewellery`

export const metadata: Metadata = {
  title: 'Temple Silver Jewellery Online | Ganesha Trishul Pendants | Bakya',
  description:
    'Buy devotional temple silver jewellery online — Vinayagar (Ganesha), Trishul, Cross & Islamic pendants in 92.5 gold-plated BIS hallmarked silver. Handcrafted in Tirunelveli. Ships Tamil Nadu.',
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Temple Silver Jewellery Online | Ganesha Trishul Pendants | Bakya',
    description:
      'Devotional Vinayagar, Trishul, Cross & Islamic pendants in 92.5 gold-plated BIS hallmarked silver. Handcrafted in Tirunelveli since 1997.',
    url: PAGE_URL,
  },
}

const QUICK_ANSWER =
  "Bakya's temple silver jewellery includes Vinayagar (Ganesha), Trishul, Shiva Linga, Om, Cross, and Islamic crescent pendants — all in 92.5 gold-plated BIS hallmarked sterling silver. Priced ₹800–₹1,500, handcrafted in Tirunelveli. Ideal for naming ceremonies, thread ceremonies, Eid, and house-warming gifts."

const INTRO =
  "Temple jewellery in India has always carried meaning beyond adornment — it is a daily reminder of faith, protection, and devotion. At Bakya, our temple silver jewellery collection honours this tradition with pendants crafted in 92.5 BIS hallmarked sterling silver and finished with warm gold micron plating. We offer devotional designs for Hindu, Christian, and Islamic worship: the Vinayagar dollar pendant (our bestselling religious piece), the Trishul dollar pendant, the Shiva Linga design, Om symbol, ornate Cross pendant, round Muslim dollar pendant, and square Muslim dollar pendant. Each piece is handcrafted in Tirunelveli, lightweight (under 5 grams), and paired with our snake design silver chain for a complete devotional set."

const FAQS = [
  {
    q: 'What temple silver jewellery does Bakya offer?',
    a: 'Our temple silver jewellery collection includes: Vinayagar (Ganesha) dollar pendant, Trishul dollar pendant, Shiva Linga pendant, Om symbol pendant, Cross pendant, round Muslim dollar pendant, and square Muslim dollar pendant. All are in 92.5 gold-plated BIS hallmarked sterling silver.',
  },
  {
    q: 'Is temple silver jewellery good as a gift?',
    a: 'Yes — temple silver jewellery is among the most meaningful gifts for naming ceremonies, thread ceremonies, first communion, Eid celebrations, and house-warming poojas. Our pendants come in premium gift packaging with a silver care card.',
  },
  {
    q: 'What purity silver is used in devotional pendants?',
    a: 'All Bakya temple pendants are made in 92.5 BIS hallmarked sterling silver with gold micron plating. The HUID on each piece can be verified on the BIS CARE app for certified silver purity.',
  },
  {
    q: 'Do the temple pendants come with a chain?',
    a: 'Pendants are sold separately from chains. We recommend pairing with our snake design silver chain (16 or 18 inch) — available in our silver chains collection.',
  },
  {
    q: 'How long does the gold plating last on temple pendants?',
    a: 'With proper care — avoiding water, perfume, and chemicals — our gold micron plating typically lasts 1–2 years. Store in a dry pouch when not wearing.',
  },
  {
    q: 'Do you offer Ganesha pendants in silver?',
    a: 'Yes. Our Vinayagar (Ganesha) dollar pendant is our bestselling temple piece — crafted in 92.5 gold-plated BIS silver, weighing approximately 3–4 grams. It is a popular choice for naming ceremony gifts and Vinayagar Chaturthi.',
  },
]

export default async function TempleSilverJewelleryPage() {
  const whatsappPhone = SITE.social.whatsapp.replace(/[^0-9]/g, '')
  const result = await getCollectionProducts({ handle: 'pendant' }).catch(() => undefined)
  const products = result?.products?.slice(0, 8) ?? []

  return (
    <>
      <SchemaScript
        schema={[
          collectionPageSchema({
            name: 'Temple Silver Jewellery Online — Devotional Pendants & Chains | Bakya',
            description:
              'Devotional Vinayagar, Trishul, Cross & Islamic pendants in 92.5 gold-plated BIS hallmarked silver.',
            url: PAGE_URL,
            products: [],
          }),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Temple Silver Jewellery', url: '/temple-silver-jewellery' },
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
              <span className="text-[#EAE2F0]/50">Temple Silver Jewellery</span>
            </p>
          </nav>
          <h1 className={`${playfair.className} text-white text-2xl md:text-[38px] font-bold max-w-3xl mx-auto leading-tight`}>
            Temple Silver Jewellery Online — Devotional Pendants &amp; Chains
          </h1>
          <p className={`${montserrat.className} text-[#EAE2F0]/70 text-[13px] mt-3 max-w-xl mx-auto`}>
            Vinayagar • Trishul • Cross • Islamic — Handcrafted in Tirunelveli since 1997
          </p>
        </div>

        <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-10">

          {/* Intro Text - Kept minimal */}
          <div className="mb-10 text-center">
            <h2 className={`${playfair.className} text-[#230532] text-[22px] md:text-[28px] font-bold mb-4`}>
              Devotional Silver Pendants
            </h2>
            <p className={`${montserrat.className} text-stone-600 text-[13px] md:text-[14px] leading-relaxed max-w-2xl mx-auto`}>
              Honouring tradition with pendants crafted in 92.5 BIS hallmarked sterling silver and finished with warm gold micron plating.
            </p>
          </div>

          {/* Mixed Editorial Product Grid */}
          <div className="mb-14">
            {products.length > 0 ? (
              <ProductGridMixedLayout
                products={products}
                collectionHandle="pendant"
                editorialBlocks={[
                  {
                    position: 3,
                    type: "large-image",
                    content: {
                      title: "Temple Collection",
                      description: "Inspired by Traditional Indian Artistry",
                      imageUrl: products[0]?.images?.[1]?.url || products[0]?.images?.[0]?.url || 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=1200'
                    }
                  },
                  {
                    position: 7,
                    type: "collection-story",
                    content: {
                      title: "Handcrafted Devotion",
                      description: "Each piece is handcrafted in Tirunelveli, lightweight, and perfect for daily wear or special ceremonies.",
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
              <Link href="/silver-jewellery/pendants" className={`${montserrat.className} inline-block text-[#230532] text-sm font-semibold border border-[#230532] px-5 py-2.5 rounded-full hover:bg-[#EAE2F0] transition-colors`}>
                View All Pendants →
              </Link>
              <Link href="/silver-jewellery/chains" className={`${montserrat.className} inline-block text-stone-500 text-sm border border-stone-300 px-5 py-2.5 rounded-full hover:bg-stone-50 transition-colors`}>
                Browse Silver Chains
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <section aria-labelledby="faq-heading" className="mb-12">
            <h2
              id="faq-heading"
              className={`${playfair.className} text-[#230532] text-2xl md:text-[28px] font-bold mb-6`}
            >
              Temple Silver Jewellery — Common Questions
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
                All Pendants
              </Link>
              <Link
                href="/silver-jewellery/chains"
                className={`${montserrat.className} text-stone-500 text-[12px] border border-stone-300 px-4 py-2 rounded-full hover:bg-stone-50 transition-colors`}
              >
                Silver Chains
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
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent('Hi Bakya! I want to know more about your temple silver jewellery — Ganesha, Trishul & Cross pendants.')}`}
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
