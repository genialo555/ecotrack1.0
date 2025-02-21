// src/server/data-source.ts
import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { User } from '../users/user.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Journey } from '../journeys/journey.entity';
import { Activity } from '../activity/activity.entity';

dotenv.config();

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || "ecotrack_user",
  password: process.env.DATABASE_PASSWORD || "1994",
  database: process.env.DATABASE_NAME || "ecotrack",
  synchronize: true,
  logging: process.env.NODE_ENV === "development",
  entities: [User, Vehicle, Journey, Activity],
  migrations: ["dist/migrations/*.js"],
  migrationsTableName: "migrations",
};

export const AppDataSource = new DataSource(config);