// src/journeys/dto/create-journey.dto.ts
import {
  IsUUID,
  IsOptional,
  IsDate,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJourneyDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  @IsOptional()
  vehicleId?: string;

  @IsString()
  @IsOptional()
  transport_mode?: string = 'car';

  @IsString()
  start_location: string;

  @IsString()
  end_location: string;

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
