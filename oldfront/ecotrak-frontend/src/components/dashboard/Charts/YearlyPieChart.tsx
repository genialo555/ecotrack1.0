'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from 'recharts';
import {
  BaseChart,
  useChartConfig,
  defaultChartMargin
} from './BaseChart';
import { ChartMetric, TransportModeData } from '@/types/chart';
import { TRANSPORT_MODE_LABELS } from '@/types/journey';

interface YearlyPieChartProps {
  data: TransportModeData[];
  view: ChartMetric;
}

export function YearlyPieChart({ data, view }: YearlyPieChartProps) {
  const config = useChartConfig(view);
  
  return (
    <BaseChart
      title={`Yearly ${config.label} by Transport Mode`}
      description="Distribution across different transport modes"
      data={data}
      view={view}
    >
      <PieChart margin={defaultChartMargin}>
        <Pie
          data={data}
          dataKey={view}
          nameKey="mode"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`}
              fill={`hsl(var(--chart-${entry.mode}))`}
            />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) {
              return null;
            }

            const data = payload[0].payload as TransportModeData;

            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid gap-2">
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      {TRANSPORT_MODE_LABELS[data.mode]}
                    </span>
                    <span className="font-bold text-muted-foreground">
                      {config.formatter(data[view])}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {data.percentage.toFixed(1)}% of total
                    </span>
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value: string) => TRANSPORT_MODE_LABELS[value as keyof typeof TRANSPORT_MODE_LABELS]}
        />
      </PieChart>
    </BaseChart>
  );
}
