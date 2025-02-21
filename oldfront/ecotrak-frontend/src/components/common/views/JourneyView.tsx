'use client';

import React from 'react';
import { Journey } from '@/types/journey';
import { GridView } from '@/components/dashboard/journey/GridView';
import { ListView } from '@/components/dashboard/journey/ListView';
import { formatDateTime } from '@/lib/utils/date';

export type ViewMode = 'grid' | 'list';

interface JourneyViewProps {
  journeys: Journey[];
  mode?: ViewMode;
  onDelete: (journey: Journey) => Promise<void>;
  className?: string;
}

export function JourneyView({
  journeys,
  mode = 'grid',
  onDelete,
  className,
}: JourneyViewProps) {
  return mode === 'grid' ? (
    <GridView journeys={journeys} onDelete={onDelete} className={className} />
  ) : (
    <ListView journeys={journeys} onDelete={onDelete} className={className} />
  );
}
