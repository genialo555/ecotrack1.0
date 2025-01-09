'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer } from 'recharts';
import type { ChartData, ChartMetric } from '@/types/chart';
import { Journey } from '@/types/journey';

export interface ChartConfig {
  label: string;
  color: {
    base: string;
    fill?: string;
    increase?: string;
    decrease?: string;
  };
  formatter: (value: number) => string;
}

export const metricConfigs: Record<ChartMetric, ChartConfig> = {
  distance: {
    label: 'Distance (km)',
    color: {
      base: 'hsl(var(--chart-distance-base))',
      fill: 'hsl(var(--chart-distance-base) / 0.2)',
      increase: 'hsl(var(--chart-distance-increase))',
      decrease: 'hsl(var(--chart-distance-decrease))',
    },
    formatter: (value: number) => `${value.toFixed(1)} km`,
  },
  co2: {
    label: 'CO2 Emissions (kg)',
    color: {
      base: 'hsl(var(--chart-co2-base))',
      fill: 'hsl(var(--chart-co2-base) / 0.2)',
      increase: 'hsl(var(--chart-co2-increase))',
      decrease: 'hsl(var(--chart-co2-decrease))',
    },
    formatter: (value: number) => `${value.toFixed(1)} kg`,
  },
  time: {
    label: 'Time (minutes)',
    color: {
      base: 'hsl(var(--chart-time-base))',
      fill: 'hsl(var(--chart-time-base) / 0.2)',
      increase: 'hsl(var(--chart-time-increase))',
      decrease: 'hsl(var(--chart-time-decrease))',
    },
    formatter: (value: number) => `${Math.round(value)} min`,
  },
};

export interface BaseChartProps {
  title: string;
  description?: string;
  data: ChartData[];
  view: ChartMetric;
  height?: number;
  children: React.ReactElement;
}

export function BaseChart({ 
  title, 
  description, 
  data, 
  view, 
  height = 300,
  children 
}: BaseChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function useChartConfig(view: ChartMetric): ChartConfig {
  return metricConfigs[view];
}

export const defaultChartMargin = {
  top: 5,
  right: 10,
  left: 10,
  bottom: 20,
};
