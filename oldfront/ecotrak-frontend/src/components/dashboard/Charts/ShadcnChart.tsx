'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartProps {
  data: Array<{
    day: string;
    distance?: number;
    co2?: number;
    time?: number;
  }>;
  view: 'distance' | 'co2' | 'time';
  period: 'week' | 'month' | 'year';
}

const metricConfig = {
  distance: {
    label: 'Distance (km)',
    color: {
      base: 'hsl(var(--chart-distance-base))',
      increase: 'hsl(var(--chart-distance-increase))',
      decrease: 'hsl(var(--chart-distance-decrease))'
    },
    formatter: (value: number) => `${value.toFixed(1)} km`,
  },
  co2: {
    label: 'CO2 Emissions (kg)',
    color: {
      base: 'hsl(var(--chart-co2-base))',
      increase: 'hsl(var(--chart-co2-increase))',
      decrease: 'hsl(var(--chart-co2-decrease))'
    },
    formatter: (value: number) => `${value.toFixed(1)} kg`,
  },
  time: {
    label: 'Time (minutes)',
    color: {
      base: 'hsl(var(--chart-time-base))',
      increase: 'hsl(var(--chart-time-increase))',
      decrease: 'hsl(var(--chart-time-decrease))'
    },
    formatter: (value: number) => `${Math.round(value)} min`,
  },
};

export function ShadcnChart({ data, view, period }: ChartProps) {
  const config = metricConfig[view];
  
  // Calculate trend colors based on data changes
  const getTrendColor = (currentData: typeof data) => {
    if (currentData.length < 2) return config.color.base;
    
    const lastTwo = currentData.slice(-2);
    const change = lastTwo[1][view] - lastTwo[0][view];
    
    // For CO2, increase is bad (red), decrease is good (green)
    if (view === 'co2') {
      return change > 0 ? config.color.increase : config.color.decrease;
    }
    // For distance and time, increase is good (green), decrease is warning (orange)
    return change > 0 ? config.color.increase : config.color.decrease;
  };

  const lineColor = getTrendColor(data);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          {config.label} - {period.charAt(0).toUpperCase() + period.slice(1)}ly View
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-[hsl(var(--chart-grid))]" 
              />
              <XAxis
                dataKey="day"
                stroke="currentColor"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="currentColor"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const currentValue = payload[0].value as number;
                    const previousValue = data[payload[0].payload.index - 1]?.[view] ?? currentValue;
                    const change = currentValue - previousValue;
                    const changeText = change === 0 ? 'No change' : 
                      `${change > 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(1)} ${view === 'time' ? 'min' : view === 'co2' ? 'kg' : 'km'}`;
                    
                    const getChangeColorClass = () => {
                      if (view === 'co2') {
                        return change > 0 
                          ? 'text-[hsl(var(--chart-co2-increase))]'
                          : 'text-[hsl(var(--chart-co2-decrease))]';
                      }
                      return change > 0
                        ? 'text-[hsl(var(--chart-' + view + '-increase))]'
                        : 'text-[hsl(var(--chart-' + view + '-decrease))]';
                    };

                    return (
                      <div className="chart-tooltip">
                        <div className="grid gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase opacity-70">
                              {payload[0].payload.day}
                            </span>
                            <span className="font-bold">
                              {config.formatter(currentValue)}
                            </span>
                            <span className={`text-sm ${getChangeColorClass()}`}>
                              {changeText}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey={view}
                stroke={lineColor}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  style: { fill: lineColor },
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
