'use client';

import React, { useState, useEffect } from 'react';
import { UserManagement } from './sections/UserManagement';
import { VehicleManagement } from './sections/VehicleManagement';
import { JourneyManagement } from './sections/JourneyManagement';
import { AdminStatsChart } from './sections/AdminStatsChart';
import RecentActivitiesSection from '@/app/dashboard/sections/RecentActivitiesSection';
import { api } from '@/lib/api';

interface DashboardStats {
  users: {
    total: number;
    growth: number;
  };
  vehicles: {
    total: number;
    growth: number;
  };
  journeys: {
    total: number;
    growth: number;
  };
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'vehicles' | 'journeys'>('stats');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch current stats
        const [usersRes, vehiclesRes, journeysRes] = await Promise.all([
          api.get('admin/users'),
          api.get('vehicles'),
          api.get('journeys')
        ]);

        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        const vehicles = Array.isArray(vehiclesRes.data) ? vehiclesRes.data : [];
        const journeys = Array.isArray(journeysRes.data) ? journeysRes.data : [];

        // Calculate month-over-month growth
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats: DashboardStats = {
          users: {
            total: users.length,
            growth: calculateGrowth(users, lastMonth)
          },
          vehicles: {
            total: vehicles.length,
            growth: calculateGrowth(vehicles, lastMonth)
          },
          journeys: {
            total: journeys.length,
            growth: calculateGrowth(journeys, lastMonth)
          }
        };

        setStats(stats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const calculateGrowth = (items: any[], lastMonth: Date) => {
    if (!Array.isArray(items)) return 0;
    
    const currentCount = items.length;
    const lastMonthCount = items.filter(item => 
      item?.created_at && new Date(item.created_at) < lastMonth
    ).length;

    if (lastMonthCount === 0) return 100; // If there were no items last month
    return Math.round(((currentCount - lastMonthCount) / lastMonthCount) * 100);
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 50) return 'text-success';
    if (growth > 20) return 'text-info';
    if (growth > 0) return 'text-warning';
    return 'text-error';
  };

  const getGrowthAnimation = (growth: number) => {
    if (growth > 50) return 'animate-pulse';
    if (growth > 20) return 'animate-bounce';
    return '';
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-6 shadow-lg backdrop-blur-sm">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Manage users, track journeys, and monitor eco-impact metrics
        </p>
      </div>

      <div className="tabs tabs-boxed bg-base-200/50 p-2 justify-center gap-2">
        <button
          className={`tab tab-lg ${activeTab === 'stats' ? 'tab-active bg-primary/20 text-primary' : 'hover:bg-base-300'}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button
          className={`tab tab-lg ${activeTab === 'users' ? 'tab-active bg-secondary/20 text-secondary' : 'hover:bg-base-300'}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`tab tab-lg ${activeTab === 'vehicles' ? 'tab-active bg-accent/20 text-accent' : 'hover:bg-base-300'}`}
          onClick={() => setActiveTab('vehicles')}
        >
          Vehicles
        </button>
        <button
          className={`tab tab-lg ${activeTab === 'journeys' ? 'tab-active bg-accent/20 text-accent' : 'hover:bg-base-300'}`}
          onClick={() => setActiveTab('journeys')}
        >
          Journeys
        </button>
      </div>

      <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl shadow-xl backdrop-blur-sm">
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {loading ? (
              <>
                {[1, 2, 3].map(i => (
                  <div key={i} className="stats shadow animate-pulse bg-base-300">
                    <div className="stat h-24"></div>
                  </div>
                ))}
              </>
            ) : stats ? (
              <>
                <div className="stats shadow bg-gradient-to-br from-blue-500/10 to-blue-600/20">
                  <div className="stat">
                    <div className="stat-title text-blue-900 dark:text-blue-100 font-medium">Total Users</div>
                    <div className="stat-value text-blue-600 dark:text-blue-400">{stats.users.total.toLocaleString()}</div>
                    <div className="stat-desc">
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {stats.users.growth > 0 ? '↗︎' : '↘︎'} {Math.abs(stats.users.growth)}%
                      </span>
                      {' '}from last month
                    </div>
                  </div>
                </div>

                <div className="stats shadow bg-gradient-to-br from-purple-500/10 to-purple-600/20">
                  <div className="stat">
                    <div className="stat-title text-purple-900 dark:text-purple-100 font-medium">Active Vehicles</div>
                    <div className="stat-value text-purple-600 dark:text-purple-400">{stats.vehicles.total.toLocaleString()}</div>
                    <div className="stat-desc">
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {stats.vehicles.growth > 0 ? '↗︎' : '↘︎'} {Math.abs(stats.vehicles.growth)}%
                      </span>
                      {' '}from last month
                    </div>
                  </div>
                </div>

                <div className="stats shadow bg-gradient-to-br from-amber-500/10 to-amber-600/20">
                  <div className="stat">
                    <div className="stat-title text-amber-900 dark:text-amber-100 font-medium">Total Journeys</div>
                    <div className="stat-value text-amber-600 dark:text-amber-400">{stats.journeys.total.toLocaleString()}</div>
                    <div className="stat-desc">
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {stats.journeys.growth > 0 ? '↗︎' : '↘︎'} {Math.abs(stats.journeys.growth)}%
                      </span>
                      {' '}from last month
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="alert alert-error">
                <span>Failed to load dashboard statistics</span>
              </div>
            )}
          </div>
        )}
        {activeTab === 'stats' && <AdminStatsChart />}
        {activeTab === 'stats' && <RecentActivitiesSection />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'vehicles' && <VehicleManagement />}
        {activeTab === 'journeys' && <JourneyManagement />}
      </div>
    </div>
  );
};
