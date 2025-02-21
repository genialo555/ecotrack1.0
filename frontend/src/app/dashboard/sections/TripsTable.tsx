import { useState, useEffect } from 'react';
import { Journey } from '@/types/journey';
import { JourneyChart } from '@/components/journey/JourneyChart';

interface TripsTableProps {
  initialJourneys?: Journey[];
  showTotal?: boolean;
  showAll?: boolean;
  compact?: boolean;
}

export function TripsTable({ 
  initialJourneys = [], 
  showTotal = true, 
  showAll = false,
  compact = false 
}: TripsTableProps) {
  const [journeys, setJourneys] = useState<Journey[]>(initialJourneys);
  const [loading, setLoading] = useState(!initialJourneys.length);

  useEffect(() => {
    const fetchJourneys = async () => {
      if (initialJourneys.length > 0) {
        setJourneys(initialJourneys);
        setLoading(false);
        return;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/journeys`, {
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch journeys');

        const data = await response.json();
        setJourneys(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneys();
  }, [initialJourneys]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVehicleDisplay = (journey: Journey) => {
    if (journey.vehicle) {
      return `${journey.vehicle.brand} ${journey.vehicle.model}`;
    }
    return journey.transport_mode.charAt(0).toUpperCase() + journey.transport_mode.slice(1);
  };

  const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '0.0';
    return Number(value).toFixed(1);
  };

  const calculateTotal = (journeys: Journey[], field: keyof Pick<Journey, 'distance_km' | 'co2_emissions'>): number => {
    let total = 0;
    journeys.forEach(journey => {
      const value = journey[field];
      if (typeof value === 'number' && !isNaN(value)) {
        total += value;
      }
    });
    return Math.round(total * 10) / 10;
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <span className="loading loading-spinner loading-md text-primary"></span>
      </div>
    );
  }

  const displayJourneys = showAll ? journeys : journeys.slice(0, 1);
  const totalDistance = calculateTotal(displayJourneys, 'distance_km');
  const totalCO2 = calculateTotal(displayJourneys, 'co2_emissions');

  return (
    <div className={`overflow-x-auto ${compact ? 'text-sm' : ''}`}>
      <table className="table w-full">
        <thead>
          <tr className="bg-base-200">
            <th className="font-bold text-base text-base-content/70 dark:text-base-content/60">Date</th>
            <th className="font-bold text-base text-base-content/70 dark:text-base-content/60">Transport</th>
            <th className="font-bold text-base text-base-content/70 dark:text-base-content/60">Départ</th>
            <th className="font-bold text-base text-base-content/70 dark:text-base-content/60">Arrivée</th>
            <th className="text-right font-bold text-base text-base-content/70 dark:text-base-content/60">Distance</th>
            <th className="text-right font-bold text-base text-base-content/70 dark:text-base-content/60">CO₂</th>
          </tr>
        </thead>
        <tbody className="text-base-content dark:text-base-content/90">
          {displayJourneys.map((journey, index) => (
            <tr key={journey.id} className={index % 2 === 0 ? 'bg-base-100' : 'bg-base-50'}>
              <td className="whitespace-nowrap">
                <div className="font-semibold">{formatDate(journey.created_at || journey.start_time)}</div>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <span className="badge badge-ghost font-medium">{getVehicleDisplay(journey)}</span>
                </div>
              </td>
              <td>
                <div className="flex flex-col">
                  <span className="font-semibold">{journey.start_location || '-'}</span>
                </div>
              </td>
              <td>
                <div className="flex flex-col">
                  <span className="font-semibold">{journey.end_location || '-'}</span>
                </div>
              </td>
              <td className="text-right font-semibold">{formatNumber(journey.distance_km)} km</td>
              <td className="text-right font-semibold">{formatNumber(journey.co2_emissions)} kg</td>
            </tr>
          ))}
        </tbody>
        {showTotal && displayJourneys.length > 0 && (
          <tfoot>
            <tr className="bg-base-200">
              <td colSpan={4} className="text-right font-extrabold text-base-content/80 dark:text-base-content/70">Total:</td>
              <td className="text-right font-extrabold text-base-content/80 dark:text-base-content/70">{formatNumber(totalDistance)} km</td>
              <td className="text-right font-extrabold text-base-content/80 dark:text-base-content/70">{formatNumber(totalCO2)} kg</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
