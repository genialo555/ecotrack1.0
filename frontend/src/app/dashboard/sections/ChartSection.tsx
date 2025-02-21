import React from 'react';
import { JourneyChart } from './JourneyChart';
import { ChartControls, TimeRange } from './ChartControls';

interface Journey {
  id: string;
  created_at: string;
  distance_km: number;
  co2_emissions: number;
  transport_mode: string;
}

interface ChartSectionProps {
  journeys: Journey[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  loading?: boolean;
  error?: string | null;
}

export function ChartSection({ 
  journeys, 
  timeRange, 
  onTimeRangeChange, 
  loading = false, 
  error = null 
}: ChartSectionProps) {
  return (
    <div className="bg-base-200 rounded-lg p-6">
      <ChartControls 
        timeRange={timeRange}
        onTimeRangeChange={onTimeRangeChange}
      />
      
      {loading ? (
        <div className="flex justify-center p-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : (
        <JourneyChart journeys={journeys} />
      )}
    </div>
  );
}
