'use client';

import React from 'react';
import {
  BarChart,
  Bar,
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

interface MonthlyChartProps {
  data: ChartData[];
  view: ChartMetric;
}

export function MonthlyBarChart({ data, view }: MonthlyChartProps) {
  const config = useChartConfig(view);
  
  return (
    <BaseChart
      title={`Monthly ${config.label}`}
      description="Trends over the past month"
      data={data}
      view={view}
    >
      <BarChart
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
        <Bar
          dataKey={view}
          fill={config.color.base}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </BaseChart>
  );
}
