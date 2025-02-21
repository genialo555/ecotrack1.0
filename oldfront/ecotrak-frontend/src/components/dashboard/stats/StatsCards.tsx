'use client';

import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Journey } from '@/types/journey';
import { MapPin, Route, Timer, Leaf } from 'lucide-react';

interface StatsCardsProps {
  journeys: Journey[];
  loading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  loading?: boolean;
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCards({ journeys, loading = false }: StatsCardsProps) {
  const stats = useMemo(() => {
    if (!journeys.length) {
      return {
        totalDistance: 0,
        totalCO2: 0,
        totalTime: 0,
        uniqueLocations: new Set<string>(),
      };
    }

    return journeys.reduce(
      (acc, journey) => {
        acc.totalDistance += journey.distance_km;
        acc.totalCO2 += journey.co2_kg;
        acc.totalTime += journey.duration_min;
        acc.uniqueLocations.add(journey.start_address);
        acc.uniqueLocations.add(journey.end_address);
        return acc;
      },
      {
        totalDistance: 0,
        totalCO2: 0,
        totalTime: 0,
        uniqueLocations: new Set<string>(),
      }
    );
  }, [journeys]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Distance"
        value={`${stats.totalDistance.toFixed(1)} km`}
        icon={Route}
        description="Distance totale parcourue"
        loading={loading}
      />
      <StatCard
        title="Total CO2"
        value={`${stats.totalCO2.toFixed(1)} kg`}
        icon={Leaf}
        description="Émissions de CO2 totales"
        loading={loading}
      />
      <StatCard
        title="Total Time"
        value={`${Math.round(stats.totalTime)} min`}
        icon={Timer}
        description="Temps total de trajet"
        loading={loading}
      />
      <StatCard
        title="Locations"
        value={`${stats.uniqueLocations.size}`}
        icon={MapPin}
        description="Lieux visités"
        loading={loading}
      />
    </div>
  );
}
