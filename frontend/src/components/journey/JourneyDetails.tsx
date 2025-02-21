'use client';

import React, { useEffect, useState } from 'react';
import { getTransitDirections, TransitRoute, TransitStep } from '@/services/transit.service';
import { CustomTravelMode } from './GmapsCardSelector';

interface JourneyDetailsProps {
  origin: string;
  destination: string;
  mode: CustomTravelMode;
  onRouteSelect: (route: TransitRoute) => void;
  onModeChange: (mode: CustomTravelMode) => void;
}

export default function JourneyDetails({
  origin,
  destination,
  mode,
  onRouteSelect,
  onModeChange,
}: JourneyDetailsProps) {
  const [routes, setRoutes] = useState<TransitRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<TransitRoute | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      if (!origin || !destination) return;

      setLoading(true);
      setError(null);

      try {
        const transitRoutes = await getTransitDirections(origin, destination, mode);
        setRoutes(transitRoutes);
        
        // Auto-select the first route if available
        if (transitRoutes.length > 0) {
          setSelectedRoute(transitRoutes[0]);
          onRouteSelect(transitRoutes[0]);
        }
      } catch (err) {
        console.error('Error fetching routes:', err);
        setError('Erreur lors de la récupération des itinéraires');
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [origin, destination, mode]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  };

  const formatDistance = (meters: number): string => {
    const km = meters / 1000;
    return km >= 1 ? `${km.toFixed(1)}km` : `${meters}m`;
  };

  const getTransitIcon = (step: TransitStep): string => {
    if (!step.transit) {
      return step.mode.toLowerCase() === 'walking' ? '🚶' : '🚗';
    }

    const vehicleType = step.transit.line.vehicle.type.toLowerCase();
    switch (vehicleType) {
      case 'train':
        return '🚄';
      case 'subway':
        return '🚇';
      case 'bus':
        return '🚌';
      case 'tram':
        return '🚊';
      case 'airplane':
        return '✈️';
      default:
        return '🚉';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Aucun itinéraire trouvé. Essayez un autre mode de transport.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {routes.map((route, index) => (
        <div
          key={index}
          className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer ${
            selectedRoute === route ? 'border-2 border-primary' : ''
          }`}
          onClick={() => {
            setSelectedRoute(route);
            onRouteSelect(route);
          }}
        >
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h3 className="card-title">
                Option {index + 1}
                {selectedRoute === route && (
                  <span className="badge badge-primary">Sélectionné</span>
                )}
              </h3>
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Durée</div>
                  <div className="stat-value text-lg">
                    {formatDuration(route.duration)}
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-title">Distance</div>
                  <div className="stat-value text-lg">
                    {formatDistance(route.distance)}
                  </div>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <div className="space-y-2">
              {route.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="flex items-center gap-2">
                  <span className="text-2xl">{getTransitIcon(step)}</span>
                  <div className="flex-1">
                    {step.transit ? (
                      <>
                        <p className="font-semibold">
                          {step.transit.line.name || step.transit.line.short_name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {step.transit.departure_stop.name} → {step.transit.arrival_stop.name}
                        </p>
                      </>
                    ) : (
                      <p>
                        {formatDistance(step.distance)} de {step.mode.toLowerCase()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
