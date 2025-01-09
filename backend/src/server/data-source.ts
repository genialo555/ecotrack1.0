// src/server/data-source.ts
import { DataSource } from "typeorm";
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || "ecotrack_user",
  password: process.env.DATABASE_PASSWORD || "1994",
  database: process.env.DATABASE_NAME || "ecotrack",
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/migrations/*.js"],
  subscribers: ["dist/subscriber/**/*.js"],
});