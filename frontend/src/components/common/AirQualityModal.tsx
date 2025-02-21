import React from 'react';
import { useAirQuality } from '@/hooks/useAirQuality';
import { LoadingSpinner } from './LoadingSpinner';

interface AirQualityModalProps {
  location: string;
  onClose: () => void;
}

export const AirQualityModal: React.FC<AirQualityModalProps> = ({ location, onClose }) => {
  const { data: airQuality, isLoading, error } = useAirQuality(location);

  return (
    <div className="p-6 max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Qualité de l'air à {location}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span className="sr-only">Fermer</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center text-red-600 dark:text-red-400 p-4">
          Une erreur est survenue lors de la récupération des données
        </div>
      ) : airQuality ? (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg bg-${airQuality.color}-50 dark:bg-${airQuality.color}-900/20`}>
            <div className="flex justify-between items-center">
              <div>
                <div className={`text-${airQuality.color}-800 dark:text-${airQuality.color}-200 text-2xl font-bold`}>
                  {airQuality.aqi}
                </div>
                <div className={`text-${airQuality.color}-600 dark:text-${airQuality.color}-300 text-sm`}>
                  Indice de qualité
                </div>
              </div>
              <div className={`text-${airQuality.color}-700 dark:text-${airQuality.color}-200 text-lg font-medium`}>
                {airQuality.level}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(airQuality.components).map(([key, value]) => (
              <div key={key} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {key.toUpperCase()}
                </div>
                <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {typeof value === 'number' ? value.toFixed(1) : value}
                  <span className="text-xs ml-1 text-gray-500 dark:text-gray-400">µg/m³</span>
                </div>
              </div>
            ))}
          </div>

          {airQuality.recommendations && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Recommandations
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                {airQuality.recommendations}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 p-4">
          Aucune donnée disponible pour cette localisation
        </div>
      )}
    </div>
  );
};
