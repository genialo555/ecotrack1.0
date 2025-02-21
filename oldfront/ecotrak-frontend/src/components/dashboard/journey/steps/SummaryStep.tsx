'use client';

import React from 'react';
import { useJourneyForm } from '../JourneyFormContext';
import { formatDistance, formatDuration, formatCO2 } from '@/lib/utils';
import {
  Car as CarIcon,
  Bike as BikeIcon,
  Train as TrainIcon,
  Plane as PlaneIcon,
  Navigation2 as WalkIcon,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface SummaryStepProps {
  onSubmit: () => Promise<void>;
  onBack: () => void;
  isSubmitting?: boolean;
}

const transportIcons = {
  DRIVING: CarIcon,
  TRAIN: TrainIcon,
  BICYCLING: BikeIcon,
  WALKING: WalkIcon,
  PLANE: PlaneIcon,
} as const;

export const SummaryStep: React.FC<SummaryStepProps> = ({ onSubmit, onBack, isSubmitting = false }) => {
  const { state } = useJourneyForm();
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setError(null);
      await onSubmit();
    } catch (error) {
      console.error('Failed to submit journey:', error);
      setError('Failed to add journey. Please try again.');
    }
  };

  const Icon = transportIcons[state.transportMode as keyof typeof transportIcons] || CarIcon;

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 dark:bg-destructive/20 border border-destructive/50">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div 
          className="
            p-6 rounded-lg border border-border/50 dark:border-border/30 
            bg-card dark:bg-card/50 space-y-6 shadow-sm dark:shadow-md dark:shadow-black/10
          "
          role="region"
          aria-label="Journey Summary"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-border/30 dark:border-border/20">
            <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
              <Icon className="w-6 h-6 text-primary dark:text-primary/90" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-foreground/90">Journey Summary</div>
              <div className="text-sm text-muted-foreground capitalize">{state.transportMode.toLowerCase()}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Origin</div>
              <div className="font-medium text-foreground/90 break-words">{state.origin}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Destination</div>
              <div className="font-medium text-foreground/90 break-words">{state.destination}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Distance</div>
              <div className="font-medium text-foreground/90">{formatDistance(state.distance)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Duration</div>
              <div className="font-medium text-foreground/90">{formatDuration(state.duration)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">CO₂ Emissions</div>
              <div className="font-medium text-emerald-500 dark:text-emerald-400" aria-label={`${formatCO2(state.co2)} of CO2 emissions`}>
                {formatCO2(state.co2)}
              </div>
            </div>
          </div>

          {state.transportDetails && (
            <div 
              className="grid grid-cols-2 gap-6 pt-4 border-t border-border/30 dark:border-border/20"
              role="region"
              aria-label="Transport Details"
            >
              <div>
                <div className="text-sm text-muted-foreground mb-1">Company</div>
                <div className="font-medium text-foreground/90">{state.transportDetails.company}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Number</div>
                <div className="font-medium text-foreground/90">{state.transportDetails.number}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Departure</div>
                <div className="font-medium text-foreground/90">{state.transportDetails.departure}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Arrival</div>
                <div className="font-medium text-foreground/90">{state.transportDetails.arrival}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="
            px-4 py-2 text-muted-foreground hover:text-foreground transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md
          "
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="
            inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md 
            hover:bg-primary/90 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-primary/50
          "
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding Journey...
            </>
          ) : (
            'Add Journey'
          )}
        </button>
      </div>
    </div>
  );
};
