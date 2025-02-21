import { IsNumber, IsDate, IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCarbonGoalDto {
  @IsNumber()
  target_co2: number;

  @IsNumber()
  previous_month_co2: number;

  @Type(() => Date)
  @IsDate()
  target_month: Date;

  @IsUUID()
  @IsOptional()
  user_id?: string;

  @IsBoolean()
  @IsOptional()
  is_global?: boolean;
} 