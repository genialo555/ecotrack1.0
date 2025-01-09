import { ChartPeriod } from '@/types/chart';
import { Journey } from '@/lib/types/journey';
import { fr } from 'date-fns/locale';
import { addDays, addMonths, addWeeks, endOfMonth, endOfWeek, endOfYear, format, startOfMonth, startOfWeek, startOfYear, subDays, subMonths, subWeeks } from 'date-fns';

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Get the date range for a given period and date
 */
export function getDateRangeForPeriod(date: Date, period: ChartPeriod): { start: Date; end: Date } {
  switch (period) {
    case 'week':
      return {
        start: startOfWeek(date, { locale: fr }),
        end: endOfWeek(date, { locale: fr }),
      };
    case 'month':
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
    case 'year':
      return {
        start: startOfYear(date),
        end: endOfYear(date),
      };
  }
}

/**
 * Format a date range based on the chart period
 */
export function formatDateRange(start: Date, end: Date, period: ChartPeriod): string {
  switch (period) {
    case 'week':
      return `${format(start, 'dd')} - ${format(end, 'dd MMMM yyyy', { locale: fr })}`;
    case 'month':
      return format(start, 'MMMM yyyy', { locale: fr });
    case 'year':
      return format(start, 'yyyy');
  }
}

/**
 * Get an array of dates for a given period and range
 */
export function getIntervals(period: ChartPeriod, range: DateRange): Date[] {
  const dates: Date[] = [];
  let current = new Date(range.start);

  while (current <= range.end) {
    dates.push(new Date(current));
    switch (period) {
      case 'week':
        current.setDate(current.getDate() + 1);
        break;
      case 'month':
        current.setDate(current.getDate() + 7);
        break;
      case 'year':
        current.setMonth(current.getMonth() + 1);
        break;
    }
  }

  return dates;
}

/**
 * Get the previous period for a given date and period
 */
export function getPreviousPeriod(date: Date, period: ChartPeriod): Date {
  switch (period) {
    case 'week':
      return subWeeks(date, 1);
    case 'month':
      return subMonths(date, 1);
    case 'year':
      return subMonths(date, 12);
  }
}

/**
 * Get the next period for a given date and period
 */
export function getNextPeriod(date: Date, period: ChartPeriod): Date {
  switch (period) {
    case 'week':
      return addWeeks(date, 1);
    case 'month':
      return addMonths(date, 1);
    case 'year':
      return addMonths(date, 12);
  }
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return format(date, 'PPP', { locale: fr });
}

/**
 * Format a date for short display
 */
export function formatShortDate(date: Date): string {
  return format(date, 'P', { locale: fr });
}

/**
 * Format a time for display
 */
export function formatTime(date: Date): string {
  return format(date, 'p', { locale: fr });
}

/**
 * Format a date and time for display
 */
export function formatDateTime(date: Date): string {
  return format(date, 'Pp', { locale: fr });
}

/**
 * Get a date relative to the current date
 */
export function getRelativeDays(days: number): Date {
  if (days < 0) {
    return subDays(new Date(), Math.abs(days));
  }
  return addDays(new Date(), days);
}

/**
 * Check if a journey falls within a given interval
 */
export function isJourneyInInterval(
  journey: Journey,
  interval: Date,
  period: ChartPeriod
): boolean {
  const journeyDate = new Date(journey.start_time);
  
  switch (period) {
    case 'week':
      return journeyDate.toDateString() === interval.toDateString();
    case 'month': {
      const weekStart = startOfWeek(interval, { locale: fr });
      const weekEnd = endOfWeek(interval, { locale: fr });
      return journeyDate >= weekStart && journeyDate <= weekEnd;
    }
    case 'year': {
      const monthStart = startOfMonth(interval);
      const monthEnd = endOfMonth(interval);
      return journeyDate >= monthStart && journeyDate <= monthEnd;
    }
  }
}

/**
 * Format a date relative to now
 */
export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'à l\'instant';
  if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} minutes`;
  if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} heures`;
  return `il y a ${Math.floor(diffInSeconds / 86400)} jours`;
}

/**
 * Parse a date string safely
 */
export function parseDate(date: string | Date | null): Date | null {
  if (!date) return null;
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed;
}
