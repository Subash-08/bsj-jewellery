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
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BSJ Jewellery - Exquisite Jewelry for Every Occasion',
  description: 'Discover our stunning collection of rings, necklaces, bangles, and more. Premium quality jewelry with free shipping on orders above ₹10,000.',
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
    <html lang="en">
      <body className={inter.className}>
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
                </CartProvider>
              </WishlistProvider>
            </ThemeProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

