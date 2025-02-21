import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';
import { Journey } from '../journeys/journey.entity';
import { User } from '../users/user.entity';
import { UserLocation } from '../tracking/entities/user-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Journey, User, UserLocation])],
  controllers: [InsightsController],
  providers: [InsightsService],
  exports: [InsightsService],
})
export class InsightsModule {} 