import { TransportMode } from './journey';

export type ChartMetric = 'distance' | 'co2' | 'time';
export type ChartPeriod = 'week' | 'month' | 'year';

export interface ChartData {
  date: string;
  distance: number;
  co2: number;
  time: number;
  mode: TransportMode;
}

export interface TransportModeData extends ChartData {
  percentage: number;
}
