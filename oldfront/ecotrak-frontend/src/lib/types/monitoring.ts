// src/lib/types/monitoring.ts
export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface Journey {
    id: string;
    userId: string;
    user: User;
    startLocation: string;
    endLocation: string;
    distance: number;
    co2Emission: number;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    startTime: string;
    endTime?: string;
    travelMode: 'car' | 'train' | 'plane';
  }
  
  export interface DailyStats {
    totalJourneys: number;
    totalEmissions: number;
    totalDistance: number;
    averageEmissionsPerJourney: number;
  }
  
  export interface EmissionDataPoint {
    timestamp: string;
    value: number;
  }
  
  export interface MonitoringData {
    activeUsers: number;
    liveJourneys: Journey[];
    todayStats: DailyStats;
    realtimeEmissions: EmissionDataPoint[];
  }