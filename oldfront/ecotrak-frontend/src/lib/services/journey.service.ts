// src/lib/services/journey.service.ts
import { Journey, CreateJourneyDTO } from '../types/journey';
import { api } from '../utils/api-client';

export class JourneyService {
  static async getJourneys(): Promise<Journey[]> {
    return api.get<Journey[]>('/api/journeys');
  }

  static async createJourney(journey: CreateJourneyDTO): Promise<Journey> {
    return api.post<Journey>('/api/journeys', journey);
  }

  static async calculateEmissions(
    distance: number, 
    transportMode: string
  ): Promise<number> {
    return api.post<number>('/api/journeys/calculate-emissions', {
      distance,
      transportMode
    });
  }
}