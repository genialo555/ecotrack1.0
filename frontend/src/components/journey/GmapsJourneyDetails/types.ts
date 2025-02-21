import type { JourneyDetails } from '../GmapsCardSelector';

export interface GmapsJourneyDetailsProps {
  journey: JourneyDetails;
  onConfirm?: (distance: number, duration: number) => void;
  onComplete?: () => void;
  isLoaded: boolean;
}

export interface TransitDetails {
  stopDetails: {
    arrivalStop: {
      name: string;
      location: {
        latLng: {
          latitude: number;
          longitude: number;
        };
      };
    };
    departureStop: {
      name: string;
      location: {
        latLng: {
          latitude: number;
          longitude: number;
        };
      };
    };
    arrivalTime: string;
    departureTime: string;
  };
  headsign: string;
  transitLine: {
    agencies: {
      name: string;
      phoneNumber?: string;
      uri?: string;
    }[];
    name: string;
    color: string;
    nameShort: string;
    textColor: string;
  };
}

export interface RouteStep {
  transit?: any;
  start_location: google.maps.LatLng;
  end_location: google.maps.LatLng;
  travelMode: string;
  instructions: string;
  html_instructions: string;
  duration: { text: string; value: number };
  distance?: { text: string; value: number };
}

export interface RouteLeg {
  steps: RouteStep[];
  duration: { text: string; value: number };
  distance: { text: string; value: number };
}

export interface Route {
  routes: {
    legs: RouteLeg[];
  }[];
  warnings: string[];
  copyrights: string;
}

export interface TransitOption {
  departure: string;
  arrival: string;
  duration: number;
  price?: {
    value: string;
    currency: string;
  };
  sections: {
    mode: string;
    from: string;
    to: string;
  }[];
}

export interface TrainSchedule {
  departure_time: string;
  arrival_time: string;
  train_type: string;
  train_number: string;
  price?: {
    amount: number;
    currency: string;
  };
}

export interface MapMarkers {
  origin: google.maps.LatLng;
  destination: google.maps.LatLng;
}
