// src/user/dto/
// user-request.dto.ts

import { IsString, IsNotEmpty, IsObject, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
export class JourneyOptimizationDto {
    @IsString()
    @IsNotEmpty()
    startLocation: string;
  
    @IsString()
    @IsNotEmpty()
    endLocation: string;
  
    @IsString()
    @IsOptional()
    vehicleId?: string;
  
    @IsObject()
    @IsOptional()
    preferences?: {
      prioritize: 'time' | 'eco' | 'distance';
      avoidTolls?: boolean;
      maxDetour?: number;
    };
  }
  
  export class CO2AnalysisDto {
    @IsString()
    @IsOptional()
    timeframe?: 'day' | 'week' | 'month' | 'year';
  
    @IsArray()
    @IsOptional()
    vehicleIds?: string[];
  
    @IsObject()
    @IsOptional()
    comparisonMetrics?: {
      includeAverage?: boolean;
      includePrevious?: boolean;
      includeProjection?: boolean;
    };
  }
  
  export class HelpRequestDto {
    @IsString()
    @IsNotEmpty()
    question: string;
  
    @IsObject()
    @IsOptional()
    context?: {
      topic?: string;
      relatedTo?: 'vehicle' | 'journey' | 'co2' | 'general';
      previousInteractions?: any[];
    };
  }
  
  export class SuggestionRequestDto {
    @IsObject()
    @IsOptional()
    filters?: {
      category?: string[];
      priority?: 'high' | 'medium' | 'low';
      implementationTime?: 'short' | 'medium' | 'long';
    };
  
    @IsObject()
    @IsOptional()
    goals?: {
      co2Reduction?: number;
      costSaving?: number;
      timeframe?: string;
    };
  }