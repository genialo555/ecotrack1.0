// src/journeys/dto/update-journey.dto.ts
import {
  IsOptional,
  IsDate,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateJourneyDto {
  @IsUUID()
  @IsOptional()
  vehicleId?: string;

  @IsString()
  @IsOptional()
  transport_mode?: string;

  @IsString()
  @IsOptional()
  start_location?: string;

  @IsString()
  @IsOptional()
  end_location?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  start_time?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  end_time?: Date;

  @IsNumber()
  @IsOptional()
  distance_km?: number;
}
