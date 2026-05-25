import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartProvider';
import { SessionProvider } from '@/context/SessionProvider';
import { AuthProvider } from '@/context/AuthProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import { WishlistProvider } from '@/context/WishlistProvider';
import Navbar from '@/components/layout/Navbar';
import ShopByCategoryMenu from '@/components/layout/ShopByCategoryMenu';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'sonner';
import { getCustomerFromSession } from '@/lib/auth/session';
import type { Metadata, Viewport } from 'next';
import { SchemaScript } from '@/components/seo/SchemaScript';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { Analytics } from '@/components/analytics/Analytics';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1C1510',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bakya.in'),
  title: {
    default: 'Bakya — Silver Kolusu, Chains, Bracelets & Rings | Since 1997',
    template: '%s | Bakya Silver Jewellery',
  },
  description:
    'Bakya by Bagyalakshmi Jewellers — handcrafted 92.5 BIS hallmarked silver jewellery from Tirunelveli since 1997. Silver kolusu, chains, bracelets, pendants & rings. Ships across Tamil Nadu.',
  keywords: [
    'silver kolusu',
    'silver jewellery Tamil Nadu',
    '92.5 silver',
    'BIS hallmarked silver',
    'Tirunelveli jewellers',
    'silver anklets women',
  ],
  authors: [{ name: 'Bakya by Bagyalakshmi Jewellers' }],
  creator: 'Bakya',
  publisher: 'Bakya by Bagyalakshmi Jewellers',
  icons: {
    icon: [
      { url: '/bakya 64 x 64.ico', sizes: 'any' },
      { url: '/bakya 64 x 64.png', type: 'image/png', sizes: '64x64' },
      { url: '/BAKYA 512 X 512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/BAKYA 512 X 512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/bakya 64 x 64.ico',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.bakya.in',
    siteName: 'Bakya Silver Jewellery',
    title: 'Bakya — Handcrafted Silver Jewellery from Tirunelveli',
    description:
      'BIS hallmarked 92.5 silver kolusu, bracelets, chains & rings. Trusted since 1997. Ships Tamil Nadu.',
    images: [
      {
        url: '/logo.png',
        alt: 'Bakya Silver Jewellery — Tirunelveli',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bakya — Handcrafted Silver Jewellery from Tirunelveli',
    description:
      'BIS hallmarked 92.5 silver kolusu, bracelets, chains & rings. Trusted since 1997.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://www.bakya.in',
    languages: { 'en-IN': 'https://www.bakya.in' },
  },
  other: {
    'geo.region': 'IN-TN',
    'geo.placename': 'Tirunelveli',
    'geo.position': '8.7139;77.7567',
    ICBM: '8.7139, 77.7567',
  },
};

function ComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-6">
      <div className="w-full max-w-2xl text-center space-y-8">

        {/* Logo / Brand */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          BSJ Jewellers
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-400 text-lg md:text-xl">
          We're crafting something exceptional.
        </p>

        {/* Main Message */}
        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-semibold">
            Coming Soon
          </h2>
          <p className="text-zinc-400">
            Our store is getting a premium upgrade. Stay tuned.
          </p>
        </div>

        {/* Footer */}
        <p className="text-sm text-zinc-500 mt-10">
          © {new Date().getFullYear()} BSJ Jewellers. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isComingSoon = process.env.COMING_SOON === 'true';

  if (isComingSoon) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <ComingSoonPage />
        </body>
      </html>
    );
  }

  const initialCustomer = await getCustomerFromSession();

  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <SchemaScript schema={[organizationSchema(), websiteSchema()]} />
      </head>
      <body className={inter.className}>
        <Analytics />
        <SessionProvider>
          <AuthProvider initialCustomer={initialCustomer}>
            <ThemeProvider>
              <WishlistProvider>
                <CartProvider>
                  <Toaster position="bottom-center" richColors closeButton expand />
                  <Navbar categoryMenuSlot={<ShopByCategoryMenu />} />
                  <main>
                    {children}
                  </main>
                  <Footer />
                  <WhatsAppButton />
                </CartProvider>
              </WishlistProvider>
            </ThemeProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

