// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiModule } from './gemini/gemini.module';
import { AdminModule } from './admin/admin.module';
import { BackendModule } from './backend/backend.module';
import { UserModule } from './user/user.module';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggingModule.forRoot({}), // Ajout de la configuration pour le LoggingModule
    GeminiModule,
    AdminModule,
    UserModule,
    BackendModule,
  ],
})
export class AppModule {}