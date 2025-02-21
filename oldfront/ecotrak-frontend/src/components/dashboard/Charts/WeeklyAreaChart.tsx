'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  BaseChart,
  useChartConfig,
  defaultChartMargin
} from './BaseChart';
import { ChartData, ChartMetric } from '@/types/chart';

interface WeeklyChartProps {
  data: ChartData[];
  view: ChartMetric;
}

export function WeeklyAreaChart({ data, view }: WeeklyChartProps) {
  const config = useChartConfig(view);
  
  return (
    <BaseChart
      title={`Weekly ${config.label}`}
      description="Trends over the past week"
      data={data}
      view={view}
    >
      <AreaChart
        data={data}
        margin={defaultChartMargin}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          className="stroke-[hsl(var(--chart-grid))]" 
        />
        <XAxis
          dataKey="date"
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
          tickFormatter={config.formatter}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) {
              return null;
            }

            const value = payload[0].value as number;

            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      {payload[0].payload.date}
                    </span>
                    <span className="font-bold text-muted-foreground">
                      {config.formatter(value)}
                    </span>
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey={view}
          stroke={config.color.base}
          fill={config.color.fill}
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </BaseChart>
  );
}
