import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { TransitSchedule } from '@/types/transit';

interface TransitOptionsProps {
  schedules: TransitSchedule[];
  onSelect: (schedule: TransitSchedule) => void;
  className?: string;
}

export const TransitOptions: React.FC<TransitOptionsProps> = ({
  schedules,
  onSelect,
  className = '',
}) => {
  if (!schedules.length) {
    return (
      <div className="text-center p-4 text-gray-500">
        Aucun horaire disponible pour ce trajet
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Options de transport en commun
      </h3>
      <div className="grid gap-4">
        {schedules.map((schedule, index) => (
          <button
            key={index}
            onClick={() => onSelect(schedule)}
            className="w-full text-left p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {format(new Date(schedule.departureTime), 'HH:mm')} →{' '}
                  {format(new Date(schedule.arrivalTime), 'HH:mm')}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {schedule.transportMode} {schedule.lineNumber}
                </div>
                {schedule.changes > 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {schedule.changes} {schedule.changes === 1 ? 'changement' : 'changements'}
                  </div>
                )}
              </div>
              {schedule.price && (
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {schedule.price.amount}€
                </div>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>
                {Math.round(schedule.duration / 60)} min
              </span>
              {schedule.platforms && (
                <>
                  <span>•</span>
                  <span>
                    Quai {schedule.platforms.departure} → {schedule.platforms.arrival}
                  </span>
                </>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
