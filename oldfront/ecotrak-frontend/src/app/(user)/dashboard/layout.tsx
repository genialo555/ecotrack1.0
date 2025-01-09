'use client';

import React from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { TopNav } from '@/components/dashboard/TopNav';
import { useAuthContext } from '@/components/providers/auth-provider';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuthContext();

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        userEmail={user?.email}
        onLogout={signOut}
      />
      <main className="pl-sidebar pt-header min-h-screen">
        <TopNav 
          onAddJourney={() => {}} 
          onOpenSettings={() => {}}
        />
        {children}
      </main>
    </div>
  );
}
