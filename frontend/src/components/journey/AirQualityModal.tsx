// ecotrak/frontend/src/components/journey/GmapsJourneyDetails/components/AirQualityModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getAirQuality } from '@/services/airQuality.service';

interface AirQualityData {
  aqi: number;
  level: string;
  color: string;
  components: {
    pm2_5: number;
    pm10: number;
    no2: number;
    o3: number;
    so2: number;
    co: number;
  };
  recommendations: {
    generalPopulation: string;
    elderly: string;
    children: string;
    athletes: string;
  };
}

interface AirQualityModalProps {
  location: string;
  onClose: () => void;
}

export const AirQualityModal: React.FC<AirQualityModalProps> = ({ location, onClose }) => {
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAirQuality = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAirQuality(location);
        setAirQuality(data);
      } catch (err) {
        console.error('Error fetching air quality:', err);
        setError('Erreur lors de la récupération des données de qualité de l\'air');
      } finally {
        setIsLoading(false);
      }
    };

    if (location) {
      fetchAirQuality();
    }
  }, [location]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6 relative">
          <div className="flex justify-center items-center h-40">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !airQuality) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6 relative">
          <button onClick={onClose} className="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
          <div className="text-center py-8">
            <div className="text-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Erreur</h3>
            <p>{error || 'Données non disponibles pour cette localisation'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6 relative">
        <button onClick={onClose} className="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
        
        <h2 className="text-2xl font-bold mb-6">Qualité de l'air à {location}</h2>
        
        <div className={`alert alert-${airQuality.color} mb-6`}>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold">{airQuality.aqi}</div>
            <div>
              <div className="font-semibold">{airQuality.level}</div>
              <div className="text-sm opacity-75">Indice de qualité de l'air</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {airQuality.components.pm2_5 !== undefined && (
            <div className="bg-base-200 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">PM2.5</div>
              <div className="text-lg font-semibold">
                {airQuality.components.pm2_5.toFixed(1)}
                <span className="text-xs ml-1 text-gray-500">µg/m³</span>
              </div>
            </div>
          )}
          
          {airQuality.components.pm10 !== undefined && (
            <div className="bg-base-200 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">PM10</div>
              <div className="text-lg font-semibold">
                {airQuality.components.pm10.toFixed(1)}
                <span className="text-xs ml-1 text-gray-500">µg/m³</span>
              </div>
            </div>
          )}

          {airQuality.components.no2 !== undefined && (
            <div className="bg-base-200 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">NO₂</div>
              <div className="text-lg font-semibold">
                {airQuality.components.no2.toFixed(1)}
                <span className="text-xs ml-1 text-gray-500">µg/m³</span>
              </div>
            </div>
          )}

          {airQuality.components.o3 !== undefined && (
            <div className="bg-base-200 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">O₃</div>
              <div className="text-lg font-semibold">
                {airQuality.components.o3.toFixed(1)}
                <span className="text-xs ml-1 text-gray-500">µg/m³</span>
              </div>
            </div>
          )}
        </div>

        {airQuality.recommendations && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Recommandations</h3>
            <div className="space-y-2">
              {airQuality.recommendations.generalPopulation && (
                <div className="alert alert-info">
                  <div>
                    <span className="font-semibold">Population générale:</span>
                    <p>{airQuality.recommendations.generalPopulation}</p>
                  </div>
                </div>
              )}
              {airQuality.recommendations.elderly && (
                <div className="alert alert-warning">
                  <div>
                    <span className="font-semibold">Personnes âgées:</span>
                    <p>{airQuality.recommendations.elderly}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
