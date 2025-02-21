'use client';

import { SessionProvider } from 'next-auth/react';
import { Layout } from './Layout';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Layout>{children}</Layout>
    </SessionProvider>
  );
}
