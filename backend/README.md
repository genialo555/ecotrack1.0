## Project Structure

### Directory Overview
```
.
├── src
│   ├── app.module.ts          # Main application module
│   ├── auth                   # Authentication & Authorization
│   ├── gamification          # User engagement & rewards
│   ├── insights             # Analytics & reporting
│   ├── journeys             # Trip tracking & management
│   ├── messages             # Internal messaging system
│   ├── tracking             # Real-time location tracking
│   ├── users                # User management
│   └── vehicles             # Vehicle management
├── test                     # E2E & Integration tests
├── package.json             # Dependencies & scripts
└── tsconfig.json           # TypeScript configuration
```

### Module Details

#### 🔐 Auth Module
```
auth/
├── auth.controller.ts      # Authentication endpoints
├── auth.service.ts         # Authentication business logic
├── auth.types.ts          # Type definitions
├── dto/                   # Data transfer objects
│   └── login.dto.ts       # Login request validation
├── jwt.strategy.ts        # JWT authentication strategy
└── roles.guard.ts         # Role-based access control
```
Handles user authentication, JWT token management, and role-based authorization.

#### 🎮 Gamification Module
```
gamification/
├── dto/
│   ├── create-carbon-goal.dto.ts   # Carbon goal creation
│   └── update-carbon-goal.dto.ts   # Goal updates
├── entities/
│   └── carbon-goal.entity.ts       # Goal data model
├── gamification.controller.ts      # Goal management endpoints
└── gamification.service.ts        # Goal tracking logic
```
Manages user engagement through carbon reduction goals, achievements, and rewards.

#### 📊 Insights Module
```
insights/
├── dto/
│   └── date-range.dto.ts          # Date filtering
├── insights.controller.ts         # Analytics endpoints
└── insights.service.ts           # Data analysis logic
```
Provides analytics, reports, and data visualization capabilities.

#### 🚗 Journeys Module
```
journeys/
├── dto/
│   ├── create-journey.dto.ts      # Journey creation
│   └── update-journey.dto.ts      # Journey updates
├── journey.entity.ts             # Journey data model
├── journeys.controller.ts        # Journey endpoints
└── journeys.service.ts          # Journey business logic
```
Core module for tracking and managing user trips and carbon footprint calculations.

#### 💬 Messages Module
```
messages/
├── dto/
│   └── create-message.dto.ts      # Message creation
├── entities/
│   ├── message-attachment.entity.ts  # Attachment handling
│   └── message.entity.ts            # Message data model
├── messages.controller.ts           # Messaging endpoints
└── messages.service.ts             # Message handling logic
```
Internal communication system for notifications and user interactions.

#### 📍 Tracking Module
```
tracking/
├── dto/
│   └── location-update.dto.ts     # Location updates
├── entities/
│   └── user-location.entity.ts    # Location data model
├── gateway/
│   └── tracking.gateway.ts        # WebSocket handling
├── tracking.module.ts             # Module configuration
└── tracking.service.ts           # Location tracking logic
```
Real-time location tracking using WebSocket connections.

#### 👥 Users Module
```
users/
├── user.entity.ts                # User data model
├── user.module.ts               # Module configuration
└── user.service.ts             # User management logic
```
User profile management and preferences.

#### 🚙 Vehicles Module
```
vehicles/
├── dto/
│   └── create-vehicle.dto.ts     # Vehicle creation
├── vehicle.entity.ts            # Vehicle data model
├── vehicles.controller.ts       # Vehicle endpoints
└── vehicles.service.ts         # Vehicle management logic
```
Vehicle management including types, emissions data, and user associations.

### Technical Implementation Details

