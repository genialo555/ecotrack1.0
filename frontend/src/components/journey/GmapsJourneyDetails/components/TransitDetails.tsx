import React from 'react';
import type { Route } from '../types';

interface TransitDetailsProps {
  route: Route;
  origin: string;
  destination: string;
}

export const TransitDetails: React.FC<TransitDetailsProps> = ({ route, origin, destination }) => {
  if (!route?.routes?.[0]?.legs?.[0]?.steps) {
    return null;
  }

  const steps = route.routes[0].legs[0].steps;

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Détails du trajet en transport</h3>
        <div className="text-sm text-gray-500">
          {origin} → {destination}
        </div>
      </div>
      
      {steps.map((step, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          {step.transit ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2zm8 0V5a2 2 0 00-2-2H8a2 2 0 00-2 2v2h10z" />
                </svg>
                <span className="font-medium">
                  {step.transit.line?.vehicle?.name || 'Transport en commun'}
                  {step.transit.line?.short_name && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Ligne {step.transit.line.short_name}
                    </span>
                  )}
                </span>
              </div>
              <div className="ml-7 space-y-1">
                <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: step.html_instructions }} />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <div className="text-xs text-gray-500">Départ</div>
                    <div className="text-sm font-medium">{step.transit.departure_stop?.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Arrivée</div>
                    <div className="text-sm font-medium">{step.transit.arrival_stop?.name}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {Math.round(step.duration.value / 60)} minutes
                  {step.transit.num_stops && (
                    <span className="ml-2">• {step.transit.num_stops} arrêts</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2zm8 0V5a2 2 0 00-2-2H8a2 2 0 00-2 2v2h10z" />
              </svg>
              <div>
                <div dangerouslySetInnerHTML={{ __html: step.html_instructions }} />
                <div className="text-sm text-gray-500 mt-1">
                  {Math.round(step.duration.value / 60)} minutes • {step.distance?.text}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
