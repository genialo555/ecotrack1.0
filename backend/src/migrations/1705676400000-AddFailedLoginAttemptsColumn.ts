import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFailedLoginAttemptsColumn1705676400000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN IF NOT EXISTS "failed_login_attempts" integer DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN IF EXISTS "failed_login_attempts"
        `);
    }
}
