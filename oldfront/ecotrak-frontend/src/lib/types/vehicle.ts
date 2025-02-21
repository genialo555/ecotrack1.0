// src/lib/types/vehicle.ts
export interface Vehicle {
    id: string;
    userId: string;
    brand: string;
    model: string;
    year: number;
    fuelType: FuelType;
    consumption: number;
  }
  
  export enum FuelType {
    GASOLINE = 'GASOLINE',
    DIESEL = 'DIESEL',
    ELECTRIC = 'ELECTRIC',
    HYBRID = 'HYBRID'
  }