/* eslint-disable prettier/prettier */
// src/journeys/journeys.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Journey } from './journey.entity';
import { User } from '../users/user.entity';
import { Vehicle } from '../vehicles/vehicules.entity';
import { CreateJourneyDto } from './create-journey.dto';
import { UpdateJourneyDto } from './update-journey.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JourneysService {
  constructor(
    @InjectRepository(Journey)
    private readonly journeyRepo: Repository<Journey>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    private readonly configService: ConfigService,
  ) {}

  private async calculateDistance(origin: string, destination: string): Promise<number> {
    try {
      const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
      if (!apiKey) {
        throw new Error('Google Maps API key not configured');
      }

      console.log('Calculating distance between:', origin, 'and', destination);
      
      // Construct the URL with all required parameters
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&mode=driving&units=metric&key=${apiKey}`;
      
      console.log('Making request to Google Maps API...');

      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Response status:', response.status);
      console.log('Response data:', JSON.stringify(data, null, 2));

      if (data.status !== 'OK') {
        console.error('API returned non-OK status:', data.status);
        throw new Error(`Google Maps API returned status: ${data.status}`);
      }

      if (!data.rows?.[0]?.elements?.[0]) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response structure from Google Maps API');
      }

      const element = data.rows[0].elements[0];
      
      if (element.status !== 'OK') {
        console.error('Element status not OK:', element.status);
        throw new Error(`Route calculation failed: ${element.status}`);
      }

      if (!element.distance?.value) {
        console.error('No distance value in response');
        throw new Error('No distance value in response');
      }

      // Convert meters to kilometers
      const distance = Number((element.distance.value / 1000).toFixed(2));
      console.log('Successfully calculated distance:', distance, 'km');
      return distance;
    } catch (error) {
      console.error('Error calculating distance:', error);
      throw error;
    }
  }

  async createJourney(dto: CreateJourneyDto): Promise<Journey> {
    console.log('Creating journey with DTO:', dto);
    
    const user = await this.userRepo.findOne({ where: { id: dto.userId }});
    if (!user) throw new NotFoundException('User not found');

    let vehicle: Vehicle | null = null;
    if (dto.vehicleId) {
      vehicle = await this.vehicleRepo.findOne({ 
        where: { 
          id: dto.vehicleId,
          user: { id: user.id }
        }
      });
      if (!vehicle) throw new NotFoundException('Vehicle not found or does not belong to user');
    }

    // Calculate distance if locations are provided
    let distance = dto.distance_km;
    if (dto.start_location && dto.end_location && !dto.distance_km) {
      console.log('Attempting to calculate distance for locations:', {
        start: dto.start_location,
        end: dto.end_location
      });
      
      try {
        distance = await this.calculateDistance(dto.start_location, dto.end_location);
        console.log(`Successfully calculated distance: ${distance} km`);
      } catch (error) {
        console.error('Failed to calculate distance:', error);
        // Continue without distance if calculation fails
      }
    } else {
      console.log('Skipping distance calculation:', {
        hasStart: !!dto.start_location,
        hasEnd: !!dto.end_location,
        hasDistance: !!dto.distance_km
      });
    }

    // Create journey entity
    const journey = this.journeyRepo.create({
      user_id: dto.userId,
      vehicle_id: dto.vehicleId || null,
      transport_mode: dto.transport_mode || 'car',
      start_location: dto.start_location,
      end_location: dto.end_location,
      start_time: dto.start_time || new Date(),
      end_time: dto.end_time || null,
      distance_km: dto.distance_km || 0,
      co2_emissions: 0 // Will be calculated later
    });

    // Set relations
    journey.user = user;
    if (vehicle) {
      journey.vehicle = vehicle;
    }

    console.log('Saving journey:', journey);
    const savedJourney = await this.journeyRepo.save(journey);
    return savedJourney;
  }

  async findByUser(userId: string): Promise<Journey[]> {
    const user = await this.userRepo.findOne({ where: { id: userId }});
    if (!user) throw new NotFoundException('User not found');

    return this.journeyRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'vehicle'],
      order: { created_at: 'DESC' }
    });
  }

  async findById(id: string): Promise<Journey> {
    const journey = await this.journeyRepo.findOne({
      where: { id },
      relations: ['user', 'vehicle']
    });
    if (!journey) throw new NotFoundException('Journey not found');
    return journey;
  }

  async findAll(): Promise<Journey[]> {
    return this.journeyRepo.find({
      relations: ['user', 'vehicle'],
      order: { created_at: 'DESC' }
    });
  }

  async updateJourney(id: string, updateData: UpdateJourneyDto): Promise<Journey> {
    const journey = await this.findById(id);

    if (updateData.vehicleId) {
      const vehicle = await this.vehicleRepo.findOne({
        where: { 
          id: updateData.vehicleId,
          user: { id: journey.user.id }
        }
      });
      if (!vehicle) throw new NotFoundException('Vehicle not found or does not belong to user');
      journey.vehicle = vehicle;
    }

    Object.assign(journey, updateData);
    return this.journeyRepo.save(journey);
  }

  async deleteJourney(id: string): Promise<void> {
    const result = await this.journeyRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Journey not found');
  }

  async getJourneyStats(userId: string) {
    const journeys = await this.findByUser(userId);
    return {
      totalJourneys: journeys.length,
      totalDistance: journeys.reduce((sum, journey) => sum + (journey.distance_km || 0), 0),
      totalCO2: journeys.reduce((sum, journey) => sum + (journey.co2_emissions || 0), 0)
    };
  }

  private getCO2PerKm(transportMode: string): number {
    // TO DO: implement CO2 emissions per km calculation based on transport mode
    // For now, return a default value
    return 0.2; // kg CO2 per km
  }
}