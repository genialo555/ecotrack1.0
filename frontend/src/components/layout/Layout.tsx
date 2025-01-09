'use client';

import { Navbar } from './Navbar';
import { Sidenav } from './Sidenav';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-base-100 flex">
      <Sidenav />
      <div className="flex-1">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
};
