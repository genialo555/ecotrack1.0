'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import { Sidenav } from './Sidenav';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-base-100 flex">
      <div className="-mt-3">
        <Sidenav />
      </div>
      <div className="flex-1 flex flex-col relative">
        <div className="absolute top-4 right-4 z-50">
          <Navbar />
        </div>
        <main className="flex-1 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
};
