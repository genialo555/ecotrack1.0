import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { VehicleType } from '../vehicle.entity';

export class UpdateVehicleDto {
  @IsOptional()
  @IsEnum(VehicleType)
  type?: VehicleType;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  co2_rate?: number;

  @IsOptional()
  specs?: Record<string, any>;
}
