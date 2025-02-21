import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity, ActivityType, ActivityAction } from './activity.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async getRecentActivities(limit: number = 5) {
    return this.activityRepository.find({
      take: limit,
      order: { timestamp: 'DESC' },
      relations: ['user']
    });
  }

  async logActivity(
    type: ActivityType,
    action: ActivityAction,
    details: Record<string, any>,
    user: User
  ) {
    const activity = this.activityRepository.create({
      type,
      action,
      details,
      user,
      user_id: user.id
    });

    return this.activityRepository.save(activity);
  }
}
