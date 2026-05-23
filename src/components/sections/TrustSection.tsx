import { Trophy, ShieldCheck, Handshake, Lock, Package, RotateCcw } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Trophy,
    label: 'Since 1997',
    desc: '27+ years of trusted craftsmanship',
  },
  {
    icon: ShieldCheck,
    label: 'BIS Certified',
    desc: '92.5 hallmarked silver, HUID verified',
  },
  {
    icon: Handshake,
    label: 'Handcrafted',
    desc: 'Made by artisans in Tirunelveli',
  },
  {
    icon: Lock,
    label: 'Secure Payments',
    desc: 'Razorpay | UPI | Cards',
  },
  {
    icon: Package,
    label: 'Ships Tamil Nadu',
    desc: 'Delivery in 3–5 business days',
  },
  {
    icon: RotateCcw,
    label: '7-Day Returns',
    desc: 'Damaged or wrong item returns accepted',
  },
]

export function TrustSection() {
  return (
    <section
      aria-label="Why shop with Bakya"
      style={{
        background: '#FAF8F5',
        borderTop: '1px solid #EDE8E0',
        borderBottom: '1px solid #EDE8E0',
        padding: 'clamp(1.25rem, 3vw, 2rem) clamp(1rem, 4vw, 2rem)',
      }}
    >
      <ul
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          listStyle: 'none',
          padding: 0,
        }}
        className="trust-strip-grid"
      >
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
              }}
            >
              <span
                style={{ flexShrink: 0, color: '#b45309', marginTop: '2px' }}
                aria-hidden="true"
              >
                <Icon size={18} strokeWidth={1.5} />
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#2C2218',
                    marginBottom: '0.1rem',
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.68rem',
                    color: '#8A7A6A',
                    lineHeight: 1.4,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <style>{`
        @media (min-width: 640px) {
          .trust-strip-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (min-width: 1024px) {
          .trust-strip-grid {
            grid-template-columns: repeat(6, 1fr) !important;
          }
        }
      `}</style>
    </section>
  )
}
