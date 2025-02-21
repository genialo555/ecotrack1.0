import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { CarbonGoal } from './entities/carbon-goal.entity';
import { JourneysModule } from '../journeys/journeys.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarbonGoal]),
    JourneysModule,
  ],
  controllers: [GamificationController],
  providers: [GamificationService],
  exports: [GamificationService],
})
export class GamificationModule {} 