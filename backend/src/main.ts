import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';  // Correction ici

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Préfixe global pour toutes les routes
  app.setGlobalPrefix('api');

  // Validation des DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Ajout de Helmet pour sécuriser les en-têtes HTTP
  app.use(helmet());

  // Ajout du middleware cookie-parser
  app.use(cookieParser());  // Maintenant ça devrait fonctionner

  // Configuration des CORS
  app.enableCors({
    origin: process.env.NODE_ENV === 'development'
       ? ['http://localhost:3000', 'http://localhost:4000', 'http://localhost:3001']
       : [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'credentials',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials'
    ],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
  });

  // Ajout de logs pour les routes disponibles
  const server = app.getHttpServer();
  const router = server._events.request._router;
  const availableRoutes = router.stack
    .filter((layer) => layer.route)
    .map((layer) => `${layer.route.stack[0].method.toUpperCase()} ${layer.route.path}`);
  console.log('Available Routes:', availableRoutes);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Application running on: http://localhost:${port}/api`);
}

bootstrap();