import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartProvider';
import { SessionProvider } from '@/context/SessionProvider';
import { AuthProvider } from '@/context/AuthProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import { WishlistProvider } from '@/context/WishlistProvider';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from 'sonner';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BSJ Jewellery - Exquisite Jewelry for Every Occasion',
  description: 'Discover our stunning collection of rings, necklaces, bangles, and more. Premium quality jewelry with free shipping on orders above ₹10,000.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <AuthProvider>
            <ThemeProvider>
              <WishlistProvider>
                <CartProvider>
                  <Toaster position="top-right" richColors closeButton expand />
                  <Navbar />
                  {children}
                </CartProvider>
              </WishlistProvider>
            </ThemeProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
