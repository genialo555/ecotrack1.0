import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TrackingService } from './tracking.service';
import { UsersService } from '../users/user.service';

@Injectable()
export class LocationSchedulerService {
  private readonly logger = new Logger(LocationSchedulerService.name);

  constructor(
    private readonly trackingService: TrackingService,
    private readonly usersService: UsersService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handlePeriodicLocationUpdate() {
    this.logger.debug('Starting periodic location update for active users');

    try {
      // Get all active users with their last position
      const activeLocations = await this.trackingService.getActiveUsers();

      if (activeLocations.length === 0) {
        this.logger.debug('No active users found, skipping location update');
        return;
      }

      for (const location of activeLocations) {
        try {
          // Mettre à jour la position de l'utilisateur dans la table users
          await this.usersService.updateLocation(
            location.userId,
            location.latitude,
            location.longitude,
          );

          this.logger.debug(
            `Updated location for user ${location.userId}: lat=${location.latitude}, lon=${location.longitude}`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to update location for user ${location.userId}: ${error.message}`,
          );
        }
      }

      this.logger.debug('Completed periodic location update');
    } catch (error) {
      this.logger.error(`Error in periodic location update: ${error.message}`);
    }
  }
} 