import React from 'react';
import { Journey } from '@/lib/types';
import { CO2Badge } from './CO2Badge';

interface JourneyItemProps {
  journey: Journey;
}

export const JourneyItem: React.FC<JourneyItemProps> = React.memo(({ journey }) => {
  const co2 = Number(journey.co2_emissions);
  const journeyDate = journey.start_time instanceof Date 
    ? journey.start_time 
    : new Date(journey.start_time);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-success/20 to-success/10 border border-success/30 hover:from-success/30 hover:to-success/20 transition-all duration-200 shadow-lg hover:shadow-xl">
      <div>
        <div className="text-xs text-success-content/70">
          {journeyDate.toLocaleDateString('fr-FR')}
        </div>
        <div className="text-sm text-success-content/90 font-medium mt-1">
          {journey.start_location} → {journey.end_location}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-success-content">
          {Number(journey.distance_km).toFixed(1)} km
        </span>
        <CO2Badge value={isNaN(co2) ? 0 : co2} />
      </div>
    </div>
  );
});
