import { IsString, IsNumber, IsUUID, IsOptional, IsObject } from 'class-validator';

export class CreateVehicleDto {
  @IsUUID()
  userId: string;

  @IsString()
  vehicle_type: string; // Remplacement de "type" par "vehicle_type"

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
