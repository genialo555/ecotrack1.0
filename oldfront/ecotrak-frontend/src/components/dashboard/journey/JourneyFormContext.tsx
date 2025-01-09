'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface TransportDetails {
  company: string;
  number: string;
  departure: string;
  arrival: string;
}

interface JourneyFormState {
  step: number;
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  co2: number;
  transportMode: string;
  transportDetails?: TransportDetails;
  routeData?: google.maps.DirectionsResult;
  errors: {
    origin?: string;
    destination?: string;
    transportMode?: string;
    transportDetails?: {
      company?: string;
      number?: string;
      departure?: string;
      arrival?: string;
    };
  };
}

type JourneyFormAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_LOCATIONS'; payload: { origin: string; destination: string } }
  | { type: 'SET_ROUTE_DATA'; payload: google.maps.DirectionsResult }
  | { type: 'SET_TRANSPORT_MODE'; payload: string }
  | { type: 'SET_TRANSPORT_DETAILS'; payload: TransportDetails }
  | { type: 'SET_DISTANCE'; payload: number }
  | { type: 'SET_CO2'; payload: number }
  | { type: 'SET_ERROR'; payload: { field: string; message: string } }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'RESET' };

const initialState: JourneyFormState = {
  step: 1,
  origin: '',
  destination: '',
  distance: 0,
  duration: 0,
  co2: 0,
  transportMode: '',
  errors: {},
};

function validateTransportDetails(details: TransportDetails) {
  const errors: JourneyFormState['errors']['transportDetails'] = {};

  if (!details.company) {
    errors.company = 'Company is required';
  }
  if (!details.number) {
    errors.number = 'Number is required';
  }
  if (!details.departure) {
    errors.departure = 'Departure time is required';
  }
  if (!details.arrival) {
    errors.arrival = 'Arrival time is required';
  }

  return Object.keys(errors).length > 0 ? errors : undefined;
}

function journeyFormReducer(state: JourneyFormState, action: JourneyFormAction): JourneyFormState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_LOCATIONS':
      return { 
        ...state, 
        origin: action.payload.origin,
        destination: action.payload.destination,
        errors: {
          ...state.errors,
          origin: !action.payload.origin ? 'Origin is required' : undefined,
          destination: !action.payload.destination ? 'Destination is required' : undefined,
        },
      };
    case 'SET_ROUTE_DATA':
      const route = action.payload.routes[0];
      return {
        ...state,
        routeData: action.payload,
        duration: route.legs[0].duration.value / 60, // Convert to minutes
      };
    case 'SET_DISTANCE':
      return { ...state, distance: action.payload };
    case 'SET_CO2':
      return { ...state, co2: action.payload };
    case 'SET_TRANSPORT_MODE':
      return { 
        ...state, 
        transportMode: action.payload,
        errors: {
          ...state.errors,
          transportMode: !action.payload ? 'Transport mode is required' : undefined,
        },
      };
    case 'SET_TRANSPORT_DETAILS':
      const detailsErrors = validateTransportDetails(action.payload);
      return { 
        ...state, 
        transportDetails: action.payload,
        errors: {
          ...state.errors,
          transportDetails: detailsErrors,
        },
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.message,
        },
      };
    case 'CLEAR_ERROR':
      const newErrors = { ...state.errors };
      delete newErrors[action.payload as keyof typeof newErrors];
      return {
        ...state,
        errors: newErrors,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface JourneyFormContextType {
  state: JourneyFormState;
  dispatch: React.Dispatch<JourneyFormAction>;
  hasErrors: boolean;
  canProceed: boolean;
}

const JourneyFormContext = createContext<JourneyFormContextType | undefined>(undefined);

export function JourneyFormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(journeyFormReducer, initialState);

  const hasErrors = Object.keys(state.errors).length > 0;
  const canProceed = !hasErrors && (
    (state.step === 1 && state.origin && state.destination) ||
    (state.step === 2 && state.transportMode && (!['TRAIN', 'PLANE'].includes(state.transportMode) || 
      (state.transportDetails && !state.errors.transportDetails))) ||
    state.step === 3
  );

  return (
    <JourneyFormContext.Provider value={{ state, dispatch, hasErrors, canProceed }}>
      {children}
    </JourneyFormContext.Provider>
  );
}

export function useJourneyForm() {
  const context = useContext(JourneyFormContext);
  if (context === undefined) {
    throw new Error('useJourneyForm must be used within a JourneyFormProvider');
  }
  return context;
}
