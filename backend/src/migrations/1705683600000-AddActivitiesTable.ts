import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActivitiesTable1705683600000 implements MigrationInterface {
    name = 'AddActivitiesTable1705683600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "activities" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type" character varying NOT NULL,
                "action" character varying NOT NULL,
                "details" jsonb NOT NULL,
                "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid NOT NULL,
                CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "activities"
            ADD CONSTRAINT "FK_activities_users"
            FOREIGN KEY ("user_id")
            REFERENCES "users"("id")
            ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "activities" DROP CONSTRAINT "FK_activities_users"
        `);
        await queryRunner.query(`
            DROP TABLE "activities"
        `);
    }
}
