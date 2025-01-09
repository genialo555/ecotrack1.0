import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJourneyColumns1703765000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ajouter les colonnes nécessaires
        await queryRunner.query(`
            ALTER TABLE "journeys" 
            ADD COLUMN IF NOT EXISTS "user_id" UUID,
            ADD COLUMN IF NOT EXISTS "vehicle_id" UUID,
            ADD CONSTRAINT "FK_journeys_user" 
            FOREIGN KEY ("user_id") 
            REFERENCES "users"("id") 
            ON DELETE CASCADE,
            ADD CONSTRAINT "FK_journeys_vehicle" 
            FOREIGN KEY ("vehicle_id") 
            REFERENCES "vehicles"("id") 
            ON DELETE SET NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Supprimer les contraintes et colonnes
        await queryRunner.query(`
            ALTER TABLE "journeys" 
            DROP CONSTRAINT IF EXISTS "FK_journeys_user",
            DROP CONSTRAINT IF EXISTS "FK_journeys_vehicle",
            DROP COLUMN IF EXISTS "user_id",
            DROP COLUMN IF EXISTS "vehicle_id"
        `);
    }
}