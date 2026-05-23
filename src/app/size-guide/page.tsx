import type { Metadata } from 'next'
import { SITE } from '@/lib/seo.config'
import { SchemaScript } from '@/components/seo/SchemaScript'
import { faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Silver Jewellery Size Guide — Ring, Kolusu & Bracelet Sizes | Bakya',
  description:
    'Find your perfect fit with Bakya\'s silver jewellery size guide. Ring size chart (Indian sizes 6–22), kolusu ankle measurement, and bracelet wrist guide. Free WhatsApp sizing help.',
  alternates: { canonical: `${SITE.domain}/size-guide` },
  openGraph: {
    title: 'Silver Jewellery Size Guide | Bakya',
    description: 'Ring, kolusu & bracelet sizing guide from Bakya Tirunelveli.',
    url: `${SITE.domain}/size-guide`,
  },
}

const SIZE_FAQS = [
  {
    q: 'How do I measure my ring size at home?',
    a: 'Wrap a thin strip of paper or string around your finger, mark where it overlaps, then measure the length in millimeters. Divide by 3.14 to get the diameter. Match to our size chart below. Measure in the evening when fingers are at their largest.',
  },
  {
    q: 'Which kolusu size should I choose?',
    a: 'Measure your ankle circumference with a soft tape measure. For a comfortable fit, add 1 cm to the measurement. Standard sizes: 8 inches (20 cm) for slim ankles, 9.75 inches (24.8 cm) for medium, 10 inches (25.4 cm) for standard, and 10.5 inches (26.7 cm) for larger ankles.',
  },
  {
    q: 'What is the standard bracelet size for women?',
    a: 'Measure your wrist circumference with a soft tape. Add 1–1.5 cm for a comfortable fit. Most adult women\'s wrists fall between 14–18 cm. Our standard bracelets are 18–19 cm in length.',
  },
  {
    q: 'Can I get a custom size?',
    a: 'Yes. Contact us on WhatsApp with your measurements. We offer custom sizing for kolusu, bangles, and some bracelet designs from our Tirunelveli workshop.',
  },
  {
    q: 'What if I am between ring sizes?',
    a: 'If you are between two sizes, we recommend sizing up for comfort — especially for wider band designs. For thin bands (under 3mm), the smaller size may fit well.',
  },
]

const RING_SIZES = [
  { indian: '6', diameter: '14.0', circumference: '44.0' },
  { indian: '7', diameter: '14.4', circumference: '45.2' },
  { indian: '8', diameter: '14.8', circumference: '46.5' },
  { indian: '9', diameter: '15.2', circumference: '47.7' },
  { indian: '10', diameter: '15.6', circumference: '49.0' },
  { indian: '11', diameter: '16.1', circumference: '50.5' },
  { indian: '12', diameter: '16.5', circumference: '51.8' },
  { indian: '13', diameter: '16.9', circumference: '53.1' },
  { indian: '14', diameter: '17.3', circumference: '54.3' },
  { indian: '15', diameter: '17.7', circumference: '55.6' },
  { indian: '16', diameter: '18.1', circumference: '56.9' },
  { indian: '17', diameter: '18.5', circumference: '58.1' },
  { indian: '18', diameter: '18.9', circumference: '59.4' },
  { indian: '19', diameter: '19.3', circumference: '60.6' },
  { indian: '20', diameter: '19.8', circumference: '62.1' },
  { indian: '21', diameter: '20.2', circumference: '63.4' },
  { indian: '22', diameter: '20.6', circumference: '64.7' },
]

