'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/common/Card';
import { TripsTable } from './TripsTable';

interface Vehicle {
  id: string;
  type: string;
  brand: string;
  model: string;
  co2_rate: number;
}

interface Journey {
  id: string;
  transport_mode: string;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time: string;
  distance_km: number;
  co2_emissions: number;
  vehicle?: Vehicle;
  created_at?: string;
}

export function TripsSection({ hideStats = false }: { hideStats?: boolean }) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/journeys`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch journeys: ${response.statusText}`);
        }

        const data = await response.json();
        setJourneys(data);
      } catch (error) {
        console.error('Error fetching journeys:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneys();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!journeys || journeys.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Aucun trajet</h3>
            <button className="btn btn-primary btn-sm">
              Ajouter un trajet
            </button>
          </div>
          <p className="text-base-content/70 mt-2">
            Vous n'avez pas encore enregistré de trajet. Commencez par en ajouter un !
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Latest Journey Card */}
      <div 
        className="card shadow-xl bg-gradient-to-br from-base-100 via-base-100 to-base-200 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="card-body p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-indigo-500/5 pointer-events-none"></div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              {!hideStats && <h3 className="text-2xl font-extrabold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">Dernier trajet</h3>}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary btn-sm font-semibold"
              >
                Ajouter un trajet
              </button>
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-base-200 rounded-lg"></div>
              ))}
            </div>
          ) : journeys.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg font-medium text-base-content/70 dark:text-base-content/60">Aucun trajet enregistré</p>
            </div>
          ) : (
            <TripsTable initialJourneys={journeys} showTotal={!hideStats} showAll={false} compact={true} />
          )}
        </div>
      </div>

      {/* Modal for all journeys */}
      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-5xl bg-base-100">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold">Historique des trajets</h3>
              <div className="badge badge-lg badge-primary">
                {journeys.length} {journeys.length === 1 ? 'trajet' : 'trajets'}
              </div>
            </div>
            <button 
              className="btn btn-sm btn-circle btn-ghost" 
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="max-h-[70vh] overflow-y-auto">
            <TripsTable initialJourneys={journeys} showTotal={true} showAll={true} />
          </div>

          <div className="modal-action mt-6 pt-4 border-t">
            <button 
              className="btn btn-primary"
              onClick={() => setIsModalOpen(false)}
            >
              Fermer
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
}
