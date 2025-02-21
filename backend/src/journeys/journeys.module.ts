// journeys.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journey } from './journey.entity';
import { JourneysController } from './journeys.controller';
import { JourneysService } from './journeys.service';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Journey, User]),
    VehiclesModule,
  ],
  controllers: [JourneysController],
  providers: [JourneysService],
  exports: [JourneysService],
})
export class JourneysModule {}