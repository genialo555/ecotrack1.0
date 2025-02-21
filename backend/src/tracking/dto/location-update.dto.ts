import { IsNumber, IsOptional, IsDate, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class LocationUpdateDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @Type(() => Date)
  @IsDate()
  timestamp: Date;

  @IsNumber()
  @IsOptional()
  accuracy?: number;

  @IsNumber()
  @IsOptional()
  speed?: number;

  @IsNumber()
  @IsOptional()
  heading?: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 