#### Database Schema
```mermaid
erDiagram
    User ||--o{ Journey : creates
    User ||--o{ Vehicle : owns
    User ||--o{ CarbonGoal : sets
    User ||--o{ Message : "sends/receives"
    User ||--o{ UserLocation : tracks
    Journey ||--|| Vehicle : uses
    Journey {
        uuid id PK
        uuid user_id FK
        uuid vehicle_id FK
        point start_location
        point end_location
        timestamp start_time
        timestamp end_time
        float distance_km
        float co2_emission
        string status
        timestamp created_at
        timestamp updated_at
    }
    Vehicle {
        uuid id PK
        uuid user_id FK
        string name
        string type
        float emission_rate
        timestamp created_at
        timestamp updated_at
    }
    CarbonGoal {
        uuid id PK
        uuid user_id FK
        float target_emission
        date start_date
        date end_date
        string status
        timestamp created_at
    }
    Message {
        uuid id PK
        uuid sender_id FK
        uuid receiver_id FK
        string content
        string type
        boolean read
        timestamp created_at
    }
    UserLocation {
        uuid id PK
        uuid user_id FK
        point location
        timestamp timestamp
        float accuracy
        string source
    }
```

#### Module Dependencies
```mermaid
graph TD
    A[App Module] --> B[Auth Module]
    A --> C[Users Module]
    A --> D[Journeys Module]
    A --> E[Vehicles Module]
    A --> F[Gamification Module]
    A --> G[Insights Module]
    A --> H[Messages Module]
    A --> I[Tracking Module]
    
    B --> C
    D --> C
    D --> E
    F --> C
    F --> D
    G --> D
    G --> E
    H --> C
    I --> C
```

#### API Endpoints

##### Auth Module
```typescript
@Controller('auth')
export class AuthController {
    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto): Promise<User> {}

    @Post('2fa/enable')
    @UseGuards(JwtAuthGuard)
    async enable2FA(@CurrentUser() user: User): Promise<{ qrCode: string }> {}

    @Post('2fa/verify')
    @UseGuards(JwtAuthGuard)
    async verify2FA(@Body() verifyDto: Verify2FADto): Promise<boolean> {}
}
```

##### Journeys Module
```typescript
@Controller('journeys')
export class JourneysController {
    @Post()
    @UseGuards(JwtAuthGuard)
    async createJourney(@Body() createJourneyDto: CreateJourneyDto): Promise<Journey> {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getUserJourneys(@Query() query: JourneyQueryDto): Promise<Journey[]> {}

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getJourney(@Param('id') id: string): Promise<Journey> {}

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateJourney(
        @Param('id') id: string,
        @Body() updateJourneyDto: UpdateJourneyDto
    ): Promise<Journey> {}
}
```

##### Tracking Module
```typescript
@WebSocketGateway()
export class TrackingGateway {
    @SubscribeMessage('location-update')
    async handleLocationUpdate(
        @MessageBody() data: LocationUpdateDto,
        @ConnectedSocket() client: Socket
    ): Promise<void> {}

    @SubscribeMessage('start-tracking')
    async handleStartTracking(
        @MessageBody() data: StartTrackingDto,
        @ConnectedSocket() client: Socket
    ): Promise<void> {}

    @SubscribeMessage('stop-tracking')
    async handleStopTracking(
        @ConnectedSocket() client: Socket
    ): Promise<void> {}
}
```

#### Implementation Examples

##### Carbon Calculation Service
```typescript
@Injectable()
export class CarbonCalculationService {
    calculateJourneyCO2(journey: Journey, vehicle: Vehicle): number {
        const distanceKm = this.calculateDistance(
            journey.startLocation,
            journey.endLocation
        );
        
        return distanceKm * vehicle.emissionRate;
    }

    private calculateDistance(start: Point, end: Point): number {
        // Haversine formula implementation
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(end.latitude - start.latitude);
        const dLon = this.toRad(end.longitude - start.longitude);
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                 Math.cos(this.toRad(start.latitude)) * 
                 Math.cos(this.toRad(end.latitude)) * 
                 Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    private toRad(degrees: number): number {
        return degrees * Math.PI / 180;
    }
}
```

