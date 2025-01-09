import React from 'react';
import { FaClock, FaLeaf, FaWater, FaCompass } from 'react-icons/fa';

interface RouteDetailsProps {
  routes: google.maps.DirectionsRoute[];
  selectedRouteIndex: number;
  onRouteSelect: (index: number) => void;
  transportMode: string;
}

interface RouteStats {
  distance: string;
  duration: string;
  co2: number;
  fuelConsumption?: number;
}

const calculateRouteStats = (route: google.maps.DirectionsRoute, transportMode: string): RouteStats => {
  const distance = route.legs[0].distance?.text || '0 km';
  const duration = route.legs[0].duration?.text || '0 min';
  const distanceValue = route.legs[0].distance?.value || 0; // en mètres

  // Calculs approximatifs des émissions de CO2 et consommation de carburant
  let co2 = 0;
  let fuelConsumption;

  switch (transportMode) {
    case 'driving':
      co2 = (distanceValue / 1000) * 0.2; // 200g CO2/km en moyenne
      fuelConsumption = (distanceValue / 1000) * 0.07; // 7L/100km en moyenne
      break;
    case 'transit':
      co2 = (distanceValue / 1000) * 0.08; // 80g CO2/km en moyenne
      break;
    case 'bicycling':
    case 'walking':
      co2 = 0;
      break;
    default:
      co2 = 0;
  }

  return {
    distance,
    duration,
    co2,
    fuelConsumption
  };
};

export const RouteDetails: React.FC<RouteDetailsProps> = ({
  routes,
  selectedRouteIndex,
  onRouteSelect,
  transportMode
}) => {
  return (
    <div className="route-details">
      <h3 className="route-details__title">Itinéraires proposés</h3>
      
      <div className="route-details__list">
        {routes.map((route, index) => {
          const stats = calculateRouteStats(route, transportMode);
          const isSelected = index === selectedRouteIndex;

          return (
            <button
              key={index}
              onClick={() => onRouteSelect(index)}
              className={`route-details__option ${
                isSelected
                  ? 'route-details__option--selected'
                  : 'route-details__option--default'
              }`}
            >
              <div className="route-details__header">
                <div className="route-details__main-info">
                  <div className={`route-details__index ${
                    isSelected ? 'route-details__index--selected' : 'route-details__index--default'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="route-details__metrics">
                    <FaCompass className="route-details__icon route-details__icon--compass" size={16} />
                    <span>{stats.distance}</span>
                    <span className="route-details__separator">•</span>
                    <FaClock className="route-details__icon route-details__icon--clock" size={16} />
                    <span>{stats.duration}</span>
                  </div>
                </div>
                
                {route.warnings && route.warnings.length > 0 && (
                  <div className="route-details__warning">
                    {route.warnings[0]}
                  </div>
                )}
              </div>

              <div className="route-details__stats">
                <div className="route-details__stat">
                  <FaLeaf className="route-details__icon route-details__icon--leaf" size={16} />
                  <span className="route-details__stat-label">CO₂:</span>
                  <span className="route-details__stat-value">{stats.co2.toFixed(1)} kg</span>
                </div>

                {stats.fuelConsumption && (
                  <div className="route-details__stat">
                    <FaWater className="route-details__icon route-details__icon--water" size={16} />
                    <span className="route-details__stat-label">Carburant:</span>
                    <span className="route-details__stat-value">
                      {stats.fuelConsumption.toFixed(1)} L
                    </span>
                  </div>
                )}
              </div>

              {route.legs[0].steps && (
                <div className="route-details__steps">
                  <div className="route-details__steps-info">
                    <div className="route-details__steps-dot" />
                    <span>
                      {route.legs[0].steps.length} étapes • Via{' '}
                      {route.legs[0].via_waypoints?.length
                        ? route.legs[0].via_waypoints.length + ' points de passage'
                        : route.summary}
                    </span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
