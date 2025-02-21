// src/logging/logging.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  logLIAAction(action: string, result: any) {
    this.logger.log(`LIA Action: ${action}, Result: ${JSON.stringify(result)}`);
  }
  
  logAdminRequest(adminId: string, action: string, result: any) {
    this.logger.log(`Admin ${adminId} Request: ${action}, Result: ${JSON.stringify(result)}`);
  }
   
  logUserInteraction(userId: string, interaction: string, data: any) {
    this.logger.log(`User ${userId} Interaction: ${interaction}, Data: ${JSON.stringify(data)}`);
  }
}