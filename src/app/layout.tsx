import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartProvider';
import { SessionProvider } from '@/context/SessionProvider';
import { AuthProvider } from '@/context/AuthProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import { WishlistProvider } from '@/context/WishlistProvider';
import Navbar from '@/components/layout/Navbar';
import ShopByCategoryMenu from '@/components/layout/ShopByCategoryMenu';
import { Toaster } from 'sonner';
import { getCustomerFromSession } from '@/lib/auth/session';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BSJ Jewellery - Exquisite Jewelry for Every Occasion',
  description: 'Discover our stunning collection of rings, necklaces, bangles, and more. Premium quality jewelry with free shipping on orders above ₹10,000.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                </CartProvider>
              </WishlistProvider>
            </ThemeProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

