import React from 'react';
import { Journey } from '@/types/journey';
import { Card } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils/date';
import { TRANSPORT_MODE_LABELS } from '@/types/journey';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface GridViewProps {
  journeys: Journey[];
  onDelete: (journey: Journey) => Promise<void>;
  onEdit?: (journey: Journey) => void;
  className?: string;
}

export function GridView({ journeys, onDelete, onEdit, className }: GridViewProps) {
  return (
    <div className={`journey-table__grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className || ''}`}>
      {journeys.map((journey) => (
        <Card key={journey.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold">
                {journey.title || `${journey.start_address} → ${journey.end_address}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(new Date(journey.start_time))}
              </p>
            </div>
            <div className="journey-table__grid-actions">
              {onEdit && (
                <button
                  onClick={() => onEdit(journey)}
                  className="journey-table__action"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => onDelete(journey)}
                className="text-destructive hover:text-destructive/80 transition-colors"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Mode:</span>{' '}
              {TRANSPORT_MODE_LABELS[journey.transport_mode]}
            </p>
            <p className="text-sm">
              <span className="font-medium">Distance:</span> {journey.distance_km.toFixed(1)} km
            </p>
            <p className="text-sm">
              <span className="font-medium">CO₂:</span> {journey.co2_kg.toFixed(1)} kg
            </p>
            {journey.duration_min > 0 && (
              <p className="text-sm">
                <span className="font-medium">Duration:</span>{' '}
                {Math.round(journey.duration_min)} min
              </p>
            )}
            {journey.notes && (
              <p className="text-sm mt-2 text-muted-foreground">{journey.notes}</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
