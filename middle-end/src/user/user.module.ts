import { Module } from '@nestjs/common';
import { UserAssistantController } from './user-assistant.controller';
import { UserAssistantService } from './user-assistant.service';
import { GeminiModule } from '../gemini/gemini.module';
import { BackendModule } from '../backend/backend.module';

@Module({
  imports: [GeminiModule, BackendModule],
  controllers: [UserAssistantController],
  providers: [UserAssistantService],
})
export class UserModule {}