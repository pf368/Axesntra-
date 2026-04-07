import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LayoutWrapper } from '@/components/layout-wrapper';

export const metadata: Metadata = {
  title: 'Axesntra | Carrier Intelligence Platform',
  description: 'Axesntra helps insurance, freight, and transportation teams screen carriers, analyze safety trends, and identify operational risk.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
