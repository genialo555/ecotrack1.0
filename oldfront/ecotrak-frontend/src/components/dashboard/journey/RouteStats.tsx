import React, { useEffect, useState } from 'react';
import { FiClock, FiNavigation, FiDroplet, FiTrendingUp } from 'react-icons/fi';

interface RouteStatsProps {
  distance: number;
  duration: number;
  co2Emissions: number;
  fuelConsumption?: number;
  fuelType?: string;
  elevation?: {
    gain: number;
    loss: number;
  };
  trafficLevel?: number;
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours === 0) return `${mins} min`;
  return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
};

export const RouteStats: React.FC<RouteStatsProps> = ({
  distance,
  duration,
  co2Emissions,
  fuelConsumption,
  fuelType,
  elevation,
  trafficLevel
}) => {
  return (
    <div className="route-stats">
      <div className="route-stats__card">
        <div className="route-stats__header">
          <FiNavigation className="route-stats__icon" />
          <span className="route-stats__label">Distance</span>
        </div>
        <div className="route-stats__value">
          {(distance / 1000).toFixed(1)}
          <span className="route-stats__unit">km</span>
        </div>
      </div>

      <div className="route-stats__card">
        <div className="route-stats__header">
          <FiClock className="route-stats__icon" />
          <span className="route-stats__label">Durée</span>
        </div>
        <div className="route-stats__value">
          {formatDuration(duration / 60)}
        </div>
      </div>

      <div className="route-stats__card">
        <div className="route-stats__header">
          <FiDroplet className="route-stats__icon" />
          <span className="route-stats__label">CO2</span>
        </div>
        <div className="route-stats__value">
          {co2Emissions.toFixed(1)}
          <span className="route-stats__unit">kg</span>
        </div>
      </div>

      {elevation && (
        <div className="route-stats__card">
          <div className="route-stats__header">
            <FiTrendingUp className="route-stats__icon" />
            <span className="route-stats__label">Dénivelé</span>
          </div>
          <div className="route-stats__elevation">
            <span className="route-stats__elevation-gain">+{elevation.gain}m</span>
            <span className="route-stats__elevation-separator">/</span>
            <span className="route-stats__elevation-loss">-{elevation.loss}m</span>
          </div>
        </div>
      )}

      {fuelConsumption && fuelType && (
        <div className="route-stats__card">
          <div className="route-stats__header">
            <FiDroplet className="route-stats__icon" />
            <span className="route-stats__label">Consommation</span>
          </div>
          <div className="route-stats__value">
            {fuelConsumption.toFixed(1)}
            <span className="route-stats__unit">{fuelType}</span>
          </div>
        </div>
      )}
    </div>
  );
};
