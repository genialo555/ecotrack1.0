'use client';

import React from 'react';
import {
  Car as CarIcon,
  Bike as BikeIcon,
  Train as TrainIcon,
  Plane as PlaneIcon,
  Navigation2 as WalkIcon,
  AlertCircle,
} from 'lucide-react';
import { useJourneyForm } from '../JourneyFormContext';

interface TransportStepProps {
  onNext: () => void;
  onBack: () => void;
}

const transportModes = [
  { id: 'DRIVING', label: 'Car', icon: CarIcon, co2PerKm: 0.12 },
  { id: 'TRAIN', label: 'Train', icon: TrainIcon, co2PerKm: 0.014 },
  { id: 'BICYCLING', label: 'Bike', icon: BikeIcon, co2PerKm: 0 },
  { id: 'WALKING', label: 'Walk', icon: WalkIcon, co2PerKm: 0 },
  { id: 'PLANE', label: 'Plane', icon: PlaneIcon, co2PerKm: 0.285 },
] as const;

interface TransportDetailsFormData {
  company: string;
  number: string;
  departure: string;
  arrival: string;
}

export const TransportStep: React.FC<TransportStepProps> = ({ onNext, onBack }) => {
  const { state, dispatch } = useJourneyForm();
  const [showDetails, setShowDetails] = React.useState(false);
  const [details, setDetails] = React.useState<TransportDetailsFormData>({
    company: '',
    number: '',
    departure: '',
    arrival: '',
  });
  const [errors, setErrors] = React.useState<Partial<TransportDetailsFormData>>({});

  const validateDetails = () => {
    const newErrors: Partial<TransportDetailsFormData> = {};

    if (!details.company.trim()) {
      newErrors.company = 'Company is required';
    }
    if (!details.number.trim()) {
      newErrors.number = 'Number is required';
    }
    if (!details.departure) {
      newErrors.departure = 'Departure time is required';
    }
    if (!details.arrival) {
      newErrors.arrival = 'Arrival time is required';
    }
    if (details.departure && details.arrival && details.departure >= details.arrival) {
      newErrors.arrival = 'Arrival time must be after departure time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModeSelect = (mode: typeof transportModes[number]['id']) => {
    dispatch({ type: 'SET_TRANSPORT_MODE', payload: mode });
    setErrors({});
    
    // Calculate CO2 emissions
    const selectedMode = transportModes.find(m => m.id === mode);
    if (selectedMode && state.distance) {
      const co2 = selectedMode.co2PerKm * state.distance;
      dispatch({ type: 'SET_CO2', payload: co2 });
    }

    // Show details form for train and plane
    setShowDetails(['TRAIN', 'PLANE'].includes(mode));
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDetails()) {
      return;
    }

    dispatch({ type: 'SET_TRANSPORT_DETAILS', payload: details });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {transportModes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleModeSelect(id)}
            className={`
              flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
              ${state.transportMode === id 
                ? 'border-primary bg-primary/10 dark:bg-primary/20 ring-2 ring-primary/50' 
                : 'border-border hover:border-primary/50 dark:border-border/50 dark:hover:border-primary/50'}
              focus:outline-none focus:ring-2 focus:ring-primary/50
            `}
            aria-pressed={state.transportMode === id}
            aria-label={`Select ${label} as transport mode`}
          >
            <Icon className={`w-8 h-8 mb-2 ${state.transportMode === id ? 'text-primary' : 'text-foreground/80'}`} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {showDetails && (
        <form id="transport-details-form" onSubmit={handleDetailsSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-foreground/90 mb-1">
                Company
              </label>
              <input
                type="text"
                id="company"
                value={details.company}
                onChange={(e) => {
                  setDetails(prev => ({ ...prev, company: e.target.value }));
                  if (errors.company) {
                    setErrors(prev => ({ ...prev, company: undefined }));
                  }
                }}
                aria-invalid={!!errors.company}
                aria-describedby={errors.company ? 'company-error' : undefined}
                className={`
                  w-full px-3 py-2 rounded-md border bg-background dark:bg-background/5
                  focus:outline-none focus:ring-2 focus:ring-primary/50
                  ${errors.company ? 'border-destructive' : 'border-border dark:border-border/50'}
                `}
              />
              {errors.company && (
                <p id="company-error" className="mt-1 text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.company}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="number" className="block text-sm font-medium text-foreground/90 mb-1">
                Number
              </label>
              <input
                type="text"
                id="number"
                value={details.number}
                onChange={(e) => {
                  setDetails(prev => ({ ...prev, number: e.target.value }));
                  if (errors.number) {
                    setErrors(prev => ({ ...prev, number: undefined }));
                  }
                }}
                aria-invalid={!!errors.number}
                aria-describedby={errors.number ? 'number-error' : undefined}
                className={`
                  w-full px-3 py-2 rounded-md border bg-background dark:bg-background/5
                  focus:outline-none focus:ring-2 focus:ring-primary/50
                  ${errors.number ? 'border-destructive' : 'border-border dark:border-border/50'}
                `}
              />
              {errors.number && (
                <p id="number-error" className="mt-1 text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.number}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="departure" className="block text-sm font-medium text-foreground/90 mb-1">
                Departure Time
              </label>
              <input
                type="time"
                id="departure"
                value={details.departure}
                onChange={(e) => {
                  setDetails(prev => ({ ...prev, departure: e.target.value }));
                  if (errors.departure) {
                    setErrors(prev => ({ ...prev, departure: undefined }));
                  }
                }}
                aria-invalid={!!errors.departure}
                aria-describedby={errors.departure ? 'departure-error' : undefined}
                className={`
                  w-full px-3 py-2 rounded-md border bg-background dark:bg-background/5
                  focus:outline-none focus:ring-2 focus:ring-primary/50
                  ${errors.departure ? 'border-destructive' : 'border-border dark:border-border/50'}
                `}
              />
              {errors.departure && (
                <p id="departure-error" className="mt-1 text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.departure}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="arrival" className="block text-sm font-medium text-foreground/90 mb-1">
                Arrival Time
              </label>
              <input
                type="time"
                id="arrival"
                value={details.arrival}
                onChange={(e) => {
                  setDetails(prev => ({ ...prev, arrival: e.target.value }));
                  if (errors.arrival) {
                    setErrors(prev => ({ ...prev, arrival: undefined }));
                  }
                }}
                aria-invalid={!!errors.arrival}
                aria-describedby={errors.arrival ? 'arrival-error' : undefined}
                className={`
                  w-full px-3 py-2 rounded-md border bg-background dark:bg-background/5
                  focus:outline-none focus:ring-2 focus:ring-primary/50
                  ${errors.arrival ? 'border-destructive' : 'border-border dark:border-border/50'}
                `}
              />
              {errors.arrival && (
                <p id="arrival-error" className="mt-1 text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.arrival}
                </p>
              )}
            </div>
          </div>
        </form>
      )}

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
        {showDetails ? (
          <button
            type="submit"
            form="transport-details-form"
            disabled={!state.transportMode || (showDetails && !details.company)}
            className="
              px-4 py-2 bg-primary text-primary-foreground rounded-md 
              hover:bg-primary/90 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-primary/50
            "
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!state.transportMode}
            className="
              px-4 py-2 bg-primary text-primary-foreground rounded-md 
              hover:bg-primary/90 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-primary/50
            "
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
