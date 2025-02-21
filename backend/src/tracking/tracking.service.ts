import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { UserLocation } from './entities/user-location.entity';
import { LocationUpdateDto } from './dto/location-update.dto';
import { User } from '../users/user.entity';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(UserLocation)
    private readonly locationRepo: Repository<UserLocation>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async updateUserLocation(userId: string, locationData: LocationUpdateDto): Promise<UserLocation> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const location = this.locationRepo.create({
      userId,
      ...locationData,
    });

    return this.locationRepo.save(location);
  }

  async getUserLocation(userId: string): Promise<UserLocation> {
    const location = await this.locationRepo.findOne({
      where: { userId, isActive: true },
      order: { timestamp: 'DESC' },
    });

    if (!location) {
      throw new NotFoundException('Location not found for user');
    }

    return location;
  }

  async getUserLocationHistory(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<UserLocation[]> {
    return this.locationRepo.find({
      where: {
        userId,
        timestamp: Between(startDate, endDate),
      },
      order: { timestamp: 'DESC' },
    });
  }

  async getActiveUsers(): Promise<UserLocation[]> {
    return this.locationRepo
      .createQueryBuilder('location')
      .innerJoinAndSelect('location.user', 'user')
      .where('location.isActive = :isActive', { isActive: true })
      .orderBy('location.timestamp', 'DESC')
      .getMany();
  }

  async setUserActive(userId: string, isActive: boolean): Promise<void> {
    await this.locationRepo.update(
      { userId },
      { isActive: isActive },
    );
  }

  async deleteOldLocations(olderThan: Date): Promise<void> {
    await this.locationRepo
      .createQueryBuilder()
      .delete()
      .where('timestamp < :date', { date: olderThan })
      .execute();
  }
} 