// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
 const logger = new Logger('Bootstrap');
 const app = await NestFactory.create(AppModule);

 // CORS
 app.enableCors({
   origin: process.env.FRONTEND_URL,
   credentials: true,
 });

 // Pipes, Filters & Interceptors
 app.useGlobalPipes(new ValidationPipe());
 app.useGlobalFilters(new AllExceptionsFilter());
 app.useGlobalInterceptors(new LoggingInterceptor());

 await app.listen(3100);
 logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();