// update-vehicle.dto.ts
import { IsString, IsNumber, IsBoolean, IsObject, IsOptional } from 'class-validator';

export class UpdateVehicleDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @IsOptional()
  co2_rate?: number;

  @IsObject()
  @IsOptional()
  specs?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}