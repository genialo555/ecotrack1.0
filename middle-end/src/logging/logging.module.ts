// src/logging/logging.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { LoggingService } from './logging.service';

@Module({})
export class LoggingModule {
  static forRoot(options: any): DynamicModule {
    return {
      module: LoggingModule,
      providers: [
        {
          provide: 'LOGGING_OPTIONS',
          useValue: options,
        },
        LoggingService,
      ],
      exports: [LoggingService],
      global: true,
    };
  }
}