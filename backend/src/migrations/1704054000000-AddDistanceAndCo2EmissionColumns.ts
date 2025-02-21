import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDistanceAndCo2EmissionColumns1704054000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add distance column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'journeys' AND column_name = 'distance'
        ) THEN 
          ALTER TABLE "journeys" 
          ADD COLUMN "distance" double precision;
        END IF;
      END $$;
    `);

    // Add co2_emission column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'journeys' AND column_name = 'co2_emission'
        ) THEN 
          ALTER TABLE "journeys" 
          ADD COLUMN "co2_emission" double precision;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove co2_emission column if it exists
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'journeys' AND column_name = 'co2_emission'
        ) THEN 
          ALTER TABLE "journeys" 
          DROP COLUMN "co2_emission";
        END IF;
      END $$;
    `);

    // Remove distance column if it exists
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'journeys' AND column_name = 'distance'
        ) THEN 
          ALTER TABLE "journeys" 
          DROP COLUMN "distance";
        END IF;
      END $$;
    `);
  }
}
