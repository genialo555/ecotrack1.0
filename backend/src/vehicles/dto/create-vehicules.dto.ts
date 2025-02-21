import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { VehicleType } from '../vehicle.entity';

export class CreateVehicleDto {
  @IsEnum(VehicleType)
  type: VehicleType;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  co2_rate: number;

  @IsOptional()
  specs?: Record<string, any>;
}
