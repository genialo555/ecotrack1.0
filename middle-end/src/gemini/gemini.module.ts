// src/gemini/gemini.module.ts
import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { ConfigModule } from '@nestjs/config';
import { LoggingModule } from '../logging/logging.module';
@Module({
  imports: [ConfigModule],
  providers: [GeminiService],
  exports: [GeminiService]
})
export class GeminiModule {}