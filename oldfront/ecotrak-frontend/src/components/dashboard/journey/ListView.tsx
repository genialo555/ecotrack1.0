import React from 'react';
import { Journey } from '@/types/journey';
import { formatDateTime } from '@/lib/utils/date';
import { TRANSPORT_MODE_LABELS } from '@/types/journey';
import { FiTrash2 } from 'react-icons/fi';

interface ListViewProps {
  journeys: Journey[];
  onDelete: (journey: Journey) => Promise<void>;
  className?: string;
}

export function ListView({ journeys, onDelete, className }: ListViewProps) {
  return (
    <div className={`space-y-4 ${className || ''}`}>
      {journeys.map((journey) => (
        <div
          key={journey.id}
          className="flex items-center justify-between p-4 bg-card rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">
              {journey.title || `${journey.start_address} → ${journey.end_address}`}
            </h3>
            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
              <p className="text-sm text-muted-foreground">
                {formatDateTime(new Date(journey.start_time))}
              </p>
              <p className="text-sm">
                {TRANSPORT_MODE_LABELS[journey.transport_mode]}
              </p>
              <p className="text-sm">{journey.distance_km.toFixed(1)} km</p>
              <p className="text-sm">{journey.co2_kg.toFixed(1)} kg CO₂</p>
              {journey.duration_min > 0 && (
                <p className="text-sm">{Math.round(journey.duration_min)} min</p>
              )}
            </div>
            {journey.notes && (
              <p className="text-sm mt-2 text-muted-foreground truncate">
                {journey.notes}
              </p>
            )}
          </div>
          <button
            onClick={() => onDelete(journey)}
            className="ml-4 text-destructive hover:text-destructive/80 transition-colors"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}