##### Real-time Location Tracking
```typescript
@Injectable()
export class TrackingService {
    private readonly locationUpdates = new Subject<UserLocation>();

    async trackLocation(userId: string, location: Point): Promise<void> {
        const userLocation = await this.userLocationRepository.save({
            userId,
            location,
            timestamp: new Date(),
        });

        this.locationUpdates.next(userLocation);
        await this.checkGeofencing(userId, location);
    }

    private async checkGeofencing(userId: string, location: Point): Promise<void> {
        const activeGeofences = await this.geofenceRepository.findActive(userId);
        
        for (const geofence of activeGeofences) {
            const distance = this.calculateDistance(location, geofence.center);
            if (distance <= geofence.radiusKm) {
                await this.handleGeofenceEntry(userId, geofence);
            }
        }
    }
}
```

##### Gamification Rules Engine
```typescript
@Injectable()
export class GamificationService {
    async processJourney(journey: Journey): Promise<Achievement[]> {
        const achievements: Achievement[] = [];
        
        // Check distance milestones
        const totalDistance = await this.calculateUserTotalDistance(journey.userId);
        achievements.push(...this.checkDistanceAchievements(totalDistance));
        
        // Check CO2 reduction goals
        const carbonSaved = await this.calculateCarbonSaved(journey);
        achievements.push(...this.checkCarbonAchievements(carbonSaved));
        
        // Check streak achievements
        const currentStreak = await this.calculateCurrentStreak(journey.userId);
        achievements.push(...this.checkStreakAchievements(currentStreak));
        
        return achievements;
    }

    private async calculateCarbonSaved(journey: Journey): Promise<number> {
        const averageEmission = await this.getAverageEmissionForRoute(
            journey.startLocation,
            journey.endLocation
        );
        
        return averageEmission - journey.co2Emission;
    }
}
```

#### WebSocket Events

```typescript
// Client-side events
interface ClientEvents {
    'location-update': (data: LocationUpdateDto) => void;
    'start-journey': (data: StartJourneyDto) => void;
    'end-journey': (data: EndJourneyDto) => void;
    'request-journey-status': (journeyId: string) => void;
}

// Server-side events
interface ServerEvents {
    'journey-status': (data: JourneyStatusDto) => void;
    'achievement-unlocked': (data: AchievementDto) => void;
    'goal-progress': (data: GoalProgressDto) => void;
    'nearby-alert': (data: NearbyAlertDto) => void;
}
```

#### Security Implementations

##### JWT Authentication
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET'),
            ignoreExpiration: false,
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const user = await this.usersService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
```

##### Role-based Access Control
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly userService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const userWithRoles = await this.userService.findByIdWithRoles(user.id);
        return requiredRoles.some(role => userWithRoles.roles.includes(role));
    }
}
```

### Key Features by Module

#### Auth Module
- JWT-based authentication
- Role-based access control (RBAC)
- Two-factor authentication (2FA)
- Session management

#### Gamification Module
- Carbon reduction goals
- Achievement tracking
- Reward system
- Progress monitoring

#### Insights Module
- Carbon footprint analytics
- Usage statistics
- Performance metrics
- Custom report generation

#### Journeys Module
- Trip tracking
- Route optimization
- Carbon calculation
- Journey history

#### Messages Module
- In-app notifications
- System alerts
- User communications
- Attachment handling

#### Tracking Module
- Real-time location updates
- WebSocket connections
- Geofencing
- Location history

#### Users Module
- Profile management
- Preferences
- Teams and organizations
- Access control

#### Vehicles Module
- Vehicle registration
- Emission profiles
- Maintenance tracking
- Type categorization

## 🌍 About
EcoTrak is an application designed to monitor and manage environmental data, including carbon footprint and energy consumption tracking.

## 🚀 Quick Start Guide

