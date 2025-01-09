// src/gemini/gemini.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeminiRequest, GeminiResponse, AdminAction } from './types/gemini.types';
import { LoggingService } from '../logging/logging.service';


@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private apiKey: string;
  private baseUrl: string;

  constructor(
    private configService: ConfigService,
    private loggingService: LoggingService
  ) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.baseUrl = this.configService.get<string>('GEMINI_API_URL');
  }

  async processAdminRequest(action: AdminAction): Promise<GeminiResponse> {
    this.logger.log(`Processing admin request: ${action.action}`);
    
    const prompt = await this.buildPrompt(action);
    const response = await this.callGeminiAPI(prompt);
    
    this.loggingService.logLIAAction(action.action, response);
    
    return response;
  }

  private async buildPrompt(action: AdminAction): Promise<string> {
    // Construire un prompt contextualisé pour Gemini
    return `
      As an AI assistant for EcoTrack, help with the following admin request:
      Action: ${action.action}
      Parameters: ${JSON.stringify(action.parameters)}
      Context: Admin request for business operation
      Requirements: Provide clear, actionable response
    `;
  }

  private async callGeminiAPI(prompt: string): Promise<GeminiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error('Error calling Gemini API', error);
      throw error;
    }
  }

  async processUserRequest(request: {
    userId: string;
    action: string;
    data?: any;
    context?: any;
  }) {
    this.logger.log(`Processing user request: ${request.action} for user ${request.userId}`);
    
    const prompt = await this.buildUserPrompt(request);
    const response = await this.callGeminiAPI(prompt);
    
    this.loggingService.logUserInteraction(request.userId, request.action, response);
    
    return response;
  }

  private async buildUserPrompt(request: {
    userId: string;
    action: string;
    data?: any; 
    context?: any;
  }) {
    const { action, data, context } = request;
    
    // Construire un prompt contextualisé pour l'utilisateur
    return `
      As an AI assistant for EcoTrack, help with the following user request:
      Action: ${action}
      User Context: ${JSON.stringify(context)}
      Request Data: ${JSON.stringify(data)}
      Requirements: Provide personalized, helpful response 
    `;
  }
}