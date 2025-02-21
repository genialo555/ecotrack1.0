// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminAssistantController } from './admin-assistant.controller';
import { AdminAssistantService } from './admin-assistant.service ';
import { GeminiModule } from '../gemini/gemini.module';
import { BackendModule } from 'src/backend/backend.module';

@Module({
  imports: [GeminiModule, BackendModule],
  controllers: [AdminAssistantController],
  providers: [AdminAssistantService],
})
export class AdminModule {}