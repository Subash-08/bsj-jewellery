import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

// Brand colors
const PURPLE = { r: 35, g: 5, b: 50 }     // #230532
const GOLD   = { r: 212, g: 175, b: 55 }   // #D4AF37
const WHITE  = { r: 255, g: 255, b: 255 }

// Build an SVG string for a 1200x630 OG image
function buildOgSvg({ title, subtitle }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#230532"/>
      <stop offset="100%" stop-color="#3a0a5e"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#D4AF37"/>
      <stop offset="50%"  stop-color="#E5C95A"/>
      <stop offset="100%" stop-color="#D4AF37"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Decorative border -->
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#D4AF37" stroke-width="1.5" opacity="0.4"/>
  <rect x="50" y="50" width="1100" height="530" fill="none" stroke="#D4AF37" stroke-width="0.5" opacity="0.2"/>

  <!-- Corner ornaments -->
  <text x="52" y="78"  font-size="24" fill="#D4AF37" opacity="0.6">✦</text>
  <text x="1124" y="78"  font-size="24" fill="#D4AF37" opacity="0.6">✦</text>
  <text x="52" y="610" font-size="24" fill="#D4AF37" opacity="0.6">✦</text>
  <text x="1124" y="610" font-size="24" fill="#D4AF37" opacity="0.6">✦</text>

  <!-- Gold divider top -->
  <rect x="540" y="160" width="120" height="1.5" fill="url(#gold)" opacity="0.7"/>

  <!-- BAKYA wordmark -->
  <text x="600" y="300"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="128"
    font-weight="700"
    letter-spacing="24"
    text-anchor="middle"
    fill="url(#gold)">BAKYA</text>

  <!-- Star above -->
  <text x="600" y="175"
    font-family="Georgia, serif"
    font-size="28"
    text-anchor="middle"
    fill="#D4AF37">✦</text>

  <!-- Gold divider bottom -->
  <rect x="440" y="330" width="320" height="1.5" fill="url(#gold)" opacity="0.6"/>

  <!-- Tagline -->
  <text x="600" y="380"
    font-family="Georgia, serif"
    font-size="22"
    letter-spacing="6"
    text-anchor="middle"
    fill="#E5C95A"
    opacity="0.9">${title}</text>

  <!-- Subtitle -->
  <text x="600" y="420"
    font-family="Georgia, serif"
    font-size="16"
    letter-spacing="2"
    text-anchor="middle"
    fill="#D4AF37"
    opacity="0.6">${subtitle}</text>

  <!-- Bottom brand line -->
  <text x="600" y="540"
    font-family="Georgia, serif"
    font-size="13"
    letter-spacing="3"
    text-anchor="middle"
    fill="#D4AF37"
    opacity="0.4">BAKYA BY BAGYALAKSHMI JEWELLERS · TIRUNELVELI · EST. 1997</text>
</svg>`
}

// Storefront placeholder (same dimensions, different subtitle)
function buildStorefrontSvg() {
  return buildOgSvg({
    title: 'HANDCRAFTED SILVER JEWELLERY',
    subtitle: '92.5 BIS Hallmarked · Since 1997 · Tirunelveli',
  })
}

async function generate() {
  // og-default.jpg
  const ogSvg = buildOgSvg({
    title: 'HANDCRAFTED SILVER JEWELLERY',
    subtitle: '92.5 BIS Hallmarked · Ships Across India',
  })

  await sharp(Buffer.from(ogSvg))
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(join(publicDir, 'og-default.jpg'))
  console.log('✓  public/og-default.jpg  (1200×630)')

  // storefront.jpg
  const storefrontSvg = buildStorefrontSvg()
  await sharp(Buffer.from(storefrontSvg))
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(join(publicDir, 'storefront.jpg'))
  console.log('✓  public/storefront.jpg  (1200×630)')

  // og-blog.jpg
  const blogSvg = buildOgSvg({
    title: 'BAKYA JOURNAL',
    subtitle: 'Silver Care · Tamil Jewellery Traditions · Tirunelveli',
  })
  await sharp(Buffer.from(blogSvg))
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(join(publicDir, 'og-blog.jpg'))
  console.log('✓  public/og-blog.jpg     (1200×630)')

  console.log('\nAll OG placeholder images generated.')
  console.log('Replace them with real photographs whenever ready.')
}

generate().catch(err => {
  console.error('Failed to generate images:', err)
  process.exit(1)
})
