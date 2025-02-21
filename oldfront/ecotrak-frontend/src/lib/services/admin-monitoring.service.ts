// src/lib/services/admin-monitoring.service.ts
import { apiClient } from '../utils/api-client';

export class AdminMonitoringService {
  static async getLiveStats() {
    return apiClient('/admin/monitoring/live');
  }

  static async getActiveUsers() {
    return apiClient('/admin/monitoring/active-users');
  }

  static async getCurrentJourneys() {
    return apiClient('/admin/monitoring/current-journeys');
  }

  static async getRealtimeEmissions() {
    return apiClient('/admin/monitoring/emissions');
  }
}