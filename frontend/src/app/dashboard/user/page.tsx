'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TripsSection } from '@/app/dashboard/sections/TripsSection';
import { VehiclesTable } from '@/app/dashboard/sections/VehiclesTable';
import { JourneyChart } from '@/app/dashboard/sections/JourneyChart';
import { QuickActionsSection } from '@/app/dashboard/sections/QuickActionsSection';
import RecentActivitiesSection from '@/app/dashboard/sections/RecentActivitiesSection';

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  isActive: boolean;
}

interface Stats {
  totalTrips: number;
  totalDistance: number;
  totalCO2: number;
}

export default function UserDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalTrips: 0,
    totalDistance: 0,
    totalCO2: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/auth/profile`, {
          credentials: 'include',
        });

        if (!response.ok) {
          router.push('/login');
          return;
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/journeys`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch journeys');
        }

        const journeys = await response.json();
        
        // Calculate stats from journeys
        const totalTrips = journeys.length;
        let totalDistance = 0;
        let totalCO2 = 0;

        journeys.forEach((journey: any) => {
          const distance = Number(journey.distance_km);
          const co2 = Number(journey.co2_emissions);
          
          if (!isNaN(distance)) {
            totalDistance += distance;
          }
          if (!isNaN(co2)) {
            totalCO2 += co2;
          }
        });

        setStats({
          totalTrips,
          totalDistance: Math.round(totalDistance * 10) / 10,
          totalCO2: Math.round(totalCO2 * 10) / 10
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 space-y-8 relative" style={{ minHeight: 'calc(100vh - 1.5cm)' }}>
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-base-100 via-base-100 to-base-200 dark:from-base-100 dark:via-base-900 dark:to-base-950 -z-10 animate-gradient-slow"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:to-secondary/10 -z-10 animate-gradient-x"></div>
      <div className="fixed inset-0 bg-grid-pattern animate-grid-float opacity-[0.02] dark:opacity-[0.03] -z-10"></div>

      {/* Welcome Section */}
      <div className="flex justify-between items-center py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-base-content dark:text-base-content/90 bg-gradient-to-r from-primary/90 to-secondary/90 bg-clip-text text-transparent">
          Bonjour, {user.email.split('@')[0]} 👋
        </h1>
      </div>

      {/* Main Content and Sidebar */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column - Stats and Chart */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="stats shadow bg-base-100/50 dark:bg-base-900/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="stat p-6">
                <div className="stat-figure text-primary dark:text-primary/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="stat-title text-base-content/70 dark:text-base-content/60">Trajets</div>
                <div className="stat-value text-primary dark:text-primary/90">{stats.totalTrips}</div>
                <div className="stat-desc text-base-content/60 dark:text-base-content/50">Total des trajets</div>
              </div>
            </div>

            <div className="stats shadow bg-base-100/50 dark:bg-base-900/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="stat p-6">
                <div className="stat-figure text-error dark:text-error/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 22l3-3" />
                    <path d="M18 22l3-3" />
                    <path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2" />
                    <path d="M12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2" />
                    <path d="M12 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2" />
                  </svg>
                </div>
                <div className="stat-title text-base-content/70 dark:text-base-content/60">CO₂ Émis</div>
                <div className="stat-value text-error dark:text-error/90">{Number(stats.totalCO2).toFixed(1)} kg</div>
                <div className="stat-desc text-base-content/60 dark:text-base-content/50">Total des émissions</div>
              </div>
            </div>

            <div className="stats shadow bg-base-100/50 dark:bg-base-900/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="stat p-6">
                <div className="stat-figure text-accent dark:text-accent/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className="stat-title text-base-content/70 dark:text-base-content/60">Distance</div>
                <div className="stat-value text-accent dark:text-accent/90">{Number(stats.totalDistance).toFixed(1)} km</div>
                <div className="stat-desc text-base-content/60 dark:text-base-content/50">Total parcouru</div>
              </div>
            </div>

            <div className="stats shadow bg-base-100/50 dark:bg-base-900/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="stat p-6">
                <div className="stat-figure text-success dark:text-success/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="stat-title text-base-content/70 dark:text-base-content/60">Objectif</div>
                <div className="stat-value text-success dark:text-success/90">89%</div>
                <div className="stat-desc text-base-content/60 dark:text-base-content/50">Réduction CO₂</div>
              </div>
            </div>
          </div>

          {/* Journey Chart */}
          <div className="mt-8">
            <JourneyChart />
          </div>

          {/* Trips Section */}
          <div className="mt-8">
            <TripsSection />
          </div>

          {/* Vehicles Table */}
          <div className="mt-8">
            <VehiclesTable />
          </div>
        </div>

        {/* Right Column - Quick Actions and Recent Activities */}
        <div className="col-span-12 lg:col-span-3 space-y-8">
          {/* Quick Actions */}
          <div className="card bg-white dark:bg-base-900/50 shadow-sm hover:shadow-md transition-all duration-300 p-4">
            <div className="card-body p-0">
              {user && user.id ? (
                <QuickActionsSection userId={user.id} />
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card bg-white dark:bg-base-900/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="card-body">
              <RecentActivitiesSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