### Prerequisites
- [PostgreSQL](https://www.postgresql.org/download/) (Database)
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Yarn](https://yarnpkg.com/) (Package manager)

### Step 1: Database Setup
1. Create a PostgreSQL database for EcoTrak
2. Make sure PostgreSQL is running on your machine

### Step 2: Project Setup
1. Clone the repository
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` with your database details and other configurations

### Step 3: Install Dependencies
```bash
yarn install
```

### Step 4: Start the Server
```bash
# Development mode (with auto-reload)
yarn start:dev

# Production mode
yarn start:prod
```

The server will start on `http://localhost:3000` by default.

## 📁 Project Structure

```
src/
├── auth/          # Authentication related files
├── users/         # User management
├── journeys/      # Journey tracking
├── vehicles/      # Vehicle management
├── tracking/      # Location tracking
└── config/        # Configuration files
```

## 🔑 Key Features
- User Authentication
- Location Tracking
- Journey Management
- Vehicle Management
- Environmental Impact Calculations

## 🛠 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile

### Journeys
- `GET /journeys` - List user journeys
- `POST /journeys` - Create new journey
- `GET /journeys/:id` - Get journey details

### Vehicles
- `GET /vehicles` - List user vehicles
- `POST /vehicles` - Add new vehicle
- `PUT /vehicles/:id` - Update vehicle

## 📋 API Specifications

### Data Models

#### User
```typescript
{
  id: string;          // UUID
  email: string;       // Unique email address
  first_name: string;  // User's first name
  last_name: string;   // User's last name
  role: string;        // User role (e.g., 'user', 'admin')
  is_active: boolean;  // Account status
  created_at: Date;    // Account creation timestamp
  updated_at: Date;    // Last update timestamp
}
```

#### Journey
```typescript
{
  id: string;                    // UUID
  status: JourneyStatus;         // 'planned' | 'in_progress' | 'completed' | 'cancelled'
  points: Point[];               // Array of GPS coordinates
  startTime: Date;               // Journey start time
  endTime?: Date;                // Journey end time (optional)
  distance: number;              // Total distance in meters
  carbonFootprint: number;       // Calculated CO2 emissions
  vehicleId: string;             // Reference to vehicle used
  userId: string;                // Reference to user
}
```

#### Vehicle
```typescript
{
  id: string;                    // UUID
  make: string;                  // Vehicle manufacturer
  model: string;                 // Vehicle model
  year: number;                  // Manufacturing year
  type: string;                  // Vehicle type (e.g., 'car', 'bike')
  fuelType: string;             // Type of fuel used
  consumption: number;           // Average consumption (L/100km)
  userId: string;                // Reference to owner
}
```

### API Endpoints Specification

#### Authentication API
```typescript
POST /api/auth/register
Body: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}
Response: {
  user: UserDto;
  token: string;
}

POST /api/auth/login
Body: {
  email: string;
  password: string;
}
Response: {
  user: UserDto;
  token: string;
}
```

#### Journey API
```typescript
GET /api/journeys
Query: {
  status?: JourneyStatus;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}
Response: {
  data: Journey[];
  total: number;
  page: number;
  totalPages: number;
}

POST /api/journeys
Body: {
  startPoint: Point;
  endPoint: Point;
  vehicleId: string;
  plannedStartTime?: Date;
}
Response: Journey

GET /api/journeys/:id
Response: Journey

PATCH /api/journeys/:id
Body: {
  status?: JourneyStatus;
  endTime?: Date;
  points?: Point[];
}
Response: Journey
```

#### Vehicle API
```typescript
GET /api/vehicles
Response: Vehicle[]

POST /api/vehicles
Body: {
  make: string;
  model: string;
  year: number;
  type: string;
  fuelType: string;
  consumption: number;
}
Response: Vehicle

PUT /api/vehicles/:id
Body: {
  make?: string;
  model?: string;
  year?: number;
  type?: string;
  fuelType?: string;
  consumption?: number;
}
Response: Vehicle
```

#### Tracking API
```typescript
POST /api/tracking/location
Body: {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  journeyId?: string;
}
Response: {
  success: boolean;
  location: UserLocation;
}

GET /api/tracking/history
Query: {
  startDate: Date;
  endDate: Date;
  page?: number;
  limit?: number;
}
Response: {
  data: UserLocation[];
  total: number;
  page: number;
  totalPages: number;
}
```

#### Gamification API
```typescript
GET /api/gamification/achievements
Response: Achievement[]

GET /api/gamification/leaderboard
Query: {
  type: 'weekly' | 'monthly' | 'allTime';
  category?: 'distance' | 'carbonSaved' | 'journeys';
}
Response: {
  rankings: LeaderboardEntry[];
  userRank: number;
}
```

### Carbon Goals and Gamification

#### Carbon Goal Model
```typescript
{
  id: string;                // UUID
  user_id: string;          // Reference to user
  target_month: Date;       // Target month for the goal
  target_value: number;     // Target carbon reduction in kg
  current_value: number;    // Current progress
  status: GoalStatus;       // 'in_progress' | 'achieved' | 'failed'
  created_at: Date;         // Goal creation date
  updated_at: Date;         // Last update date
}
```

#### Insights and Analytics

##### Available Reports
1. Carbon Footprint Analysis
   ```typescript
   GET /api/insights/carbon-footprint
   Query: {
     startDate: Date;
     endDate: Date;
     groupBy: 'day' | 'week' | 'month';
   }
   Response: {
     data: Array<{
       period: string;
       totalEmissions: number;
       comparisonWithPrevious: number;
     }>;
   }
   ```

2. Journey Statistics
   ```typescript
   GET /api/insights/journey-stats
   Query: {
     timeframe: 'week' | 'month' | 'year';
   }
   Response: {
     totalJourneys: number;
     totalDistance: number;
     averageSpeed: number;
     mostUsedVehicle: {
       id: string;
       make: string;
       model: string;
       usage: number;
     };
   }
   ```

3. Data Export
   ```typescript
   GET /api/insights/export
   Query: {
     format: 'csv' | 'json';
     startDate: Date;
     endDate: Date;
     type: 'journeys' | 'carbon' | 'locations';
   }
   Response: File
   ```

### Real-time Features

#### WebSocket Events
```typescript
// Connection
socket.on('connect', () => {
  socket.emit('join-tracking', { userId: string });
});

// Location Updates
socket.on('location-update', {
  userId: string;
  location: {
    latitude: number;
    longitude: number;
    timestamp: Date;
    accuracy?: number;
    speed?: number;
  };
});

// Journey Status Updates
socket.on('journey-status', {
  journeyId: string;
  status: JourneyStatus;
  currentLocation?: Point;
  estimatedTimeRemaining?: number;
});
```

### Error Handling

#### Standard Error Response Format
```typescript
{
  statusCode: number;       // HTTP status code
  message: string;         // Error message
  error: string;          // Error type
  details?: any;         // Additional error details
  timestamp: string;    // Error timestamp
  path: string;        // Request path
}
```

#### Common Error Codes
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Missing or invalid authentication
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `409`: Conflict - Resource already exists
- `422`: Unprocessable Entity - Valid data but unable to process
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server-side error

### Rate Limiting

```typescript
// Rate limit configuration
{
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                  // Limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    error: 'Too many requests',
    message: 'Please try again later'
  }
}
```

### Database Indexes
```sql
-- Performance optimized indexes
CREATE INDEX "IDX_user_locations_timestamp" ON "user_locations" ("timestamp");
CREATE INDEX "IDX_user_locations_user_timestamp" ON "user_locations" ("user_id", "timestamp");
CREATE INDEX "IDX_journeys_user_status" ON "journeys" ("user_id", "status");
CREATE INDEX "IDX_journeys_date_range" ON "journeys" ("start_time", "end_time");
```

### Caching Strategy
```typescript
// Cache configuration
{
  ttl: 60 * 60 * 1000,     // Cache TTL: 1 hour
  max: 100,                // Maximum number of items in cache
  isGlobal: true,         // Global cache
}

// Cached endpoints
@CacheKey('user-stats')
@CacheTTL(3600)
async getUserStats(): Promise<UserStats>

@CacheKey('carbon-footprint')
@CacheTTL(1800)
async getCarbonFootprint(): Promise<CarbonFootprint>
```

### Development Tools

#### Available Scripts
```bash
# Generate TypeORM entity
yarn typeorm:generate-entity

# Generate migration from entity changes
yarn migration:generate

# Run ESLint
yarn lint

# Run Prettier
yarn format

# Generate API documentation
yarn doc:generate

# Build for production
yarn build:prod
```

#### Debug Configuration
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "runtimeExecutable": "yarn",
      "runtimeArgs": ["start:debug"],
      "port": 9229,
      "sourceMaps": true
    }
  ]
}
```

### Environment Variables
```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000




