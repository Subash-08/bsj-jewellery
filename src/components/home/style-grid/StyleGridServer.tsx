import StyleGridClient from './StyleGridClient';

// Exact layout from GIVA source:
// Col 1: Casual Wear (row1) + Traditional (row2)
// Col 2: Party Wear (row1 / span 2)
// Col 3: Gold Gift Card (row1) + Minimalistic (row2)
// Col 4: Twinning (row1 / span 2)  ← the wide tall hero
// Col 5: Traditional/Wedding (row1) + Date Nights (row2)

const styles = [
  {
    title: "Casual Wear",
    href: "/collections/casual-wear",
    col: 1, row: 1, rowSpan: 1,
    mobileImg: "//www.giva.co/cdn/shop/files/1_16_1.webp?v=1759233026&width=1250",
    desktopImg: "//www.giva.co/cdn/shop/files/1_16_1.webp?v=1759233026&width=2000",
    width: 1250, height: 1254,
  },
  {
    title: "Traditional",
    href: "/collections/traditional-wear",
    col: 1, row: 2, rowSpan: 1,
    mobileImg: "//www.giva.co/cdn/shop/files/2_15.webp?v=1759233027&width=1250",
    desktopImg: "//www.giva.co/cdn/shop/files/2_15.webp?v=1759233027&width=2000",
    width: 1250, height: 1256,
  },
  {
    title: "Party Wear",
    href: "/collections/party-wear",
    col: 2, row: 1, rowSpan: 2,
    mobileImg: "//www.giva.co/cdn/shop/files/twinning_1.webp?v=1768476478&width=1250",
    desktopImg: "//www.giva.co/cdn/shop/files/partywear_d671d3cc-d553-4b17-a929-79f536708ee4.webp?v=1773727032&width=2000",
    width: 1250, height: 2475,
  },
  {
    title: "Gold Gift Card",
    href: "/pages/gift-cards",
    col: 3, row: 1, rowSpan: 1,
    mobileImg: "//www.giva.co/cdn/shop/files/5_8_c07f4cd4-f530-4fb8-92bf-c36b7c27014e.webp?v=1759233026&width=1250",
    desktopImg: "//www.giva.co/cdn/shop/files/5_8_c07f4cd4-f530-4fb8-92bf-c36b7c27014e.webp?v=1759233026&width=2000",
    width: 1250, height: 1256,
  },
  {
    title: "Minimalistic",
    href: "/collections/minimalistic",
    col: 3, row: 2, rowSpan: 1,
    mobileImg: "//www.giva.co/cdn/shop/files/7_3_1.webp?v=1759233026&width=1250",
    desktopImg: "//www.giva.co/cdn/shop/files/7_3_1.webp?v=1759233026&width=2000",
    width: 1250, height: 1184,
  },
  {
    title: "Twinning",
    href: "/collections/twinning",
    col: 4, row: 1, rowSpan: 2,
    mobileImg: "//www.giva.co/cdn/shop/files/6_5_c2b734c4-e915-466a-a9ea-7c374b11e607.webp?v=1759233026&width=1250",
    desktopImg: "//www.giva.co/cdn/shop/files/6_5_c2b734c4-e915-466a-a9ea-7c374b11e607.webp?v=1759233026&width=2000",
    width: 1250, height: 2477,
  },
  {
    title: "Traditional",
    href: "/collections/wedding-picks",
    col: 5, row: 1, rowSpan: 1,
    mobileImg: "//www.giva.co/cdn/shop/files/4_10.webp?v=1759233026&width=1250",
    desktopImg: "//www.giva.co/cdn/shop/files/4_10.webp?v=1759233026&width=2000",
    width: 1250, height: 1254,
  },
  {
    title: "Date Nights",
    href: "/collections/date-night",
    col: 5, row: 2, rowSpan: 1,
    mobileImg: "//www.giva.co/cdn/shop/files/8_1_1_140a5f9a-79ae-46c8-91ec-801bb41bfef8.webp?v=1759233026&width=1250",
    desktopImg: "//www.giva.co/cdn/shop/files/8_1_1_140a5f9a-79ae-46c8-91ec-801bb41bfef8.webp?v=1759233026&width=2000",
    width: 1250, height: 1184,
  },
];

export default function StyleGridServer() {
  return (
    <section className="bg-[#FAF8F5] py-10 overflow-hidden">
      <div className="mx-auto px-4">
        <h2 className="text-center mb-16" style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#1C1510',
          lineHeight: 1.1,
        }}>
          Your Style,{' '}
          <span style={{
            fontStyle: 'italic',
            color: '#C9A96E',
          }}>
            Your Way
          </span>
        </h2>
        <StyleGridClient data={styles} />
      </div>
    </section>
  );
}