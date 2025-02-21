'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RecentActivity from '@/components/dashboard/RecentActivity';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Main content area */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-4">Redirection en cours...</p>
          </div>
        ) : null}
      </div>

      {/* Recent Activity Section */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="max-w-4xl">
          <RecentActivity />
        </div>
      </section>
    </div>
  );
}