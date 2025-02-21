import { useMemo } from 'react';
import { Journey, TransportMode } from '@/types/journey';

interface TransportModeStats {
  mode: TransportMode;
  distance: number;
  co2: number;
  time: number;
  count: number;
}

export function useTransportModeData(journeys: Journey[], view: 'distance' | 'co2' | 'time'): TransportModeStats[] {
  return useMemo(() => {
    const stats = Object.values(TransportMode).reduce((acc, mode) => {
      acc[mode] = {
        mode,
        distance: 0,
        co2: 0,
        time: 0,
        count: 0,
      };
      return acc;
    }, {} as Record<TransportMode, TransportModeStats>);

    journeys.forEach((journey) => {
      const stat = stats[journey.transport_mode];
      if (stat) {
        stat.distance += journey.distance_km;
        stat.co2 += journey.co2_kg;
        stat.time += journey.duration_min;
        stat.count += 1;
      }
    });

    const total = Object.values(stats).reduce((sum, stat) => sum + stat[view], 0);

    return Object.values(stats)
      .filter((stat) => stat[view] > 0)
      .map((stat) => ({
        ...stat,
        percentage: total > 0 ? (stat[view] / total) * 100 : 0,
      }))
      .sort((a, b) => b[view] - a[view]);
  }, [journeys, view]);
}
