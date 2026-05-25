import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Bakya — Handcrafted Silver Jewellery Since 1997 | Tirunelveli',
  description:
    'Bakya by Bagyalakshmi Jewellers has been crafting BIS hallmarked 92.5 silver jewellery in Tirunelveli since 1997. Learn about our story, craft, and commitment to genuine silver.',
  alternates: { canonical: 'https://www.bakya.in/about' },
  openGraph: {
    title: 'About Bakya — Silver Jewellery Since 1997',
    description:
      'Trusted family jeweller from Tirunelveli. 27+ years of BIS hallmarked 92.5 silver jewellery craftsmanship.',
    url: 'https://www.bakya.in/about',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
