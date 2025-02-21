import React from 'react';
import { Journey } from '@/lib/types/journey';
import { formatDisplayDate, formatDistance, formatDuration, formatCO2 } from '@/lib/utils';

interface ListViewProps {
  journeys: Journey[];
  onEdit: (journey: Journey) => void;
  onDelete: (journey: Journey) => void;
}

export const ListView: React.FC<ListViewProps> = ({ 
  journeys,
  onEdit,
  onDelete
}) => {
  return (
    <div className="divide-y divide-border">
      {journeys.map((journey, index) => (
        <div 
          key={journey.id || index}
          className="group p-4 hover:bg-muted/5"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <span className="icon icon-route text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium truncate">
                    {journey.start_location || '-'} → {journey.end_location || '-'}
                  </h3>
                  <p className="text-sm text-muted truncate">
                    {formatDisplayDate(journey.start_time)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="font-medium">{formatDistance(journey.distance_km)}</div>
                <div className="text-sm text-muted">{formatDuration(journey.start_time, journey.end_time)}</div>
              </div>
              
              <div className="text-right">
                <div className="font-medium">{formatCO2(journey.co2_emissions)}</div>
                <div className="text-sm text-muted">CO₂</div>
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
          </div>
        </div>
      ))}
    </div>
  );
};
