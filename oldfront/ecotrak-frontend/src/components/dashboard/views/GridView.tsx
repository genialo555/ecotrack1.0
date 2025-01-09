import React from 'react';
import { Journey } from '@/lib/types/journey';
import { formatDisplayDate, formatDistance, formatDuration, formatCO2 } from '@/lib/utils';

interface GridViewProps {
  journeys: Journey[];
  onEdit: (journey: Journey) => void;
  onDelete: (journey: Journey) => void;
}

export const GridView: React.FC<GridViewProps> = ({ 
  journeys,
  onEdit,
  onDelete
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {journeys.map((journey, index) => (
        <div
          key={journey.id || index}
          className="group bg-background rounded-lg border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="bg-primary/10 p-2 rounded-lg">
                <span className="icon icon-route text-primary" />
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(journey)}
                  className="text-muted hover:text-primary"
                >
                  <span className="icon icon-edit" />
                </button>
                <button
                  onClick={() => onDelete(journey)}
                  className="text-muted hover:text-destructive"
                >
                  <span className="icon icon-trash" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="icon icon-map-pin text-primary" />
                  <span className="font-medium truncate">{journey.start_location || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="icon icon-map-pin text-secondary" />
                  <span className="font-medium truncate">{journey.end_location || '-'}</span>
                </div>
              </div>

              <div className="text-sm text-muted">
                {formatDisplayDate(journey.start_time)}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <div className="text-sm text-muted">Distance</div>
                <div className="font-medium mt-1">{formatDistance(journey.distance_km)}</div>
              </div>
              <div>
                <div className="text-sm text-muted">CO₂</div>
                <div className="font-medium mt-1">{formatCO2(journey.co2_emissions)}</div>
              </div>
              <div>
                <div className="text-sm text-muted">Durée</div>
                <div className="font-medium mt-1">{formatDuration(journey.start_time, journey.end_time)}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
