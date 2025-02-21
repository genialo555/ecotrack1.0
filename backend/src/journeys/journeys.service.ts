/* eslint-disable prettier/prettier */
// src/journeys/journeys.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Journey } from './journey.entity';
import { User } from '../users/user.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { UpdateJourneyDto } from './dto/update-journey.dto';
import { ConfigService } from '@nestjs/config';
import { PointDto } from './point.dto';

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

  private pointToString(point: PointDto): string {
    return `${point.latitude},${point.longitude}`;
  }

  private async calculateDistance(origin: PointDto, destination: PointDto): Promise<number> {
    try {
      const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
      if (!apiKey) {
        throw new Error('Google Maps API key not configured');
      }

      const originStr = this.pointToString(origin);
      const destinationStr = this.pointToString(destination);

      console.log('Calculating distance between:', originStr, 'and', destinationStr);
      
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(originStr)}&destinations=${encodeURIComponent(destinationStr)}&mode=driving&units=metric&key=${apiKey}`;
      
      console.log('Making request to Google Maps API...');

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Google Maps API returned status: ${data.status}`);
      }

      if (!data.rows?.[0]?.elements?.[0]) {
        throw new Error('Invalid response structure from Google Maps API');
      }

      const element = data.rows[0].elements[0];
      
      if (element.status !== 'OK') {
        throw new Error(`Route calculation failed: ${element.status}`);
      }

      if (!element.distance?.value) {
        throw new Error('No distance value in response');
      }

      return Number((element.distance.value / 1000).toFixed(2));
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
    let distance = 0;
    if (dto.start_location && dto.end_location) {
      try {
        distance = await this.calculateDistance(dto.start_location, dto.end_location);
        console.log(`Successfully calculated distance: ${distance} km`);
      } catch (error) {
        console.error('Failed to calculate distance:', error);
        if (dto.distance_km) {
          distance = dto.distance_km;
        }
      }
    } else if (dto.distance_km) {
      distance = dto.distance_km;
    }

    // Create journey entity
    const journey = this.journeyRepo.create({
      user_id: dto.userId,
      vehicle_id: dto.vehicleId || null,
      transport_mode: dto.transport_mode || 'car',
      start_location: dto.start_location ? this.pointToString(dto.start_location) : '',
      end_location: dto.end_location ? this.pointToString(dto.end_location) : '',
      start_time: dto.start_time,
      end_time: dto.end_time || null,
      distance_km: distance,
      co2_emissions: 0 // Will be calculated later
    });

    // Set relations
    journey.user = user;
    if (vehicle) {
      journey.vehicle = vehicle;
    }

    console.log('Saving journey:', journey);
    return await this.journeyRepo.save(journey);
  }

  async findByUser(userId: string): Promise<Journey[]> {
    const user = await this.userRepo.findOne({ where: { id: userId }});
    if (!user) throw new NotFoundException('User not found');

    return this.journeyRepo.find({
      where: { user_id: userId },
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

  async update(id: string, dto: UpdateJourneyDto): Promise<Journey> {
    const journey = await this.findById(id);
    Object.assign(journey, dto);
    return this.journeyRepo.save(journey);
  }

  async remove(id: string): Promise<void> {
    const journey = await this.findById(id);
    await this.journeyRepo.remove(journey);
  }

  async findAll(): Promise<Journey[]> {
    return this.journeyRepo.find({
      relations: ['user', 'vehicle'],
      order: { created_at: 'DESC' }
    });
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