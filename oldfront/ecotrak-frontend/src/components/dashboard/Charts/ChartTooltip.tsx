'use client';

import React from 'react';
import { ChartData } from './BaseChart';
import { ChartMetric } from './ChartControls';
import { calculateChange, formatValue } from './utils';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ChartData;
  }>;
  label?: string;
  view: ChartMetric;
}

export function ChartTooltip({ active, payload, label, view }: ChartTooltipProps) {
  if (!active || !payload || !payload[0]) {
    return null;
  }

  const currentValue = payload[0].value;
  const previousValue = payload[0].payload[view];
  const { value: changeValue, isPositive } = calculateChange(currentValue, previousValue);

  return (
    <div className="rounded-lg border bg-background p-3 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium">{label}</div>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">
            {formatValue(currentValue, view)}
          </div>
          {previousValue !== undefined && (
            <div
              className={`flex items-center gap-1 text-sm ${
                isPositive
                  ? 'text-destructive'
                  : changeValue < 0
                  ? 'text-success'
                  : 'text-muted-foreground'
              }`}
            >
              {isPositive ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : changeValue < 0 ? (
                <ArrowDownIcon className="h-4 w-4" />
              ) : (
                <MinusIcon className="h-4 w-4" />
              )}
              <span>{Math.abs(changeValue).toFixed(1)}%</span>
            </div>
          )}
        </div>
        {previousValue !== undefined && (
          <div className="text-sm text-muted-foreground">
            Previous: {formatValue(previousValue, view)}
          </div>
        )}
      </div>
    </div>
  );
}
