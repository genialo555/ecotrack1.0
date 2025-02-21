export interface VehicleModelOption {
  value: string;
  label: string;
  co2_rate: number | undefined;  // Undefined si inconnu
  specs: Record<string, any>;
}

export interface VehicleBrandOption {
  value: string;
  label: string;
  models: VehicleModelOption[];
}

export interface VehicleTypeOption {
  value: string;
  label: string;
  brands: VehicleBrandOption[];
}

export interface VehicleDetails {
  type: string;
  brand: string;
  model: string;
  co2_rate: number | undefined;  // Undefined si inconnu
  specs: Record<string, any>;
}
