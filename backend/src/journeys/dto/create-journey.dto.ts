 import { IsString, IsNumber, IsUUID, IsOptional, IsArray, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { PointDto as Point } from '../point.dto';

export class CreateJourneyDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  vehicleId: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  transport_mode?: string;

  @IsDate()
  @Type(() => Date)
  start_time: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  end_time?: Date;

  @IsNumber()
  @IsOptional()
  distance_km?: number;

  @ValidateNested()
  @Type(() => Point)
  @IsOptional()
  start_location?: Point;

  @ValidateNested()
  @Type(() => Point)
  @IsOptional()
  end_location?: Point;

  @IsNumber()
  @IsOptional()
  startLatitude?: number;

  @IsNumber()
  @IsOptional()
  startLongitude?: number;

  @IsNumber()
  @IsOptional()
  endLatitude?: number;

  @IsNumber()
  @IsOptional()
  endLongitude?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Point)
  @IsOptional()
  points?: Point[];
}