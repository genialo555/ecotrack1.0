// journey.types.ts
export type Point = {
    latitude: number;
    longitude: number;
  };
  export enum JourneyStatus {
    PLANNED = 'planned',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
  }
  