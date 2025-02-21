import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CarbonGoal } from './entities/carbon-goal.entity';
import { CreateCarbonGoalDto } from './dto/create-carbon-goal.dto';
import { UpdateCarbonGoalDto } from './dto/update-carbon-goal.dto';
import { JourneysService } from '../journeys/journeys.service';

@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(CarbonGoal)
    private readonly carbonGoalRepo: Repository<CarbonGoal>,
    private readonly journeysService: JourneysService,
  ) {}

  async createGoal(createGoalDto: CreateCarbonGoalDto): Promise<CarbonGoal> {
    const goal = this.carbonGoalRepo.create(createGoalDto);
    return this.carbonGoalRepo.save(goal);
  }

  async getGoalsByUser(userId: string): Promise<CarbonGoal[]> {
    return this.carbonGoalRepo.find({
      where: { user_id: userId },
      order: { target_month: 'DESC' },
    });
  }

  async getGlobalGoal(targetMonth: Date): Promise<CarbonGoal> {
    const goal = await this.carbonGoalRepo.findOne({
      where: {
        is_global: true,
        target_month: targetMonth,
      },
    });

    if (!goal) {
      throw new NotFoundException('Global goal not found for the specified month');
    }

    return goal;
  }

  async updateGoal(id: string, updateGoalDto: UpdateCarbonGoalDto): Promise<CarbonGoal> {
    const goal = await this.carbonGoalRepo.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    Object.assign(goal, updateGoalDto);
    return this.carbonGoalRepo.save(goal);
  }

  async getUserMonthlyStats(userId: string, month: Date): Promise<any> {
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const journeyStats = await this.journeysService.getJourneyStats(userId);
    const goal = await this.carbonGoalRepo.findOne({
      where: {
        user_id: userId,
        target_month: LessThanOrEqual(endDate),
      },
      order: { target_month: 'DESC' },
    });

    return {
      totalCO2: journeyStats.totalCO2,
      goal: goal?.target_co2,
      progress: goal ? (journeyStats.totalCO2 / goal.target_co2) * 100 : null,
    };
  }
} 