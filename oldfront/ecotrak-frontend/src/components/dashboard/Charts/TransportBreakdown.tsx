'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Journey } from '@/types/journey';
import { useTransportModeData } from '@/hooks/useChartData';
import { ChartMetric, metricConfigs } from './BaseChart';

interface TransportBreakdownProps {
  journeys: Journey[];
  view: ChartMetric;
}

const transportIcons: Record<string, string> = {
  'car': '🚗',
  'train': '🚂',
  'bus': '🚌',
  'bike': '🚲',
  'walk': '🚶',
};

export function TransportBreakdown({ journeys, view }: TransportBreakdownProps) {
  const transportData = useTransportModeData(journeys);
  const config = metricConfigs[view];

  // Calculate totals and percentages
  const total = React.useMemo(() => {
    return transportData.reduce((acc, item) => acc + item[view], 0);
  }, [transportData, view]);

  // Sort by value descending
  const sortedData = React.useMemo(() => {
    return [...transportData].sort((a, b) => b[view] - a[view]);
  }, [transportData, view]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Transport Mode Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedData.map((item) => {
            const percentage = (item[view] / total) * 100;
            return (
              <div key={item.mode} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {transportIcons[item.mode.toLowerCase()] || '🚗'}
                    </span>
                    <span>{item.mode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {config.formatter(item[view])}
                    </span>
                    <span className="text-muted-foreground">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <Progress
                  value={percentage}
                  className="h-2"
                  indicatorClassName={
                    percentage > 50
                      ? "bg-primary"
                      : percentage > 25
                      ? "bg-primary/80"
                      : "bg-primary/60"
                  }
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
