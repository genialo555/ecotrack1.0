export enum TransportMode {
  WALKING = 'WALKING',
  CYCLING = 'CYCLING',
  PUBLIC_TRANSPORT = 'PUBLIC_TRANSPORT',
  CAR = 'CAR',
  PLANE = 'PLANE'
}

export enum JourneyStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Journey {
  id: string;
  user_id: string;
  vehicle_id?: string;
  title?: string;
  transport_mode: TransportMode;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time?: string;
  start_address: string;
  end_address: string;
  distance_km: number;
  duration_min: number;
  co2_kg: number;
  status: JourneyStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface JourneyStats {
  totalDistance: number;
  totalCO2: number;
  totalTime: number;
  journeyCount: number;
}

export interface TransportModeStats {
  mode: TransportMode;
  distance: number;
  co2: number;
  time: number;
  count: number;
}

export interface CreateJourneyDTO {
  transport_mode: TransportMode;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time?: string;
  start_address: string;
  end_address: string;
  distance_km: number;
  duration_min: number;
  co2_kg: number;
  notes?: string;
}

export const TRANSPORT_MODE_LABELS: Record<TransportMode, string> = {
  [TransportMode.WALKING]: 'Walking',
  [TransportMode.CYCLING]: 'Cycling',
  [TransportMode.PUBLIC_TRANSPORT]: 'Public Transport',
  [TransportMode.CAR]: 'Car',
  [TransportMode.PLANE]: 'Plane'
};

export const JOURNEY_STATUS_LABELS: Record<JourneyStatus, string> = {
  [JourneyStatus.PENDING]: 'En attente',
  [JourneyStatus.COMPLETED]: 'Terminé',
  [JourneyStatus.CANCELLED]: 'Annulé',
};
