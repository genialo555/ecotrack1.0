'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDisplayDate, formatRelativeDate } from '@/lib/utils/date';
import { Journey } from '@/types/journey';

interface LastJourneysProps {
  journeys: Journey[];
}

const transportIcons: Record<string, string> = {
  'car': '🚗',
  'bus': '🚌',
  'train': '🚂',
  'bike': '🚲',
  'walk': '🚶',
};

const getJourneyStatus = (journey: Journey) => {
  const now = new Date();
  const journeyDate = formatDisplayDate(journey.date);
  const relativeDate = formatRelativeDate(journey.date);

  if (now < new Date(journeyDate)) return 'planned';
  if (now.toDateString() === new Date(journeyDate).toDateString()) return 'in-progress';
  return 'completed';
};

const statusStyles: Record<string, { color: string; label: string }> = {
  'completed': { color: 'bg-green-500/10 text-green-500', label: 'Terminé' },
  'in-progress': { color: 'bg-blue-500/10 text-blue-500', label: 'En cours' },
  'planned': { color: 'bg-orange-500/10 text-orange-500', label: 'Planifié' },
};

export function LastJourneys({ journeys }: LastJourneysProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Derniers Trajets</CardTitle>
        <CardDescription>
          Vos trajets les plus récents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {journeys.map((journey) => {
              const status = getJourneyStatus(journey);
              const formattedDate = formatDisplayDate(journey.date);
              
              return (
                <div key={journey.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10">
                      {transportIcons[journey.transport_mode] || '🚗'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {journey.start_address} → {journey.end_address}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formattedDate}</span>
                      <span>•</span>
                      <span>{journey.distance_km.toFixed(1)} km</span>
                      <span>•</span>
                      <span>{journey.duration_min} min</span>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "rounded-sm px-1 py-0 text-xs", 
                        statusStyles[status].color
                      )}
                    >
                      {statusStyles[status].label}
                    </Badge>
                    <Badge variant="outline" className="rounded-sm">
                      {journey.co2_kg.toFixed(1)} kg CO₂
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
