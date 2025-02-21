import { IsNumber, IsDate, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCarbonGoalDto {
  @IsNumber()
  @IsOptional()
  target_co2?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  target_month?: Date;

  @IsBoolean()
  @IsOptional()
  is_global?: boolean;
} 