```

### Security Specifications
1. **Authentication**
   - JWT-based authentication
   - Tokens expire after 24 hours
   - Refresh token rotation
   - Password hashing using bcrypt

2. **API Security**
   - CORS configuration with specific origins
   - Helmet security headers
   - Rate limiting
   - Request validation using class-validator
   - SQL injection protection via TypeORM

3. **Data Protection**
   - Personal data encryption at rest
   - HTTPS-only in production
   - Secure cookie configuration
   - XSS protection
   - CSRF protection

## 🔒 Security Measures

### Authentication Security
```typescript
// Password Requirements
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
};

// JWT Configuration
const JWT_CONFIG = {
  accessToken: {
    expiresIn: '15m',
    algorithm: 'HS256',
  },
  refreshToken: {
    expiresIn: '7d',
    algorithm: 'HS256',
  },
};

// Session Management
const SESSION_CONFIG = {
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  resave: false,
  saveUninitialized: false,
};
```

### Role-Based Access Control (RBAC)
```typescript
enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MANAGER = 'manager',
}

// Role Permissions
const ROLE_PERMISSIONS = {
  user: [
    'read:own_profile',
    'update:own_profile',
    'create:journey',
    'read:own_journeys',
    'update:own_journeys',
  ],
  manager: [
    'read:team_profiles',
    'read:team_journeys',
    'create:team_reports',
  ],
  admin: [
    'manage:users',
    'manage:settings',
    'read:all_data',
    'create:announcements',
  ],
};
```

### API Security Headers
```typescript
// Helmet Configuration
const HELMET_CONFIG = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: true,
  xssFilter: true,
};
```

## 📱 Additional Features

### Messaging System
```typescript
// Message Types
enum MessageType {
  ANNOUNCEMENT = 'announcement',
  NOTIFICATION = 'notification',
  ALERT = 'alert',
}

