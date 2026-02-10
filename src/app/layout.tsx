import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartProvider';
import { SessionProvider } from '@/context/SessionProvider';
import { AuthProvider } from '@/context/AuthProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import { WishlistProvider } from '@/context/WishlistProvider';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jewelry Store',
  description: 'Exquisite jewelry for every occasion',
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
                <CartProvider>{children}</CartProvider>
              </WishlistProvider>
            </ThemeProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
