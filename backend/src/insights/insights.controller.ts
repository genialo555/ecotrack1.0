import {
  Controller,
  Get,
  Query,
  UseGuards,
  Res,
  StreamableFile,
  Param,
  ParseUUIDPipe,
  ParseEnumPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/roles.enum';
import { InsightsService } from './insights.service';
import { DateRangeDto } from './dto/date-range.dto';

enum TrackingPeriod {
  CURRENT = 'current',
  PREVIOUS = 'previous',
}

@Controller('insights')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get('export/journeys')
  async exportJourneys(
    @Query() dateRange: DateRangeDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const startDate = dateRange.startDate ? new Date(dateRange.startDate) : undefined;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : undefined;

    const fileName = await this.insightsService.exportJourneysToCSV(startDate, endDate);
    const file = createReadStream(fileName);

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    return new StreamableFile(file);
  }

  @Get('stats/journeys')
  async getJourneyStats(@Query() dateRange: DateRangeDto) {
    const startDate = dateRange.startDate ? new Date(dateRange.startDate) : undefined;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : undefined;

    return this.insightsService.getJourneyStats(startDate, endDate);
  }

  @Get('tracking/users/:userId')
  async getUserTracking(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('period', new ParseEnumPipe(TrackingPeriod)) period: TrackingPeriod,
  ) {
    return this.insightsService.getUserTrackingData(userId, period);
  }

  @Get('tracking/users')
  async getAllUsersTracking(
    @Query('period', new ParseEnumPipe(TrackingPeriod)) period: TrackingPeriod,
  ) {
    return this.insightsService.getAllUsersTrackingData(period);
  }

  @Get('export/tracking/:userId')
  async exportUserTracking(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('period', new ParseEnumPipe(TrackingPeriod)) period: TrackingPeriod,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const fileName = await this.insightsService.exportUserTrackingToCSV(userId, period);
    const file = createReadStream(fileName);

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    return new StreamableFile(file);
  }
} 