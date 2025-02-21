'use client';

import React, { useState, useEffect } from 'react';
import { WeeklyAreaChart } from '@/components/dashboard/Charts/WeeklyAreaChart';
import { MonthlyBarChart } from '@/components/dashboard/Charts/MonthlyBarChart';
import { YearlyPieChart } from '@/components/dashboard/Charts/YearlyPieChart';
import { ChartControls } from '@/components/dashboard/Charts/ChartControls';
import { ChartMetric, ChartPeriod } from '@/types/chart';
import { ChartSkeleton } from '@/components/dashboard/Charts/ChartSkeleton';
import { ChartError } from '@/components/dashboard/Charts/ChartError';
import { TransportBreakdown } from '@/components/dashboard/Charts/TransportBreakdown';
import { useAuthContext } from '@/components/providers/auth-provider';
import { StatsCards } from '@/components/dashboard/stats/StatsCards';
import { JourneyView, ViewMode } from '@/components/common/views/JourneyView';
import { AddJourneyForm } from '@/components/dashboard/journey/AddJourneyForm';
import { SettingsModal } from '@/components/dashboard/SettingsModal';
import { Journey } from '@/types/journey';
import { CreateJourneyDTO } from '@/types/journey';
import { useTransportModeData } from '@/hooks/useChartData';
import type { ChartData, TransportModeData } from '@/types/chart';

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [view, setView] = React.useState<ChartMetric>('distance');
  const [period, setPeriod] = React.useState<ChartPeriod>('week');
  const [date, setDate] = React.useState(new Date());
  const [isAddJourneyModalOpen, setIsAddJourneyModalOpen] = React.useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');

  const transportModeData = useTransportModeData(journeys, view === 'time' ? 'distance' : view);

  useEffect(() => {
    const fetchJourneys = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/journeys');
        if (!response.ok) {
          throw new Error('Failed to fetch journeys');
        }
        const data: Journey[] = await response.json();
        setJourneys(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchJourneys();
  }, []);

  const handleJourneyCreated = async (data: CreateJourneyDTO) => {
    setLoading(true);
    try {
      const response = await fetch('/api/journeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create journey');
      }
      const newJourney: Journey = await response.json();
      setJourneys(prev => [...prev, newJourney]);
      setIsAddJourneyModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleJourneyDeleted = async (journey: Journey) => {
    try {
      const response = await fetch(`/api/journeys/${journey.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete journey');
      }
      setJourneys(prev => prev.filter(j => j.id !== journey.id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    }
  };

  const renderChart = () => {
    if (loading) {
      return <ChartSkeleton />;
    }

    if (error) {
      return (
        <ChartError
          message="Failed to load journey data. Please try again."
          onRetry={() => setLoading(true)}
        />
      );
    }

    if (!journeys?.length) {
      return (
        <ChartError
          title="No Data Available"
          message="Start adding your journeys to see your environmental impact!"
        />
      );
    }

    const chartData: ChartData[] = journeys.map(journey => {
      const startTime = new Date(journey.start_time);
      return {
        date: startTime.toISOString().split('T')[0],
        distance: journey.distance_km,
        co2: journey.co2_kg,
        time: journey.duration_min,
        mode: journey.transport_mode,
      };
    });

    const totalMetric = journeys.reduce((sum, journey) => {
      switch (view) {
        case 'distance':
          return sum + journey.distance_km;
        case 'co2':
          return sum + journey.co2_kg;
        case 'time':
          return sum + journey.duration_min;
      }
    }, 0);

    const chartDataWithPercentage: TransportModeData[] = chartData.map(data => ({
      ...data,
      percentage: totalMetric > 0 ? (data[view === 'time' ? 'distance' : view] / totalMetric) * 100 : 0,
    }));

    switch (period) {
      case 'week':
        return <WeeklyAreaChart data={chartData} view={view === 'time' ? 'distance' : view} />;
      case 'month':
        return <MonthlyBarChart data={chartData} view={view === 'time' ? 'distance' : view} />;
      case 'year':
        return <YearlyPieChart data={chartDataWithPercentage} view={view === 'time' ? 'distance' : view} />;
      default:
        return null;
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
            className="px-3 py-2 bg-background border rounded-md"
          >
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
          </select>
          <button
            onClick={() => setIsAddJourneyModalOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Add Journey
          </button>
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2 text-muted hover:text-foreground transition-colors"
          >
            <span className="icon icon-settings" />
          </button>
        </div>
      </div>

      <StatsCards journeys={journeys} loading={loading} />

      <div className="grid gap-6 md:grid-cols-2">
        {renderChart()}
        <TransportBreakdown journeys={journeys} view="co2" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Journeys</h2>
          <ChartControls
            view={view}
            period={period}
            date={date}
            onViewChange={setView}
            onPeriodChange={setPeriod}
            onDateChange={(newDate) => newDate && setDate(newDate)}
          />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted/10 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-center text-destructive bg-destructive/10 rounded-lg">
            Error loading journeys: {error.message}
          </div>
        ) : (
          <JourneyView
            journeys={journeys}
            mode={viewMode}
            onDelete={handleJourneyDeleted}
            className="mt-4"
          />
        )}
      </div>

      {isAddJourneyModalOpen && (
        <AddJourneyForm
          onSubmit={(data) => handleJourneyCreated(data as CreateJourneyDTO)}
          onClose={() => setIsAddJourneyModalOpen(false)}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal onClose={() => setIsSettingsModalOpen(false)} />
      )}
    </div>
  );
}
