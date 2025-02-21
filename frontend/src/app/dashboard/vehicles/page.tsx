'use client';

import { useEffect, useState } from 'react';

interface Vehicle {
  id: string;
  type: string;
  brand: string;
  model: string;
  co2_rate: number;
  is_active: boolean;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/vehicles`, {
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch vehicles');

        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center p-4">
        <div className="alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Aucun véhicule enregistré</span>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Véhicule</th>
            <th>Type</th>
            <th>CO₂</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.brand} {vehicle.model}</td>
              <td>{vehicle.type}</td>
              <td>{vehicle.co2_rate} g/km</td>
              <td>
                <div className={`badge ${vehicle.is_active ? 'badge-success' : 'badge-error'}`}>
                  {vehicle.is_active ? 'Actif' : 'Inactif'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
