import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
  ParseUUIDPipe,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/roles.enum';
import { GamificationService } from './gamification.service';
import { CreateCarbonGoalDto } from './dto/create-carbon-goal.dto';
import { UpdateCarbonGoalDto } from './dto/update-carbon-goal.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('gamification')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Post('goals')
  @Roles(UserRole.ADMIN)
  async createGoal(@Body() createGoalDto: CreateCarbonGoalDto) {
    return this.gamificationService.createGoal(createGoalDto);
  }

  @Get('goals/global')
  async getGlobalGoal(@Query('month') month: string) {
    const targetMonth = new Date(month);
    return this.gamificationService.getGlobalGoal(targetMonth);
  }

  @Get('goals/user/:userId')
  async getUserGoals(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() currentUser: User,
  ) {
    // Vérifier si l'utilisateur actuel est admin ou demande ses propres objectifs
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== userId) {
      throw new ForbiddenException('You can only access your own goals');
    }
    return this.gamificationService.getGoalsByUser(userId);
  }

  @Get('stats/monthly')
  async getUserMonthlyStats(
    @CurrentUser() user: User,
    @Query('month') month: string,
  ) {
    const targetMonth = new Date(month);
    return this.gamificationService.getUserMonthlyStats(user.id, targetMonth);
  }

  @Put('goals/:id')
  @Roles(UserRole.ADMIN)
  async updateGoal(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGoalDto: UpdateCarbonGoalDto,
  ) {
    return this.gamificationService.updateGoal(id, updateGoalDto);
  }
} 