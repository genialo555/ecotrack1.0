import React from 'react';
import { TripsTable } from './TripsTable';
import { VehiclesTable } from './VehiclesTable';

interface Journey {
  id: string;
  created_at: string;
  distance_km: number;
  co2_emissions: number;
  transport_mode: string;
}

interface TablesSectionProps {
  journeys: Journey[];
}

export function TablesSection({ journeys }: TablesSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-base-200 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Derniers Trajets</h2>
        <TripsTable initialJourneys={journeys} />
      </div>
      <div className="bg-base-200 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Véhicules</h2>
        <VehiclesTable />
      </div>
    </div>
  );
}
