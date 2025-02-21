import { User } from './user';
import { Vehicle } from './vehicle';
import { TravelMode } from '@/components/journey/GmapsCardSelector';

export interface Point {
  latitude: number;
  longitude: number;
  name?: string;
  timestamp?: Date;
}

export interface Journey {
  id: string;
  userId: string;
  user: User;
  vehicleId: string;
  vehicle?: Vehicle;
  transportMode: TravelMode;
  startLocation: string;
  endLocation: string;
  start_time: Date;
  end_time: Date;
  distanceKm: number;
  co2Emissions: number;
  startLatitude?: number;
  startLongitude?: number;
  endLatitude?: number;
  endLongitude?: number;
  points?: Point[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJourneyDto {
  userId: string;
  user_id: string;
  vehicleId: string;
  vehicle_id?: string;
  transportMode: TravelMode;
  startLocation: string;
  endLocation: string;
  start_time: Date;
  end_time?: Date;
  distanceKm?: number;
  co2Emissions?: number;
  startLatitude?: number;
  startLongitude?: number;
  endLatitude?: number;
  endLongitude?: number;
  points?: Point[];
}

export interface UpdateJourneyDto extends Partial<CreateJourneyDto> {}

export interface CO2Calculation {
  totalCO2: number;
  isGreen: boolean;
}

export interface JourneyStats {
  total_distance: number;
  total_co2_saved: number;
  total_journeys: number;
  average_distance?: number;
  average_co2?: number;
  most_used_transport?: string;
}

export interface JourneyChartData {
  date: string;
  distance: number;
  transport_mode: string;
  co2_emissions: number;
}

export interface JourneyLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
  journeyId: string;
}