// Message API
POST /api/messages
Body: {
  type: MessageType;
  title: string;
  content: string;
  recipients: string[];  // User IDs
  priority?: 'low' | 'medium' | 'high';
}

GET /api/messages
Query: {
  type?: MessageType;
  read?: boolean;
  startDate?: Date;
  endDate?: Date;
}
```

### Team Management
```typescript
// Team Structure
interface Team {
  id: string;
  name: string;
  manager_id: string;
  members: string[];  // User IDs
  created_at: Date;
  updated_at: Date;
}

// Team API
POST /api/teams
GET /api/teams
GET /api/teams/:id
PUT /api/teams/:id
DELETE /api/teams/:id

// Team Analytics
GET /api/teams/:id/analytics
Response: {
  totalMembers: number;
  averageCarbonFootprint: number;
  topPerformers: User[];
  recentJourneys: Journey[];
}
```

### Automated Reports
```typescript
// Report Types
enum ReportType {
  DAILY_SUMMARY = 'daily',
  WEEKLY_DIGEST = 'weekly',
  MONTHLY_REPORT = 'monthly',
  CUSTOM = 'custom',
}

// Report Generation API
POST /api/reports/generate
Body: {
  type: ReportType;
  startDate: Date;
  endDate: Date;
  metrics: string[];
  format: 'pdf' | 'csv' | 'excel';
}

// Report Scheduling
POST /api/reports/schedule
Body: {
  type: ReportType;
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
  };
  recipients: string[];
}
```

### Data Retention and Privacy
```typescript
// Data Retention Policy
const DATA_RETENTION = {
  userLocations: 90,  // days
  journeyDetails: 365,  // days
  messages: 180,  // days
  logs: 30,  // days
};

