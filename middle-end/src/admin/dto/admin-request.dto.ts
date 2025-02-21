import { IsString, IsNotEmpty, IsObject, IsOptional, IsUUID, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseAdminRequestDto {
  @IsUUID()
  @IsOptional()
  adminId?: string;

  @IsString()
  @IsNotEmpty()
  action: string;
}

export class AdminAnalyzeRequestDto extends BaseAdminRequestDto {
  @IsObject()
  @IsNotEmpty()
  data: {
    userId?: string;
    vehicleId?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
    metrics: string[];
  };
}
export class AdminSuggestRequestDto extends BaseAdminRequestDto {
    @IsObject()
    @IsNotEmpty()
    context: {
      userId?: string;
      vehicleType?: string;
      co2Target?: number;
      currentUsage?: any;
    };
  }