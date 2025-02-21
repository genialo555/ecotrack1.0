import { Vehicle } from './vehicle.types';

export interface VehicleEmissions {
  vehicle: Vehicle;
  co2: number;  // in grams per kilometer
  nox?: number; // nitrogen oxides in grams per kilometer
  pm?: number;  // particulate matter in grams per kilometer
}

export interface EmissionsData {
  co2: number;
  nox?: number;
  pm?: number;
  distance: number;
  duration: number;
  vehicle: Vehicle;
  timestamp: Date;
}

export interface EmissionsReport {
  totalCo2: number;
  totalNox?: number;
  totalPm?: number;
  periodStart: Date;
  periodEnd: Date;
  journeyCount: number;
  vehicleBreakdown: {
    vehicleId: string;
    co2: number;
    journeyCount: number;
  }[];
}
