import React from 'react';

export type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'all';

interface ChartControlsProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export function ChartControls({ timeRange, onTimeRangeChange }: ChartControlsProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Analyse des Trajets</h2>
      <select 
        className="select select-bordered w-auto"
        value={timeRange}
        onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
      >
        <option value="week">Cette semaine</option>
        <option value="month">Ce mois</option>
        <option value="quarter">Ce trimestre</option>
        <option value="year">Cette année</option>
        <option value="all">Tout</option>
      </select>
    </div>
  );
}
