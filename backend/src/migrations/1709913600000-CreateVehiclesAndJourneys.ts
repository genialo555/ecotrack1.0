import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVehiclesAndJourneys1709913600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create vehicles table
    await queryRunner.query(`
      CREATE TABLE "vehicles" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "brand" varchar NOT NULL,
        "model" varchar NOT NULL,
        "year" integer NOT NULL,
        "co2_per_km" float NOT NULL,
        "user_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "metadata" jsonb,
        CONSTRAINT "fk_vehicle_user" FOREIGN KEY ("user_id") 
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create journeys table
    await queryRunner.query(`
      CREATE TABLE "journeys" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" varchar,
        "description" varchar,
        "user_id" uuid NOT NULL,
        "vehicle_id" uuid,
        "start_latitude" float,
        "start_longitude" float,
        "end_latitude" float,
        "end_longitude" float,
        "distance_km" float,
        "co2_emissions" float,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "metadata" jsonb,
        CONSTRAINT "fk_journey_user" FOREIGN KEY ("user_id") 
          REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_journey_vehicle" FOREIGN KEY ("vehicle_id") 
          REFERENCES "vehicles"("id") ON DELETE SET NULL
      )
    `);

    // Add indexes
    await queryRunner.query(`
      CREATE INDEX "idx_vehicle_user" ON "vehicles"("user_id");
      CREATE INDEX "idx_journey_user" ON "journeys"("user_id");
      CREATE INDEX "idx_journey_vehicle" ON "journeys"("vehicle_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "journeys" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vehicles" CASCADE`);
  }
} 