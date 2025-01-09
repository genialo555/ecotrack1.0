import { Journey, CreateJourneyDTO, TransportMode } from '@/types/journey';

export function mapAPIJourneyToFrontend(apiJourney: Journey): Journey {
  return {
    id: apiJourney.id,
    user_id: apiJourney.user_id,
    vehicle_id: apiJourney.vehicle_id,
    title: apiJourney.title,
    transport_mode: apiJourney.transport_mode,
    start_location: apiJourney.start_location,
    end_location: apiJourney.end_location,
    start_time: apiJourney.start_time,
    end_time: apiJourney.end_time,
    start_address: apiJourney.start_address,
    end_address: apiJourney.end_address,
    distance_km: apiJourney.distance_km,
    duration_min: apiJourney.duration_min,
    co2_kg: apiJourney.co2_kg,
    status: apiJourney.status,
    notes: apiJourney.notes,
    created_at: apiJourney.created_at,
    updated_at: apiJourney.updated_at,
  };
}

export function mapFrontendJourneyToAPI(frontendJourney: Journey): Journey {
  return {
    id: frontendJourney.id,
    user_id: frontendJourney.user_id,
    vehicle_id: frontendJourney.vehicle_id,
    title: frontendJourney.title,
    transport_mode: frontendJourney.transport_mode,
    start_location: frontendJourney.start_location,
    end_location: frontendJourney.end_location,
    start_time: frontendJourney.start_time,
    end_time: frontendJourney.end_time,
    start_address: frontendJourney.start_address,
    end_address: frontendJourney.end_address,
    distance_km: frontendJourney.distance_km,
    duration_min: frontendJourney.duration_min,
    co2_kg: frontendJourney.co2_kg,
    status: frontendJourney.status,
    notes: frontendJourney.notes,
    created_at: frontendJourney.created_at,
    updated_at: frontendJourney.updated_at,
  };
}

export function createEmptyJourney(): CreateJourneyDTO {
  return {
    transport_mode: TransportMode.CAR,
    start_location: '',
    end_location: '',
    start_time: new Date().toISOString(),
    start_address: '',
    end_address: '',
    distance_km: 0,
    duration_min: 0,
    co2_kg: 0,
  };
}
