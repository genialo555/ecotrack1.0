// src/server/config/database.config.ts
export const databaseConfig = {
  type: 'postgres' as const,
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'ecotrack_user',
  password: process.env.DATABASE_PASSWORD || '1994',
  database: process.env.DATABASE_NAME || 'ecotrack',
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: false, // Changé à false
  logging: true,
};