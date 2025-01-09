// src/user/user-assistant.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { BackendService } from '../backend/backend.service';

@Injectable()
export class UserAssistantService {
  private readonly logger = new Logger(UserAssistantService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly backendService: BackendService
  ) {}

  async optimizeJourney(userId: string, journeyData: any) {
    const userContext = await this.backendService.getUserContext(userId);
    
    return this.geminiService.processUserRequest({
      userId,
      action: 'OPTIMIZE_JOURNEY',
      data: journeyData,
      context: userContext
    });
  }

  async analyzeCO2Impact(userId: string, data: any) {
    const userContext = await this.backendService.getUserContext(userId);
    
    return this.geminiService.processUserRequest({
      userId,
      action: 'ANALYZE_CO2',
      data,
      context: userContext
    });
  }

  async getPersonalizedSuggestions(userId: string) {
    const userContext = await this.backendService.getUserContext(userId);
    
    return this.geminiService.processUserRequest({
      userId,
      action: 'GET_SUGGESTIONS',
      context: userContext
    });
  }

  async provideAssistance(userId: string, question: any) {
    const userContext = await this.backendService.getUserContext(userId);
    
    return this.geminiService.processUserRequest({
      userId,
      action: 'PROVIDE_HELP',
      data: question,
      context: userContext
    });
  }
}