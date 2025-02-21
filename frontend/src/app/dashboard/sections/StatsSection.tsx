import React from 'react';

interface StatsProps {
  totalDistance: number;
  totalCO2: number;
  totalTrips: number;
}

export function StatsSection({ totalDistance, totalCO2, totalTrips }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="stats bg-base-200 rounded-lg p-4">
        <div className="stat-title">Distance Totale</div>
        <div className="stat-value">{totalDistance.toFixed(1)} km</div>
      </div>
      <div className="stats bg-base-200 rounded-lg p-4">
        <div className="stat-title">CO₂ Total</div>
        <div className="stat-value">{totalCO2.toFixed(1)} kg</div>
      </div>
      <div className="stats bg-base-200 rounded-lg p-4">
        <div className="stat-title">Nombre de Trajets</div>
        <div className="stat-value">{totalTrips}</div>
      </div>
    </div>
  );
}
