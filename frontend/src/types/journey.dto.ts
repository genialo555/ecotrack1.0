export interface Point {
  latitude: number;
  longitude: number;
  name?: string;
  timestamp?: Date;
}

export interface CreateJourneyDto {
  userId: string;
  vehicleId: string;
  title?: string;
  description?: string;
  transport_mode?: string;
  start_time: Date;
  end_time?: Date;
  distance_km?: number;
  start_location?: Point;
  end_location?: Point;
  startLatitude?: number;
  startLongitude?: number;
  endLatitude?: number;
  endLongitude?: number;
  points?: Point[];
  co2_emissions?: number;
}
