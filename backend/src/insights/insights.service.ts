import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Journey } from '../journeys/journey.entity';
import { User } from '../users/user.entity';
import { UserLocation } from '../tracking/entities/user-location.entity';
import { createObjectCsvWriter } from 'csv-writer';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(Journey)
    private readonly journeyRepo: Repository<Journey>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserLocation)
    private readonly userLocationRepo: Repository<UserLocation>,
  ) {}

  async exportJourneysToCSV(startDate?: Date, endDate?: Date): Promise<string> {
    // Construire la requête
    const queryBuilder = this.journeyRepo
      .createQueryBuilder('journey')
      .leftJoinAndSelect('journey.user', 'user')
      .leftJoinAndSelect('journey.vehicle', 'vehicle')
      .select([
        'journey.id',
        'journey.start_time',
        'journey.end_time',
        'journey.distance_km',
        'journey.co2_emissions',
        'journey.transport_mode',
        'journey.start_location',
        'journey.end_location',
        'user.id',
        'user.email',
        'vehicle.brand',
        'vehicle.model',
        'vehicle.type',
      ]);

    // Ajouter les filtres de date si spécifiés
    if (startDate && endDate) {
      queryBuilder.where('journey.start_time BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const journeys = await queryBuilder.getMany();

    // Créer le fichier CSV
    const fileName = `journeys_export_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`;
    const csvWriter = createObjectCsvWriter({
      path: fileName,
      header: [
        { id: 'id', title: 'Journey ID' },
        { id: 'start_time', title: 'Start Time' },
        { id: 'end_time', title: 'End Time' },
        { id: 'distance_km', title: 'Distance (km)' },
        { id: 'co2_emissions', title: 'CO2 Emissions' },
        { id: 'transport_mode', title: 'Transport Mode' },
        { id: 'start_location', title: 'Start Location' },
        { id: 'end_location', title: 'End Location' },
        { id: 'user_id', title: 'User ID' },
        { id: 'user_email', title: 'User Email' },
        { id: 'vehicle_brand', title: 'Vehicle Brand' },
        { id: 'vehicle_model', title: 'Vehicle Model' },
        { id: 'vehicle_type', title: 'Vehicle Type' },
      ],
    });

    // Formater les données pour le CSV
    const records = journeys.map(journey => ({
      id: journey.id,
      start_time: journey.start_time,
      end_time: journey.end_time,
      distance_km: journey.distance_km,
      co2_emissions: journey.co2_emissions,
      transport_mode: journey.transport_mode,
      start_location: journey.start_location,
      end_location: journey.end_location,
      user_id: journey.user?.id,
      user_email: journey.user?.email,
      vehicle_brand: journey.vehicle?.brand,
      vehicle_model: journey.vehicle?.model,
      vehicle_type: journey.vehicle?.type,
    }));

    await csvWriter.writeRecords(records);
    return fileName;
  }

  async getJourneyStats(startDate?: Date, endDate?: Date) {
    const queryBuilder = this.journeyRepo
      .createQueryBuilder('journey')
      .select([
        'COUNT(journey.id) as total_journeys',
        'SUM(journey.distance_km) as total_distance',
        'SUM(journey.co2_emissions) as total_co2',
        'AVG(journey.co2_emissions) as avg_co2_per_journey',
      ]);

    if (startDate && endDate) {
      queryBuilder.where('journey.start_time BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    return queryBuilder.getRawOne();
  }

  async getUserTrackingData(userId: string, period: 'current' | 'previous' = 'current'): Promise<{
    locations: UserLocation[];
    journeys: Journey[];
    stats: {
      totalDistance: number;
      totalCO2: number;
      averageSpeed: number;
    };
  }> {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (period === 'current') {
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    } else {
      const previousMonth = subMonths(now, 1);
      startDate = startOfMonth(previousMonth);
      endDate = endOfMonth(previousMonth);
    }

    // Récupérer les positions
    const locations = await this.userLocationRepo.find({
      where: {
        userId,
        timestamp: Between(startDate, endDate),
      },
      order: { timestamp: 'ASC' },
    });

    // Récupérer les trajets
    const journeys = await this.journeyRepo.find({
      where: {
        user: { id: userId },
        start_time: Between(startDate, endDate),
      },
      order: { start_time: 'ASC' },
    });

    // Calculer les statistiques
    const stats = {
      totalDistance: journeys.reduce((sum, journey) => sum + (journey.distance_km || 0), 0),
      totalCO2: journeys.reduce((sum, journey) => sum + (journey.co2_emissions || 0), 0),
      averageSpeed: locations.reduce((sum, loc) => sum + (loc.speed || 0), 0) / (locations.length || 1),
    };

    return { locations, journeys, stats };
  }

  async getAllUsersTrackingData(period: 'current' | 'previous' = 'current'): Promise<{
    [userId: string]: {
      user: User;
      trackingData: {
        locations: UserLocation[];
        journeys: Journey[];
        stats: {
          totalDistance: number;
          totalCO2: number;
          averageSpeed: number;
        };
      };
    };
  }> {
    const users = await this.userRepo.find();
    const result = {};

    for (const user of users) {
      const trackingData = await this.getUserTrackingData(user.id, period);
      result[user.id] = {
        user,
        trackingData,
      };
    }

    return result;
  }

  async exportUserTrackingToCSV(userId: string, period: 'current' | 'previous' = 'current'): Promise<string> {
    const { locations, journeys, stats } = await this.getUserTrackingData(userId, period);
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const fileName = `user_tracking_${user.email}_${period}_month_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`;
    const csvWriter = createObjectCsvWriter({
      path: fileName,
      header: [
        { id: 'timestamp', title: 'Timestamp' },
        { id: 'type', title: 'Type' },
        { id: 'latitude', title: 'Latitude' },
        { id: 'longitude', title: 'Longitude' },
        { id: 'speed', title: 'Speed (km/h)' },
        { id: 'distance', title: 'Distance (km)' },
        { id: 'co2', title: 'CO2 Emissions' },
        { id: 'metadata', title: 'Additional Info' },
      ],
    });

    const records = [
      // Ajouter les positions
      ...locations.map(loc => ({
        timestamp: loc.timestamp,
        type: 'location',
        latitude: loc.latitude,
        longitude: loc.longitude,
        speed: loc.speed,
        distance: null,
        co2: null,
        metadata: JSON.stringify(loc.metadata),
      })),
      // Ajouter les trajets
      ...journeys.map(journey => ({
        timestamp: journey.start_time,
        type: 'journey',
        latitude: null,
        longitude: null,
        speed: null,
        distance: journey.distance_km,
        co2: journey.co2_emissions,
        metadata: `From: ${journey.start_location} To: ${journey.end_location}`,
      })),
    ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    await csvWriter.writeRecords(records);
    return fileName;
  }
} 