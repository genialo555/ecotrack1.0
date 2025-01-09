// src/admin/admin-assistant.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { BackendService } from '../backend/backend.service';

@Injectable()
export class AdminAssistantService {
  private readonly logger = new Logger(AdminAssistantService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly backendService: BackendService
  ) {}

  async processAdminRequest(adminId: string, action: string, parameters: any) {
    // Log l'action
    this.logger.log(`Admin ${adminId} requested action: ${action}`);

    // Vérifier l'accès
    const hasAccess = await this.backendService.verifyAdminAccess(adminId);
    if (!hasAccess) {
      throw new Error('Unauthorized admin access');
    }

    // Traiter via Gemini
    const response = await this.geminiService.processAdminRequest({
      adminId,
      action,
      parameters,
      timestamp: new Date()
    });

    // Si Gemini suggère des actions backend
    if (response.actions?.length) {
      for (const action of response.actions) {
        await this.executeBackendAction(action);
      }
    }

    return response;
  }

  private async executeBackendAction(action: any) {
    switch (action.type) {
      case 'CREATE_USER':
        return this.backendService.makeBackendRequest('/users', 'POST', action.data);
      case 'UPDATE_VEHICLE':
        return this.backendService.makeBackendRequest(`/vehicles/${action.data.id}`, 'PATCH', action.data);
      case 'ANALYZE_JOURNEY':
        return this.backendService.makeBackendRequest(`/journeys/${action.data.id}/analyze`, 'POST');
      default:
        this.logger.warn(`Unknown action type: ${action.type}`);
    }
  }

  async getAdminHistory(adminId: string) {
    return this.backendService.makeBackendRequest('/admin/history', 'GET', { adminId });
  }
}