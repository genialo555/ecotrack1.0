import { User } from './user';
import { Journey } from './journey';

export enum VehicleType {
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
  BICYCLE = 'bicycle',
  SCOOTER = 'scooter',
  OTHER = 'other'
}

export interface Vehicle {
  id: string;
  userId: string;
  type: VehicleType;
  brand: string;
  model: string;
  co2_rate: number;
  is_active: boolean;
  isDefault?: boolean;
  specs?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  journeys?: Journey[];
}

export interface VehicleCreate {
  userId: string;
  type: VehicleType;
  brand: string;
  model: string;
  co2_rate: number;
  isDefault?: boolean;
  specs?: Record<string, any>;
}

export interface VehicleUpdate {
  brand?: string;
  model?: string;
  co2_rate?: number;
  isDefault?: boolean;
  specs?: Record<string, any>;
}

export interface CreateVehicleDto {
  type: VehicleType;
  brand: string;
  model: string;
  co2_rate: number;
  specs?: Record<string, any>;
}

export interface UpdateVehicleDto {
  type?: VehicleType;
  brand?: string;
  model?: string;
  co2_rate?: number;
  specs?: Record<string, any>;
}

export interface VehicleTypeOption {
  value: VehicleType;
  label: string;
  brands: VehicleBrandOption[];
}

export interface VehicleBrandOption {
  value: string;
  label: string;
  models: VehicleModelOption[];
}

export interface VehicleModelOption {
  value: string;
  label: string;
  co2Rate: number;
  specs?: Record<string, any>;
}

export interface VehicleEmission {
  co2: number;
  unit: 'g/km' | 'kg/km';
  source?: string;
  calculatedAt: Date;
  vehicle: Vehicle;
}

export const DEFAULT_CO2_RATES: Record<VehicleType, number> = {
  [VehicleType.CAR]: 120,
  [VehicleType.MOTORCYCLE]: 85,
  [VehicleType.BICYCLE]: 0,
  [VehicleType.SCOOTER]: 40,
  [VehicleType.OTHER]: 100
};
