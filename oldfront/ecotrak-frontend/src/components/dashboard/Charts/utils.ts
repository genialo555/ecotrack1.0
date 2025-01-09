import { Journey } from '@/lib/types/journey';
import { ChartData } from './BaseChart';

export const chartColors = {
  distance: 'rgb(59, 130, 246)', // blue-500
  co2: 'rgb(239, 68, 68)', // red-500
  time: 'rgb(16, 185, 129)', // green-500
};

export function calculateChange(
  current: number,
  previous: number | undefined
): { value: number; isPositive: boolean } {
  if (!previous || previous === 0) {
    return { value: 0, isPositive: false };
  }

  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(change)),
    isPositive: change > 0,
  };
}

export function formatValue(value: number, metric: keyof ChartData): string {
  switch (metric) {
    case 'distance':
      return `${value.toFixed(1)} km`;
    case 'co2':
      return `${value.toFixed(1)} kg`;
    case 'time':
      return `${value.toFixed(0)} min`;
    default:
      return value.toString();
  }
}

export function getChartColor(metric: keyof ChartData): string {
  return chartColors[metric] || chartColors.distance;
}
