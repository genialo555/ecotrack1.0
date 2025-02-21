import React from 'react';

interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  location: string;
  timestamp: string;
}

interface AirQualityCardProps {
  data: AirQualityData;
}

const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return 'success';
  if (aqi <= 100) return 'warning';
  return 'error';
};

const getAQILabel = (aqi: number): string => {
  if (aqi <= 50) return 'Bon';
  if (aqi <= 100) return 'Modéré';
  return 'Mauvais';
};

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ data }) => {
  const color = getAQIColor(data.aqi);
  const label = getAQILabel(data.aqi);

  return (
    <div className="card-stats">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="stats-label">Qualité de l'air</h3>
          <span className="icon icon-air text-muted" />
        </div>

        {/* Main Stats */}
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-${color} stats-value`}>
              {data.aqi}
            </div>
            <div className={`text-${color} font-medium`}>
              {label}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted">{data.location}</div>
            <div className="text-sm text-muted">
              {new Date(data.timestamp).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted">PM2.5</div>
            <div className="font-medium">{data.pm25} µg/m³</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted">PM10</div>
            <div className="font-medium">{data.pm10} µg/m³</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted">NO₂</div>
            <div className="font-medium">{data.no2} ppb</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted">O₃</div>
            <div className="font-medium">{data.o3} ppb</div>
          </div>
        </div>
      </div>
    </div>
  );
};
