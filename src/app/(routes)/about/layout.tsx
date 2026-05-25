import type { Metadata } from 'next'
import { SchemaScript } from '@/components/seo/SchemaScript'
import { webPageSchema, localBusinessSchema } from '@/lib/schema'
import { SITE } from '@/lib/seo.config'

export const metadata: Metadata = {
  title: 'About Bakya — Handcrafted Silver Jewellery Since 1997 | Tirunelveli',
  description:
    'Bakya by Bagyalakshmi Jewellers has been crafting BIS hallmarked 92.5 silver jewellery in Tirunelveli since 1997. Learn about our story, craft, and commitment to genuine silver.',
  alternates: { canonical: `${SITE.domain}/about` },
  openGraph: {
    title: 'About Bakya — Silver Jewellery Since 1997',
    description:
      'Trusted family jeweller from Tirunelveli. 27+ years of BIS hallmarked 92.5 silver jewellery craftsmanship.',
    url: `${SITE.domain}/about`,
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
              'Bakya by Bagyalakshmi Jewellers — trusted family jeweller from Tirunelveli since 1997.',
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
