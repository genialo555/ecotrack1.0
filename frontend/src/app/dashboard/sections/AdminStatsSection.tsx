'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/common/Card';

interface Stats {
  totalUsers: number;
  totalVehicles: number;
  totalTrips: number;
  totalCO2Saved: number;
}

export function AdminStatsSection() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/admin/stats`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Card className="bg-base-200 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Statistiques</h2>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 bg-base-300 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="bg-base-200 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Statistiques</h2>
        <p className="text-center text-gray-500">Erreur de chargement des statistiques</p>
      </Card>
    );
  }

  return (
    <Card className="bg-base-200 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Statistiques</h2>
      <div className="space-y-3">
        <p>
          <span className="font-medium">Utilisateurs totaux:</span>{' '}
          {stats.totalUsers}
        </p>
        <p>
          <span className="font-medium">Véhicules enregistrés:</span>{' '}
          {stats.totalVehicles}
        </p>
        <p>
          <span className="font-medium">Trajets enregistrés:</span>{' '}
          {stats.totalTrips}
        </p>
        <p>
          <span className="font-medium">CO₂ total économisé:</span>{' '}
          {stats.totalCO2Saved} kg
        </p>
      </div>
    </Card>
  );
}
