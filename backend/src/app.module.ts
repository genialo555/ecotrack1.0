/* eslint-disable prettier/prettier */
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { databaseConfig } from './server/config/database.config';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { JourneysModule } from './journeys/journeys.module';
import { GamificationModule } from './gamification/gamification.module';
import { InsightsModule } from './insights/insights.module';
import { TrackingModule } from './tracking/tracking.module';
import { MessagesModule } from './messages/messages.module';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...databaseConfig,
      autoLoadEntities: true,
    }),
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 60000,
      limit: 10,
    }]),
    UsersModule,
    AuthModule,
    VehiclesModule,
    JourneysModule,
    GamificationModule,
    InsightsModule,
    TrackingModule,
    MessagesModule,
    ActivityModule,
    ActivityModule,
  ],
})
export class AppModule {}