// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { GeminiApiException } from '../exceptions/gemini.exception';
import { BackendApiException } from '../exceptions/backend.exceptions';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
 private readonly logger = new Logger(AllExceptionsFilter.name);

 catch(exception: any, host: ArgumentsHost) {
   const ctx = host.switchToHttp();
   const response = ctx.getResponse<Response>();
   const request = ctx.getRequest();

   let status = HttpStatus.INTERNAL_SERVER_ERROR;
   let message = 'Internal server error';

   if (exception instanceof HttpException) {
     status = exception.getStatus();
     message = exception.message;
   } else if (exception instanceof GeminiApiException) {
     status = HttpStatus.BAD_GATEWAY;
     message = exception.message;
   } else if (exception instanceof BackendApiException) {
     status = HttpStatus.BAD_GATEWAY; 
     message = exception.message;
   }

   this.logger.error(`
     Path: ${request.url}
     Method: ${request.method}
     Error: ${exception.message}
     Stack: ${exception.stack}
   `);

   response.status(status).json({
     statusCode: status,
     timestamp: new Date().toISOString(),
     path: request.url,
     message,
     error: process.env.NODE_ENV === 'development' ? exception.stack : undefined
   });
 }
}