'use client';

import React from 'react';
import { ChartMetric, ChartPeriod } from '@/types/chart';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { fr } from 'date-fns/locale';

interface ChartControlsProps {
  view: ChartMetric;
  period: ChartPeriod;
  date: Date;
  onViewChange: (view: ChartMetric) => void;
  onPeriodChange: (period: ChartPeriod) => void;
  onDateChange: (date: Date | undefined) => void;
}

const VIEWS: { value: ChartMetric; label: string }[] = [
  { value: 'distance', label: 'Distance' },
  { value: 'co2', label: 'CO₂' },
  { value: 'time', label: 'Time' },
];

const PERIODS: { value: ChartPeriod; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

export function ChartControls({
  view,
  period,
  date,
  onViewChange,
  onPeriodChange,
  onDateChange,
}: ChartControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-md border p-1">
        {VIEWS.map((v) => (
          <Button
            key={v.value}
            variant={view === v.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange(v.value)}
          >
            {v.label}
          </Button>
        ))}
      </div>

      <div className="flex items-center rounded-md border p-1">
        {PERIODS.map((p) => (
          <Button
            key={p.value}
            variant={period === p.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPeriodChange(p.value)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP', { locale: fr }) : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
