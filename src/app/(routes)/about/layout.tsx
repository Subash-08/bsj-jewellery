import type { Metadata } from 'next'
import { SchemaScript } from '@/components/seo/SchemaScript'
import { webPageSchema, localBusinessSchema } from '@/lib/schema'
import { SITE } from '@/lib/seo.config'

export const metadata: Metadata = {
  title: 'About Bakya — Handcrafted Silver Jewellery Since 1997 | Tirunelveli',
  description:
    'Meet Bakya by Bagyalakshmi Jewellers. Explore our Tirunelveli story since 1997 and the silver jewellery we share online.',
  alternates: { canonical: `${SITE.domain}/about` },
  openGraph: {
    title: 'About Bakya — Silver Jewellery Since 1997',
    description:
      'Discover the Tirunelveli shop and the people behind Bakya silver jewellery.',
    url: `${SITE.domain}/about`,
    images: [{ url: `${SITE.domain}/about/bakya-store.jpg`, width: 1254, height: 719, alt: 'Inside the Bagyalakshmi Jewellers shop' }],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaScript
        schema={[
          webPageSchema({
            type: 'AboutPage',
            name: 'About Bakya — Handcrafted Silver Jewellery Since 1997',
            description:
              'Bakya by Bagyalakshmi Jewellers — a Tirunelveli jewellery shop story since 1997.',
            url: `${SITE.domain}/about`,
            breadcrumbs: [
              { name: 'Home', url: SITE.domain },
              { name: 'About', url: `${SITE.domain}/about` },
            ],
          }),
          localBusinessSchema(),
        ]}
      />
      {children}
    </>
  )
}
