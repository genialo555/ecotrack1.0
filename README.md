# EcoTrack - Environmental Impact Monitoring Platform

EcoTrack is a comprehensive platform designed to monitor and manage environmental data, focusing on carbon footprint tracking and energy consumption management. The application provides real-time monitoring, data visualization, and actionable insights for both individual users and organizations.

## 🌟 Features

- **Real-time Location Tracking**: Monitor vehicle movements and calculate environmental impact
- **Carbon Footprint Analysis**: Track and analyze carbon emissions from various sources
- **Gamification**: Engage users through environmental goals and achievements
- **Data Visualization**: Interactive dashboards for environmental metrics
- **Multi-user Support**: Role-based access control (Admin/User)
- **Real-time Notifications**: Updates on goals, achievements, and important metrics

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher (or yarn)
- PostgreSQL 15.x or higher
- Git

### Environment Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd ecotrak
```

2. Set up environment variables:

Backend (.env):
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=ecotrack_user
DATABASE_PASSWORD=your_password
DATABASE_NAME=ecotrack

# JWT
JWT_SECRET=your_jwt_secret

# Server
PORT=3000
```

Frontend (.env):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Installation

1. Backend Setup:
```bash
cd backend
yarn install
yarn build
yarn start:dev
```

2. Frontend Setup:
```bash
cd frontend
yarn install
yarn dev
```

The application will be available at:
- Frontend: http://localhost:4000
- Backend API: http://localhost:3000

## 🏗️ Project Structure

```
ecotrak/
├── backend/                # NestJS backend application
│   ├── src/
│   │   ├── auth/          # Authentication & authorization
│   │   ├── users/         # User management
│   │   ├── tracking/      # Location tracking
│   │   ├── insights/      # Analytics & reporting
│   │   └── gamification/  # User engagement features
│   └── test/              # Backend tests
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/          # Next.js pages & routes
│   │   ├── components/   # Reusable React components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions
│   └── public/           # Static assets
└── docs/                 # Project documentation
```

## 🔧 Technology Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT, Passport
- **Real-time**: WebSockets (Socket.io)
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 15.1.3
- **Styling**: Tailwind CSS with DaisyUI
- **State Management**: React Context
- **UI Components**: Custom components with DaisyUI
- **Icons**: Heroicons

## 📝 Database Schema

The application uses PostgreSQL with the following main entities:
- Users (Authentication & Profile)
- Journeys (Trip Tracking)
- Vehicles (Transportation)
- CarbonGoals (Gamification)
- UserLocations (Real-time Tracking)

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- Rate limiting and throttling
- Secure password hashing with bcrypt
- HTTP-only cookies for token storage
- Input validation and sanitization

## 🧪 Testing

```bash
# Backend tests
cd backend
yarn test        # Unit tests
yarn test:e2e    # E2E tests

# Frontend tests
cd frontend
yarn test        # Run tests
```

## 📚 API Documentation

The API documentation is available at http://localhost:3000/api when running in development mode.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
