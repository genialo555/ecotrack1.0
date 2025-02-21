import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVehicleTypeColumn1704054200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add type column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'vehicles' AND column_name = 'type'
        ) THEN 
          ALTER TABLE "vehicles" 
          ADD COLUMN "type" varchar(50);
        END IF;
      END $$;
    `);

    // Add brand column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'vehicles' AND column_name = 'brand'
        ) THEN 
          ALTER TABLE "vehicles" 
          ADD COLUMN "brand" varchar(50);
        END IF;
      END $$;
    `);

    // Add model column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'vehicles' AND column_name = 'model'
        ) THEN 
          ALTER TABLE "vehicles" 
          ADD COLUMN "model" varchar(50);
        END IF;
      END $$;
    `);

    // Add co2_rate column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'vehicles' AND column_name = 'co2_rate'
        ) THEN 
          ALTER TABLE "vehicles" 
          ADD COLUMN "co2_rate" numeric(5,2);
        END IF;
      END $$;
    `);

    // Add is_active column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'vehicles' AND column_name = 'is_active'
        ) THEN 
          ALTER TABLE "vehicles" 
          ADD COLUMN "is_active" boolean DEFAULT true;
        END IF;
      END $$;
    `);

    // Add specs column if it doesn't exist
    await queryRunner.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'vehicles' AND column_name = 'specs'
        ) THEN 
          ALTER TABLE "vehicles" 
          ADD COLUMN "specs" jsonb;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove columns in reverse order
    const columns = [
      'specs',
      'is_active',
      'co2_rate',
      'model',
      'brand',
      'type'
    ];

    for (const column of columns) {
      await queryRunner.query(`
        DO $$ 
        BEGIN 
          IF EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'vehicles' AND column_name = '${column}'
          ) THEN 
            ALTER TABLE "vehicles" 
            DROP COLUMN "${column}";
          END IF;
        END $$;
      `);
    }
  }
}