const styles = {
  page: {
    background: '#FAF8F5',
    minHeight: '100vh',
    paddingTop: '2rem',
    paddingBottom: '4rem',
  } as React.CSSProperties,
  container: {
    maxWidth: 860,
    margin: '0 auto',
    padding: '0 clamp(1rem, 4vw, 2rem)',
  } as React.CSSProperties,
  h1: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: 700,
    color: '#1C1510',
    marginBottom: '0.4rem',
    lineHeight: 1.15,
  } as React.CSSProperties,
  lead: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.9rem',
    color: '#6A5A4A',
    lineHeight: 1.7,
    marginBottom: '2.5rem',
    maxWidth: 600,
  } as React.CSSProperties,
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
    fontWeight: 700,
    color: '#1C1510',
    marginBottom: '0.75rem',
    marginTop: '2.5rem',
  } as React.CSSProperties,
  card: {
    background: '#FFFFFF',
    border: '1px solid #EDE8E0',
    borderRadius: 12,
    padding: '1.5rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  steps: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.88rem',
    color: '#4A3F35',
    lineHeight: 1.8,
    paddingLeft: '1.25rem',
  } as React.CSSProperties,
  tip: {
    background: '#FEF9EE',
    border: '1px solid #F0D9A0',
    borderRadius: 8,
    padding: '0.75rem 1rem',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.82rem',
    color: '#7A5F1A',
    marginTop: '0.75rem',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.83rem',
  },
  th: {
    background: '#F5F0EA',
    color: '#4A3F35',
    fontWeight: 700,
    padding: '0.6rem 1rem',
    textAlign: 'left' as const,
    borderBottom: '1px solid #EDE8E0',
  },
  td: {
    padding: '0.55rem 1rem',
    borderBottom: '1px solid #F5F0EA',
    color: '#2C2218',
  },
  ankletGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.75rem',
  } as React.CSSProperties,
  ankletCard: {
    background: '#FAF8F5',
    border: '1px solid #EDE8E0',
    borderRadius: 8,
    padding: '0.9rem 1rem',
  } as React.CSSProperties,
  waLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: '#B0A090',
    marginBottom: '0.2rem',
  },
  waValue: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#1C1510',
  },
}

