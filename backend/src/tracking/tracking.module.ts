import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TrackingGateway } from './gateway/tracking.gateway';
import { TrackingService } from './tracking.service';
import { UserLocation } from './entities/user-location.entity';
import { User } from '../users/user.entity';
import { WsJwtGuard } from './gateway/ws-jwt.guard';
import { LocationSchedulerService } from './location-scheduler.service';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLocation, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ScheduleModule.forRoot(),
    UsersModule,
  ],
  providers: [TrackingGateway, TrackingService, WsJwtGuard, LocationSchedulerService],
  exports: [TrackingService],
})
export class TrackingModule {} 