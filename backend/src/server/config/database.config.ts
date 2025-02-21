// src/server/config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { User } from '../../users/user.entity';
import { Vehicle } from '../../vehicles/vehicle.entity';
import { Journey } from '../../journeys/journey.entity';
import { Activity } from '../../activity/activity.entity';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'ecotrack_user',
  password: process.env.DATABASE_PASSWORD || '1994',
  database: process.env.DATABASE_NAME || 'ecotrack',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Vehicle, Journey, Activity],
  autoLoadEntities: true,
};