export default function SizeGuidePage() {
  const whatsappPhone = SITE.social.whatsapp.replace(/[^0-9]/g, '')
  const whatsappHref = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent('Hi Bakya! I need help finding my jewellery size.')}`

  return (
    <>
      <SchemaScript
        schema={[
          faqSchema(SIZE_FAQS),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Size Guide', url: '/size-guide' },
          ]),
        ]}
      />

      <div style={styles.page}>
        <div style={styles.container}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B0A090' }}>
              <a href="/" style={{ color: '#B0A090', textDecoration: 'none' }}>Home</a>
              {' › '}
              Size Guide
            </p>
          </nav>

          <h1 style={styles.h1}>Silver Jewellery Size Guide</h1>
          <p style={styles.lead}>
            Find your perfect fit before you buy. Use the guides below for rings, silver kolusu (anklets), and bracelets. If you need personalised help, message us on WhatsApp — we&apos;ll help you get it right.
          </p>

          {/* ── Ring Size Guide ── */}
          <section aria-labelledby="ring-size-heading">
            <h2 id="ring-size-heading" style={styles.sectionTitle}>Ring Size Guide</h2>

            <div style={styles.card}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.88rem', color: '#2C2218', marginBottom: '0.6rem' }}>
                How to measure your ring size at home
              </h3>
              <ol style={styles.steps}>
                <li>Cut a thin strip of paper or use a piece of string (approximately 10 cm long).</li>
                <li>Wrap it snugly around the base of the finger you want to size.</li>
                <li>Mark where the paper overlaps with a pen.</li>
                <li>Measure the marked length in millimeters with a ruler.</li>
                <li>Divide that measurement by 3.14 to get your ring diameter in mm.</li>
                <li>Find your diameter in the chart below to get your Indian ring size.</li>
              </ol>
              <div style={styles.tip}>
                💡 <strong>Tip:</strong> Measure in the evening — fingers are slightly larger later in the day. If between two sizes, go one size up for comfort.
              </div>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid #EDE8E0' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Indian Size</th>
                    <th style={styles.th}>Diameter (mm)</th>
                    <th style={styles.th}>Circumference (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {RING_SIZES.map((row, i) => (
                    <tr key={row.indian} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAF8F5' }}>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{row.indian}</td>
                      <td style={styles.td}>{row.diameter} mm</td>
                      <td style={styles.td}>{row.circumference} mm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Kolusu / Anklet Size Guide ── */}
          <section aria-labelledby="kolusu-size-heading" style={{ marginTop: '2.5rem' }}>
            <h2 id="kolusu-size-heading" style={styles.sectionTitle}>Silver Kolusu (Anklet) Size Guide</h2>

            <div style={styles.card}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.88rem', color: '#2C2218', marginBottom: '0.6rem' }}>
                How to measure your ankle
              </h3>
              <ol style={styles.steps}>
                <li>Sit with your foot flat on the floor.</li>
                <li>Wrap a soft tape measure around the narrowest part of your ankle (just above the ankle bone).</li>
                <li>Note the measurement in centimeters.</li>
                <li>Add 1 cm for a comfortable fit, or 2 cm if you prefer a looser kolusu.</li>
                <li>Match to the standard sizes below.</li>
              </ol>
              <div style={styles.tip}>
                💡 <strong>Bridal kolusu:</strong> Traditional heavy kolusu are worn at the ankle bone. For bridal wear, most women choose the 10 inch size.
              </div>
            </div>

            <div style={styles.ankletGrid}>
              {[
                { size: '8 inches', cm: '20.3 cm', fit: 'Slim / petite ankles' },
                { size: '9.75 inches', cm: '24.8 cm', fit: 'Medium ankles (most common)' },
                { size: '10 inches', cm: '25.4 cm', fit: 'Standard / bridal' },
                { size: '10.5 inches', cm: '26.7 cm', fit: 'Larger ankles / loose fit' },
              ].map((item) => (
                <div key={item.size} style={styles.ankletCard}>
                  <p style={styles.waLabel}>Size</p>
                  <p style={styles.waValue}>{item.size}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#8A7A6A', marginTop: '0.2rem' }}>{item.cm} &mdash; {item.fit}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Bracelet Size Guide ── */}
          <section aria-labelledby="bracelet-size-heading" style={{ marginTop: '2.5rem' }}>
            <h2 id="bracelet-size-heading" style={styles.sectionTitle}>Silver Bracelet Size Guide</h2>

            <div style={styles.card}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.88rem', color: '#2C2218', marginBottom: '0.6rem' }}>
                How to measure your wrist
              </h3>
              <ol style={styles.steps}>
                <li>Wrap a soft tape measure around your wrist just below the wrist bone.</li>
                <li>Note the circumference in centimeters.</li>
                <li>Add 1–1.5 cm for a comfortable fit, or 2–2.5 cm if you prefer a loose fit.</li>
              </ol>
              <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[
                  { label: 'Small', wrist: '13–15 cm', bracelet: '~17 cm' },
                  { label: 'Medium', wrist: '15–17 cm', bracelet: '~18.5 cm' },
                  { label: 'Large', wrist: '17–19 cm', bracelet: '~20 cm' },
                ].map((item) => (
                  <div key={item.label} style={{ background: '#FAF8F5', border: '1px solid #EDE8E0', borderRadius: 8, padding: '0.75rem', textAlign: 'center' }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.8rem', color: '#2C2218' }}>{item.label}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#8A7A6A', marginTop: '0.2rem' }}>Wrist: {item.wrist}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#8A7A6A' }}>Bracelet: {item.bracelet}</p>
                  </div>
                ))}
              </div>
              <div style={styles.tip}>
                💡 Bakya bracelets weigh 5.95–7.71 g and measure approximately 18–19 cm in length — ideal for medium wrists. For custom lengths, contact us on WhatsApp.
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section aria-labelledby="size-faq-heading" style={{ marginTop: '2.5rem' }}>
            <h2 id="size-faq-heading" style={styles.sectionTitle}>Size Guide FAQs</h2>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {SIZE_FAQS.map((faq) => (
                <div key={faq.q} style={{ background: '#FFFFFF', border: '1px solid #EDE8E0', borderRadius: 10, padding: '1rem 1.25rem' }}>
                  <dt style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 700, color: '#2C2218', marginBottom: '0.4rem' }}>
                    {faq.q}
                  </dt>
                  <dd style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.84rem', color: '#4A3F35', lineHeight: 1.7, margin: 0 }}>
                    {faq.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ── WhatsApp CTA ── */}
          <div style={{ marginTop: '2.5rem', textAlign: 'center', padding: '2rem', background: '#FFFFFF', border: '1px solid #EDE8E0', borderRadius: 12 }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.3rem', fontWeight: 700, color: '#1C1510', marginBottom: '0.5rem' }}>
              Still not sure of your size?
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#6A5A4A', marginBottom: '1.25rem' }}>
              Message us on WhatsApp with your measurements — our team in Tirunelveli will help you find the perfect fit.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '0.75rem 2rem',
                borderRadius: 30,
                textDecoration: 'none',
              }}
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;600;700&display=swap');
        @media (min-width: 640px) {
          [style*="repeat(2, 1fr)"] { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </>
  )
}
