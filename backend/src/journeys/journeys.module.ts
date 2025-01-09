// journeys.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JourneysService } from './journeys.service';
import { JourneysController } from './journeys.controller';
import { Journey } from './journey.entity';
import { ConfigModule } from '@nestjs/config';
import { User } from '../users/user.entity';
import { Vehicle } from '../vehicles/vehicules.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Journey, User, Vehicle]),
    ConfigModule,
  ],
  controllers: [JourneysController],
  providers: [JourneysService],
  exports: [JourneysService],
})
export class JourneysModule {}