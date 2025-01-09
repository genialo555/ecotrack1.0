import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  type: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  @IsOptional()
  co2_rate?: number;

  @IsObject()
  @IsOptional()
  specs?: Record<string, any>;
}
