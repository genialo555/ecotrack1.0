import React from 'react';

interface CO2BadgeProps {
  value: number;
}

export const CO2Badge: React.FC<CO2BadgeProps> = ({ value }) => {
  // Determine badge color based on CO2 value
  const getBadgeColor = (co2: number): string => {
    if (co2 <= 1) return 'success';
    if (co2 <= 5) return 'warning';
    return 'error';
  };

  const color = getBadgeColor(value);

  return (
    <div className={`badge badge-${color} gap-1 font-medium`}>
      <span className="icon icon-co2 text-current" />
      {value.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} kg
    </div>
  );
};
