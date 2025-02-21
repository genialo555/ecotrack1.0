export interface TransitSchedule {
  departureTime: string | Date;
  arrivalTime: string | Date;
  duration: number; // in seconds
  transportMode: string;
  lineNumber?: string;
  changes: number;
  price?: {
    amount: number;
    currency: string;
  };
  platforms?: {
    departure: string;
    arrival: string;
  };
  operator?: string;
  trainType?: string;
  trainNumber?: string;
}

export interface TransitSearchResult {
  schedules: TransitSchedule[];
  source: 'SNCF' | 'RATP' | 'OTHER';
  lastUpdated: string | Date;
}

export interface TransitSearchParams {
  from: {
    name: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  to: {
    name: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  departureTime: string | Date;
  transportModes?: string[];
  maxChanges?: number;
  priceRange?: {
    min: number;
    max: number;
  };
}