// Data Export (GDPR Compliance)
GET /api/users/me/data-export
Response: {
  personalInfo: UserData;
  journeys: Journey[];
  locations: Location[];
  messages: Message[];
  preferences: UserPreferences;
}

// Data Deletion
POST /api/users/me/data-deletion
Response: {
  deletionJobId: string;
  estimatedCompletionTime: Date;
}
```

### System Health Monitoring
```typescript
// Health Check Endpoints
GET /api/health
Response: {
  status: 'ok' | 'degraded' | 'down';
  components: {
    database: HealthStatus;
    cache: HealthStatus;
    messageQueue: HealthStatus;
    storage: HealthStatus;
  };
  uptime: number;
  responseTime: number;
}

// Performance Metrics
GET /api/metrics
Response: {
  requestsPerMinute: number;
  averageResponseTime: number;
  errorRate: number;
  activeUsers: number;
  systemLoad: {
    cpu: number;
    memory: number;
    disk: number;
  };
}
```

## 💾 Database Configuration

### PostgreSQL Setup
```sql
-- Create database and user
CREATE DATABASE ecotrack;
CREATE USER ecotrack_user WITH ENCRYPTED PASSWORD '1994';
GRANT ALL PRIVILEGES ON DATABASE ecotrack TO ecotrack_user;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
```

### TypeORM Configuration
```typescript
const DATABASE_CONFIG = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'ecotrack_user',
  password: process.env.DATABASE_PASSWORD || '1994',
  database: process.env.DATABASE_NAME || 'ecotrack',
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: false,  // Disabled in production
  logging: true,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
};
```

## 🚀 Deployment

### Production Setup
```bash
# 1. Build the application
yarn build

# 2. Set production environment variables
export NODE_ENV=production
export PORT=3000
export DATABASE_URL=postgresql://user:password@host:5432/dbname

# 3. Run database migrations
yarn migration:run

# 4. Start the application
yarn start:prod
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN yarn build

# Expose port
EXPOSE 3000

# Start application
CMD ["yarn", "start:prod"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_HOST=db
    depends_on:
      - db
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_USER=ecotrack_user
      - POSTGRES_PASSWORD=1994
      - POSTGRES_DB=ecotrack
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Production Checklist
1. **Security**
   - [ ] Enable SSL/TLS
   - [ ] Set secure environment variables
   - [ ] Configure firewall rules
   - [ ] Enable rate limiting
   - [ ] Set up monitoring

2. **Performance**
   - [ ] Enable database connection pooling
   - [ ] Configure PM2 or similar process manager
   - [ ] Set up caching (Redis recommended)
   - [ ] Configure CDN for static assets

3. **Monitoring**
   - [ ] Set up error tracking (e.g., Sentry)
   - [ ] Configure logging (e.g., Winston)
   - [ ] Set up performance monitoring
   - [ ] Configure health checks

4. **Backup**
   - [ ] Set up database backups
   - [ ] Configure backup retention policy
   - [ ] Test backup restoration
   - [ ] Document recovery procedures

### CI/CD Pipeline
```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: yarn install
      - name: Run tests
        run: yarn test
      - name: Run linter
        run: yarn lint

  deploy:
    needs: test# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

# AWS S3 Configuration (for file storage)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket_name
      - name: Deploy to production
        run: |
          # Add deployment steps here
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check if PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**
   - Change the port in `.env`
   - Check for other running services

3. **Migration Errors**
   - Run `yarn migration:run` to update database schema
   - Check migration files in `src/migrations`

## 🤝 Need Help?
- Check the [NestJS documentation](https://docs.nestjs.com/)
- Review error logs in `logs/` directory
- Contact the development team

## 📝 License
This project is proprietary and confidential.

## 🧪 Testing
```bash
# Run unit tests
yarn test

# Run e2e tests
yarn test:e2e

# Get test coverage
yarn test:cov
```

## 📦 Database Migrations
```bash
# Generate a migration
yarn migration:generate src/migrations/MigrationName

# Run migrations
yarn migration:run

# Revert last migration
yarn migration:revert
