// ecotrak/frontend/src/components/journey/GmapsJourneyDetails/components/NextDeparturesList.tsx
'use client';

import React from 'react';

interface Departure {
  line: string;
  departure: string;
  arrival: string;
  stops: number;
}

interface NextDeparturesListProps {
  departures: Departure[];
}

export const NextDeparturesList: React.FC<NextDeparturesListProps> = ({ departures }) => {
  if (!departures.length) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Prochains départs
      </h4>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {departures.map((departure, index) => (
          <div key={index} className="py-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="badge badge-primary">{departure.line}</div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {departure.stops} arrêt{departure.stops > 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">{departure.departure}</span>
                <span className="text-gray-500 dark:text-gray-400"> → </span>
                <span className="font-medium">{departure.arrival}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};