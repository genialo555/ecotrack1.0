import { Controller, Get, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/activities')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  async getRecentActivities(@Query('limit', ParseIntPipe) limit: number = 10) {
    return await this.activityService.getRecentActivities(limit);
  }
}
