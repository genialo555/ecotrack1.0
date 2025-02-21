// src/backend/backend.service.ts (version complète)
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BackendResponse, UserData, VehicleData, JourneyData } from './types/backend.types';


@Injectable()
export class BackendService {
  private readonly logger = new Logger(BackendService.name);
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('BACKEND_URL');
  }

  async makeBackendRequest<T>(
    endpoint: string, 
    method: string, 
    data?: any
  ): Promise<BackendResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.configService.get('BACKEND_TOKEN')}`
        },
        body: data ? JSON.stringify(data) : undefined
      });

      if (!response.ok) {
        throw new HttpException(
          await response.text(),
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      this.logger.error(`Backend request failed: ${error.message}`, error.stack);
      throw new HttpException(
        'Error communicating with backend',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async verifyAdminAccess(adminId: string): Promise<boolean> {
    try {
      const response = await this.makeBackendRequest<{isAdmin: boolean}>(
        '/auth/verify-admin',
        'POST',
        { adminId }
      );
      return response.data?.isAdmin || false;
    } catch {
      return false;
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await this.makeBackendRequest<{isValid: boolean}>(
        '/auth/validate',
        'POST',
        { token }
      );
      return response.data?.isValid || false;
    } catch {
      return false;
    }
  }
  async getUserContext(userId: string) {
    try {
      const { data: user } = await this.makeBackendRequest<UserData>(`/users/${userId}`, 'GET');
      const { data: vehicles } = await this.makeBackendRequest<VehicleData[]>(`/vehicles/user/${userId}`, 'GET');
      const { data: journeys } = await this.makeBackendRequest<JourneyData[]>(`/journeys/user/${userId}`, 'GET');
  
      return {
        user,
        vehicles,
        journeys,
        preferences: user?.preferences || {}
      };
    } catch (error) {
      this.logger.error(`Error getting user context: ${error.message}`);
      throw error;
    }
  }}