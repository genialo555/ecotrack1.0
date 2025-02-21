// point.dto.ts
import { IsNumber, Min, Max } from 'class-validator';

export class PointDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}