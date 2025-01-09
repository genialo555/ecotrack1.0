import { useMemo } from 'react';
import { Journey, TransportMode, TransportModeStats } from '@/lib/types/journey';
import { ChartData } from '@/components/dashboard/Charts/BaseChart';
import { ChartPeriod } from '@/components/dashboard/Charts/ChartControls';
import {
  getDateRange,
  getIntervals,
  formatChartDate,
  isJourneyInInterval,
} from '@/lib/utils/date';

export interface JourneyStats {
  // Overall stats
  totalDistance: number;
  totalCO2: number;
  totalTime: number;
  totalJourneys: number;
  averageDistance: number;
  averageCO2: number;
  averageTime: number;

  // Transport mode breakdown
  transportModes: TransportModeStats[];

  // Time series data
  chartData: ChartData[];
}

interface UseJourneyStatsProps {
  journeys: Journey[];
  period: ChartPeriod;
  date: Date;
}

export function useJourneyStats({ journeys, period, date }: UseJourneyStatsProps): JourneyStats {
  return useMemo(() => {
    try {
      // Calculate overall stats
      const stats = journeys.reduce(
        (acc, journey) => ({
          totalDistance: acc.totalDistance + Number(journey.distance_km),
          totalCO2: acc.totalCO2 + Number(journey.co2_emissions),
          totalTime: acc.totalTime + Number(journey.duration_min),
          totalJourneys: acc.totalJourneys + 1,
        }),
        { totalDistance: 0, totalCO2: 0, totalTime: 0, totalJourneys: 0 }
      );

      // Calculate averages
      const averageDistance = stats.totalJourneys > 0 ? stats.totalDistance / stats.totalJourneys : 0;
      const averageCO2 = stats.totalJourneys > 0 ? stats.totalCO2 / stats.totalJourneys : 0;
      const averageTime = stats.totalJourneys > 0 ? stats.totalTime / stats.totalJourneys : 0;

      // Calculate transport mode stats
      const modeStats = new Map<TransportMode, TransportModeStats>();
      ['car', 'train', 'bus', 'bike', 'walk'].forEach((mode) => {
        modeStats.set(mode as TransportMode, {
          mode: mode as TransportMode,
          distance: 0,
          co2: 0,
          time: 0,
          count: 0,
        });
      });

      journeys.forEach((journey) => {
        const mode = modeStats.get(journey.transport_mode);
        if (mode) {
          mode.distance += Number(journey.distance_km);
          mode.co2 += Number(journey.co2_emissions);
          mode.time += Number(journey.duration_min);
          mode.count += 1;
        }
      });

      // Calculate chart data
      const range = getDateRange(period, date);
      const intervals = getIntervals(range, period);
      const chartData: ChartData[] = intervals.map((date) => ({
        day: formatChartDate(period, date),
        distance: 0,
        co2: 0,
        time: 0,
      }));

      journeys.forEach((journey) => {
        const index = intervals.findIndex((interval) =>
          isJourneyInInterval(journey, interval, period)
        );

        if (index !== -1) {
          chartData[index].distance = (chartData[index].distance || 0) + Number(journey.distance_km);
          chartData[index].co2 = (chartData[index].co2 || 0) + Number(journey.co2_emissions);
          chartData[index].time = (chartData[index].time || 0) + Number(journey.duration_min);
        }
      });

      return {
        ...stats,
        averageDistance,
        averageCO2,
        averageTime,
        transportModes: Array.from(modeStats.values()).sort((a, b) => b.distance - a.distance),
        chartData,
      };
    } catch (error) {
      console.error('Error calculating journey stats:', error);
      return {
        totalDistance: 0,
        totalCO2: 0,
        totalTime: 0,
        totalJourneys: 0,
        averageDistance: 0,
        averageCO2: 0,
        averageTime: 0,
        transportModes: [],
        chartData: [],
      };
    }
  }, [journeys, period, date]);
}
