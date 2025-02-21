/* eslint-disable @typescript-eslint/no-empty-object-type */
import { TransportMode, JourneyStatus } from '@/types/journey';

export interface Journey {
  id: string;
  user_id: string;
  vehicle_id: string | null;
  title?: string;
  transport_mode: TransportMode;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time: string | null;
  distance_km: number;
  co2_emissions: number;
  created_at: string;
  updated_at: string;
  status: JourneyStatus;
  notes?: string;
  vehicle?: {
    id: string;
    brand: string;
    model: string;
    type: string;
    co2_rate: number;
    specs?: {
      consumption: number;
      fuelType: string;
    };
  };
  route_data?: {
    summary: string;
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
    waypoints?: {
      location: string;
      stopover: boolean;
    }[];
    steps?: {
      distance: number;
      duration: number;
      instructions: string;
      mode: string;
      path?: { lat: number; lng: number }[];
    }[];
  };
}

export interface CreateJourneyDTO {
  transport_mode: TransportMode;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time?: string | null;
  distance_km: number;
  co2_emissions: number;
  vehicle_id?: string;
  title?: string;
  notes?: string;
  route_data?: Journey['route_data'];
}

export interface UpdateJourneyDTO extends Partial<CreateJourneyDTO> {}

export interface JourneyStats {
  total_count: number;
  avg_distance: number;
  avg_duration: number;
  avg_co2: number;
  last_used: string;
}

export interface FrequentJourney extends Journey {
  stats: JourneyStats;
}