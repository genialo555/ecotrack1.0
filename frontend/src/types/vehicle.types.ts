export interface Vehicle {
  id: string;
  userId: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  fuelType: string;
  consumption: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleCreate {
  userId: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  fuelType: string;
  consumption: number;
  isDefault?: boolean;
}

export interface VehicleUpdate {
  brand?: string;
  model?: string;
  year?: number;
  type?: string;
  fuelType?: string;
  consumption?: number;
  isDefault?: boolean;
}
