import React from 'react'
import Link from 'next/link'
import { Playfair_Display, Montserrat } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

// ─── DATA ────────────────────────────────────────────────────────────────────
// To add/remove/edit occasion cards: only change this array.
// Do not change the component JSX.
const OCCASIONS = [
  {
    icon: '👰',
    title: 'Bridal Silver',
    description: 'Traditional kolusu for the Tamil bride',
    href: '/silver-jewellery/anklets/bridal-kolusu',
    bgGradient: 'from-[#3a0a4a] to-[#230532]',
    ariaLabel: 'Shop Bridal Silver Kolusu',
  },
  {
    icon: '✨',
    title: 'Daily Wear',
    description: 'Lightweight silver for everyday elegance',
    href: '/daily-wear-silver-jewellery',
    bgGradient: 'from-[#1A3A5C] to-[#0a1f33]',
    ariaLabel: 'Shop Daily Wear Silver Jewellery',
  },
  {
    icon: '🪔',
    title: 'Temple Jewellery',
    description: 'Devotional pendants for daily prayer',
    href: '/temple-silver-jewellery',
    bgGradient: 'from-[#5C3A0A] to-[#33200a]',
    ariaLabel: 'Shop Temple Silver Jewellery',
  },
  {
    icon: '🎁',
    title: 'Silver Gifts',
    description: 'Perfect silver gifts from ₹999',
    href: '/silver-gifts-for-women',
    bgGradient: 'from-[#5C1A1A] to-[#330a0a]',
    ariaLabel: 'Shop Silver Gifts for Women',
  },
] as const

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function ShopByOccasion() {
  return (
    <section
      aria-label="Shop silver jewellery by occasion"
      className="w-full py-12 md:py-16 px-4 bg-white"
    >
      <div className="max-w-[1280px] mx-auto">

        {/* Section heading — matches existing Bakya homepage style */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="flex flex-col border-l-[3px] border-[#230532] pl-4 text-left">
            <span
              className={`${montserrat.className} text-[10px] md:text-[11px] text-[#230532]/60 uppercase tracking-[0.2em] font-medium mb-1`}
            >
              Shop by Occasion
            </span>
            <h2
              className={`${playfair.className} text-[#230532] text-[26px] md:text-[32px] font-bold leading-none mb-2 tracking-wide`}
            >
              Find Your Perfect Silver
            </h2>
            <p
              className={`${montserrat.className} text-stone-500 text-[12px] md:text-[14px] tracking-wide`}
            >
              Curated silver for every moment in life
            </p>
          </div>
        </div>

        {/* Occasion cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {OCCASIONS.map((occasion) => (
            <Link
              key={occasion.href}
              href={occasion.href}
              aria-label={occasion.ariaLabel}
              className={`
                relative flex flex-col items-center justify-center text-center
                bg-gradient-to-br ${occasion.bgGradient}
                rounded-xl p-6 md:p-8
                h-[160px] md:h-[200px]
                group transition-transform duration-300 hover:scale-[1.02]
                focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2
              `}
            >
              {/* Icon */}
              <span
                className="text-3xl md:text-4xl mb-3 transition-transform duration-300 group-hover:scale-110"
                aria-hidden="true"
              >
                {occasion.icon}
              </span>

              {/* Title */}
              <h3
                className={`${playfair.className} text-white text-[15px] md:text-[18px] font-bold leading-tight mb-1.5`}
              >
                {occasion.title}
              </h3>

              {/* Description */}
              <p
                className={`${montserrat.className} text-white/75 text-[11px] md:text-[12px] leading-snug`}
              >
                {occasion.description}
              </p>

              {/* Arrow — appears on hover */}
              <span
                className="absolute bottom-3 right-4 text-white/40 text-xs transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
