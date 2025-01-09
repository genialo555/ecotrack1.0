import React, { useEffect, useState } from 'react';
import { FaCar, FaClock, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { FrequentJourney } from '@/lib/types/journey';

interface FrequentJourneysProps {
  journeys: FrequentJourney[];
  onSelect: (journey: FrequentJourney) => void;
  loading?: boolean;
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours === 0) return `${mins} min`;
  return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
};

export const FrequentJourneys: React.FC<FrequentJourneysProps> = ({
  journeys,
  onSelect,
  loading = false
}) => {
  // Sort journeys by frequency
  const sortedJourneys = [...journeys].sort((a, b) => b.stats.total_count - a.stats.total_count);

  if (loading) {
    return (
      <div className="frequent-journeys">
        <div className="frequent-journeys__loading">
          <div className="frequent-journeys__loading-title"></div>
          <div className="frequent-journeys__loading-grid">
            {[1, 2].map((i) => (
              <div key={i} className="frequent-journeys__loading-item"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="frequent-journeys">
      <div className="frequent-journeys__header">
        <h3 className="frequent-journeys__title">
          Trajets fréquents
        </h3>
        <div className="frequent-journeys__count">
          {journeys.length} trajet{journeys.length > 1 ? 's' : ''} enregistré{journeys.length > 1 ? 's' : ''}
        </div>
      </div>

      {sortedJourneys.length > 0 ? (
        <div className="frequent-journeys__grid">
          {sortedJourneys.map((journey) => (
            <button
              key={journey.id}
              onClick={() => onSelect(journey)}
              className="frequent-journeys__card"
            >
              <div className="frequent-journeys__card-header">
                <div>
                  <div className="frequent-journeys__card-title">
                    {journey.start_location} - {journey.end_location}
                    {journey.stats.total_count >= 10 && (
                      <FaStar className="frequent-journeys__star" />
                    )}
                  </div>
                  <div className="frequent-journeys__meta">
                    <div className="frequent-journeys__meta-item">
                      <FaClock className="frequent-journeys__meta-icon" />
                      {journey.stats.total_count} trajet{journey.stats.total_count > 1 ? 's' : ''}
                    </div>
                    {journey.vehicle && (
                      <div className="frequent-journeys__meta-item">
                        <FaCar className="frequent-journeys__meta-icon" />
                        {journey.vehicle.brand} {journey.vehicle.model}
                      </div>
                    )}
                    <div className="frequent-journeys__last-used">
                      Dernier trajet le{' '}
                      {new Date(journey.stats.last_used).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="frequent-journeys__route">
                <div className="frequent-journeys__location frequent-journeys__location--start">
                  <FaMapMarkerAlt className="frequent-journeys__location-icon" />
                  <span>{journey.start_location}</span>
                </div>
                {journey.route_data?.waypoints && journey.route_data.waypoints.length > 0 && (
                  <div className="frequent-journeys__waypoints">
                    {journey.route_data.waypoints.length} étape{journey.route_data.waypoints.length > 1 ? 's' : ''} intermédiaire{journey.route_data.waypoints.length > 1 ? 's' : ''}
                  </div>
                )}
                <div className="frequent-journeys__location frequent-journeys__location--end">
                  <FaMapMarkerAlt className="frequent-journeys__location-icon" />
                  <span>{journey.end_location}</span>
                </div>
              </div>

              <div className="frequent-journeys__stats">
                <div className="frequent-journeys__stat">
                  <div className="frequent-journeys__stat-label">Distance</div>
                  <div className="frequent-journeys__stat-value">
                    {journey.stats.avg_distance.toFixed(1)} km
                  </div>
                </div>
                <div className="frequent-journeys__stat">
                  <div className="frequent-journeys__stat-label">Durée</div>
                  <div className="frequent-journeys__stat-value">
                    {formatDuration(journey.stats.avg_duration)}
                  </div>
                </div>
                <div className="frequent-journeys__stat">
                  <div className="frequent-journeys__stat-label">CO₂</div>
                  <div className="frequent-journeys__stat-value">
                    {journey.stats.avg_co2.toFixed(1)} kg
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="frequent-journeys__empty">
          Vos trajets fréquents apparaîtront ici
        </div>
      )}
    </div>
  );
};
