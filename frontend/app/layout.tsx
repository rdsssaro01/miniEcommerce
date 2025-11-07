import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/Context/auth-context';
import { Navbar } from '@/components/navbar';
import { ProductProvider } from '@/lib/Context/product.context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FITZDO',
  description: 'Browse and shop quality products online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <ProductProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <footer className="border-t bg-slate-50">
                <div className="container mx-auto px-4 py-8 text-center text-sm text-slate-600">
                  © 2025 Fit. All rights reserved.
                </div>
              </footer>
            </div>
          </AuthProvider>
        </ProductProvider>
      </body>
    </html>
  );
}
