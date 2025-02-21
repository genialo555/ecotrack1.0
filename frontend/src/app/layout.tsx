import { Inter } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EcoTrack',
  description: 'Surveillez et gérez vos données environnementales en toute simplicité',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-theme="light">
      <body className={inter.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
