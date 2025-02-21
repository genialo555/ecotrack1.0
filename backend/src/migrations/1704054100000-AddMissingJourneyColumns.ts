import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingJourneyColumns1704054100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add route_data column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'journeys' AND column_name = 'route_data'
        ) THEN 
          ALTER TABLE "journeys" 
          ADD COLUMN "route_data" jsonb;
        END IF;
      END $$;
    `);

    // Add distance_km column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'journeys' AND column_name = 'distance_km'
        ) THEN 
          ALTER TABLE "journeys" 
          ADD COLUMN "distance_km" double precision;
        END IF;
      END $$;
    `);

    // Add co2_emissions column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'journeys' AND column_name = 'co2_emissions'
        ) THEN 
          ALTER TABLE "journeys" 
          ADD COLUMN "co2_emissions" double precision;
        END IF;
      END $$;
    `);

    // Add status column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'journeys' AND column_name = 'status'
        ) THEN 
          ALTER TABLE "journeys" 
          ADD COLUMN "status" varchar(50) DEFAULT 'planned';
        END IF;
      END $$;
    `);

    // Add transport_mode column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'journeys' AND column_name = 'transport_mode'
        ) THEN 
          ALTER TABLE "journeys" 
          ADD COLUMN "transport_mode" varchar(50) DEFAULT 'car';
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove columns in reverse order
    const columns = [
      'transport_mode',
      'status',
      'co2_emissions',
      'distance_km',
      'route_data'
    ];

    for (const column of columns) {
      await queryRunner.query(`
        DO $$ 
        BEGIN 
          IF EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'journeys' AND column_name = '${column}'
          ) THEN 
            ALTER TABLE "journeys" 
            DROP COLUMN "${column}";
          END IF;
        END $$;
      `);
    }
  }
}
