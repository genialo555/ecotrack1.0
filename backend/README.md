# EcoTrak Backend

## Table of Contents
1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Technical Stack](#technical-stack)
4. [Project Structure](#project-structure)
5. [Setup and Installation](#setup-and-installation)
6. [API Documentation](#api-documentation)
7. [Development Guidelines](#development-guidelines)
8. [Database Management](#database-management)
9. [Testing Strategy](#testing-strategy)
10. [Security Best Practices](#security-best-practices)
11. [Troubleshooting Guide](#troubleshooting-guide)
12. [Performance Optimization](#performance-optimization)
13. [Deployment](#deployment)
14. [Monitoring and Logging](#monitoring-and-logging)

## Overview
EcoTrak is a sustainable journey tracking application that helps users monitor and reduce their carbon footprint. The backend is built with NestJS and provides a robust API for journey tracking, vehicle management, and environmental impact analysis.

### Key Features
- **User Management**
  - Secure JWT-based authentication
  - Role-based access control (User/Admin)
  - Profile management with data validation
  - Session handling with refresh tokens

- **Vehicle Management**
  - Multiple vehicle types support (Car, Motorcycle, Bicycle)
  - Precise CO2 emission rates calculation
  - Vehicle usage statistics and history
  - Custom specifications storage (JSON)
  - Active/Inactive status tracking

- **Journey Tracking**
  - Real-time distance calculation via Google Maps API
  - Accurate CO2 emissions computation
  - Route optimization suggestions
  - Journey history with filtering
  - Batch journey import/export

- **Environmental Analysis**
  - Carbon footprint calculation with multiple factors
  - Environmental impact reports (Daily/Weekly/Monthly)
  - Emission trends analysis with graphs
  - Comparative statistics between users
  - Export functionality (CSV/PDF)

## Technical Stack

### Core Technologies
- **NestJS**: ^9.0.0
  - Modern Node.js framework
  - Built with TypeScript
  - Modular architecture
  - Dependency injection
  - Custom decorators
  - Exception filters
  - Pipes and interceptors

- **TypeScript**: ^4.9.4
  - Strict type checking
  - Modern ECMAScript features
  - Decorators support
  - Advanced type inference
  - Interface declarations

- **PostgreSQL with TypeORM**: ^0.3.11
  - Robust data persistence
  - Complex relationships
  - Migration support
  - Query optimization
  - Transaction support
  - Soft deletes
  - Entity subscribers

### Authentication
- **JWT**: ^10.2.0
  - Token-based authentication
  - Refresh token rotation
  - Secure cookie handling
  - Role-based authorization
  - Token blacklisting
  - Session management

### External Services
- **Google Maps API**
  - Distance matrix calculations
  - Geocoding/reverse geocoding
  - Route optimization
  - Place validation
  - Time zone handling

### Development Tools
- **ESLint**: ^8.0.0
- **Prettier**: ^2.8.0
- **Jest**: ^29.0.0
- **Swagger**: ^6.0.0
- **Class Validator**: ^0.14.0
- **Class Transformer**: ^0.5.0

## Project Structure

### Directory Organization
```bash
src/
├── auth/                   # Authentication & Authorization
│   ├── dto/               # Data Transfer Objects
│   ├── guards/            # Custom guards
│   ├── strategies/        # Passport strategies
│   └── decorators/        # Custom decorators
│
├── journeys/              # Journey Management
│   ├── dto/               # Journey DTOs
│   ├── entities/          # Journey entities
│   └── interfaces/        # Type definitions
│
├── vehicles/              # Vehicle Management
│   ├── dto/               # Vehicle DTOs
│   ├── entities/          # Vehicle entities
│   └── interfaces/        # Type definitions
│
├── users/                 # User Management
│   ├── dto/               # User DTOs
│   ├── entities/          # User entities
│   └── interfaces/        # Type definitions
│
├── common/                # Shared Resources
│   ├── decorators/       # Common decorators
│   ├── filters/          # Exception filters
│   ├── guards/           # Common guards
│   ├── interfaces/       # Shared interfaces
│   └── utils/            # Utility functions
│
├── config/               # Configuration
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── app.config.ts
│
└── migrations/           # Database Migrations
```

## Setup and Installation

### System Requirements
```bash
# Operating System
Ubuntu 20.04 LTS or higher
Memory: 4GB RAM minimum
Storage: 20GB minimum

# Required software versions
Node.js >= 16.0.0
PostgreSQL >= 14.0
Yarn >= 1.22.0
Redis >= 6.0.0 (for caching)

# Required global packages
$ npm install -g @nestjs/cli
$ npm install -g typescript
$ npm install -g typeorm
```

### Database Setup
```bash
# Install PostgreSQL (if not installed)
$ sudo apt update
$ sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
$ sudo systemctl start postgresql
$ sudo systemctl enable postgresql

# Create database and user
$ sudo -u postgres psql
postgres=# CREATE DATABASE ecotrak;
postgres=# CREATE USER ecotrak_user WITH ENCRYPTED PASSWORD '<password>';
postgres=# GRANT ALL PRIVILEGES ON DATABASE ecotrak TO ecotrak_user;
postgres=# \q

# Run migrations
$ yarn migration:run
```

### Environment Configuration
Create `.env` file with the following structure:
```plaintext
# Server Configuration
PORT=3000
NODE_ENV=development
API_PREFIX=api
FRONTEND_URL=http://localhost:4200
RATE_LIMIT_TTL=3600
RATE_LIMIT_MAX=100
CORS_ORIGIN=http://localhost:4200

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=ecotrak
DATABASE_USER=ecotrak_user
DATABASE_PASSWORD=<password>
DATABASE_LOGGING=true
DATABASE_SYNC=false
DATABASE_SSL=false

# JWT Configuration
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=<your_refresh_secret>
JWT_REFRESH_EXPIRATION=7d
JWT_COOKIE_NAME=refresh_token

# External Services
GOOGLE_MAPS_API_KEY=<your_api_key>
GOOGLE_MAPS_TIMEOUT=5000
GOOGLE_MAPS_RETRY_ATTEMPTS=3

# Security Configuration
BCRYPT_SALT_ROUNDS=12
COOKIE_SECRET=<your_cookie_secret>
ENABLE_RATE_LIMIT=true
ENABLE_HELMET=true

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=<redis_password>
REDIS_TTL=86400

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=combined
LOG_DIR=/var/log/ecotrak
ENABLE_REQUEST_LOGGING=true

# Monitoring Configuration
ENABLE_METRICS=true
METRICS_PORT=9100
ENABLE_HEALTH_CHECK=true
```

## API Documentation

### Request Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "firstName": "John",
  "lastName": "Doe"
}

Response 201:
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}

Response 200:
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user"
  }
}
```

## Development Guidelines

### Code Style and Quality

#### TypeScript Configuration
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "strict": true,
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true
  }
}
```

#### ESLint Configuration
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": "warn"
  }
}
```

### Testing Strategy
- Unit tests for services
- Integration tests for APIs
- E2E tests for critical flows
- Performance testing
- Security testing

### Security Best Practices
- Environment variables for sensitive data
- JWT token validation
- Request rate limiting
- Input validation and sanitization
- Secure cookie handling
- CORS configuration
- SQL injection prevention

### Error Handling
- Global exception filter
- Custom error classes
- Standardized error responses
- Detailed logging (non-sensitive information only)

### Performance
- Database query optimization
- Response caching
- Rate limiting
- Connection pooling

### API Integration
- Use environment variables for API keys
- Implement proper error handling for external APIs
- Cache external API responses when appropriate
- Implement retry mechanisms for failed requests

### Data Validation
- Input validation using class-validator
- Custom validation pipes
- Request payload size limits
- File upload restrictions

## Database Management

### Migration Commands
```bash
# Create new migration
$ yarn migration:create src/migrations/CreateUserTable

# Generate migration from changes
$ yarn migration:generate src/migrations/AddUserFields

# Run pending migrations
$ yarn migration:run

# Revert last migration
$ yarn migration:revert

# Show migration status
$ yarn typeorm migration:show
```

### Database Backup
```bash
# Backup database
$ pg_dump -U ecotrak_user -d ecotrak > backup.sql

# Restore database
$ psql -U ecotrak_user -d ecotrak < backup.sql
```

## Troubleshooting Guide

### Common Issues

#### Database Connection Issues
```bash
# Check database status
$ sudo systemctl status postgresql

# Check database logs
$ sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Test database connection
$ psql -h localhost -U ecotrak_user -d ecotrak
```

#### JWT Issues
- Check token expiration
- Verify secret key in environment
- Ensure proper token format in headers

#### API Response Codes
- 400: Invalid request data
- 401: Authentication required
- 403: Insufficient permissions
- 404: Resource not found
- 422: Validation error
- 429: Rate limit exceeded
- 500: Server error

### Logging

#### Log Levels
```typescript
logger.error('Critical error', error.stack);
logger.warn('Warning message');
logger.log('Info message');
logger.debug('Debug information');
logger.verbose('Detailed debug information');
```

#### Log Files Location
```bash
# Application logs
/var/log/ecotrak/app.log

# Error logs
/var/log/ecotrak/error.log

# Access logs
/var/log/ecotrak/access.log
```

## Performance Optimization

### Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_journeys_user_id ON journeys(user_id);
CREATE INDEX idx_journeys_created_at ON journeys(created_at);
CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);
```

### Caching Strategy
```typescript
// Redis cache configuration
export const cacheConfig = {
  store: redisStore,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  ttl: 60 * 60 * 24, // 24 hours
};
```

### Rate Limiting
```typescript
// Rate limiting configuration
export const rateLimitConfig = {
  ttl: 60, // 1 minute
  limit: 100, // 100 requests per minute
};
```

## Deployment

### Production Preparation
1. Build the application
```bash
$ yarn build
```

2. Verify environment variables
3. Run database migrations
4. Configure production server

### Server Requirements
- Node.js runtime environment
- PostgreSQL database
- Reverse proxy (e.g., Nginx)
- SSL certificate
- Process manager (e.g., PM2)

### Deployment Steps
```bash
# 1. Install dependencies
$ yarn install --production

# 2. Build application
$ yarn build

# 3. Run migrations
$ yarn migration:run

# 4. Start production server
$ yarn start:prod
```

## Monitoring and Logging

### Health Check Endpoints
```typescript
@Controller('health')
export class HealthController {
  @Get()
  @Public()
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('db')
  @Public()
  async dbHealth() {
    try {
      await this.connection.query('SELECT 1');
      return { status: 'ok' };
    } catch (error) {
      throw new ServiceUnavailableException('Database is not available');
    }
  }
}
```

### Prometheus Metrics
```typescript
const metrics = {
  httpRequestDuration: new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.1, 0.5, 1, 2, 5],
  }),
  
  activeConnections: new Gauge({
    name: 'active_connections',
    help: 'Number of active connections',
  }),
};
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License.
