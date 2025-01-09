/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1735386463710 implements MigrationInterface {
    name = 'Migrations1735386463710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "journeys" DROP CONSTRAINT "journeys_user_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP CONSTRAINT "journeys_vehicle_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_user_id_fkey"`);
        await queryRunner.query(`DROP INDEX "public"."idx_journeys_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_journeys_vehicle_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_journeys_co2_emissions"`);
        await queryRunner.query(`DROP INDEX "public"."idx_users_email"`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "transport_mode"`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "distance_km"`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "co2_emissions"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_login"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "vehicle_type"`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "distance" double precision`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "co2_emission" double precision`);
        await queryRunner.query(`CREATE TYPE "public"."journeys_status_enum" AS ENUM('planned', 'in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "status" "public"."journeys_status_enum" NOT NULL DEFAULT 'planned'`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "route_data" jsonb`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "specs" jsonb`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "start_location"`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "start_location" jsonb`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "end_location"`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "end_location" jsonb`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "start_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "end_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "users_email_key"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_hash"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password_hash" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "first_name" character varying`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_name" character varying`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "is_active" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "brand"`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "brand" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "model"`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "model" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "co2_rate"`);
        // eslint-disable-next-line prettier/prettier
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "co2_rate" double precision`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD CONSTRAINT "FK_6479cea41ce0ce155e8bbb7c85c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD CONSTRAINT "FK_cbdda1979cbb4990d13c765e90c" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD CONSTRAINT "FK_20f139b9d79f917ef735efacb00" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicles" DROP CONSTRAINT "FK_20f139b9d79f917ef735efacb00"`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP CONSTRAINT "FK_cbdda1979cbb4990d13c765e90c"`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP CONSTRAINT "FK_6479cea41ce0ce155e8bbb7c85c"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "co2_rate"`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "co2_rate" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "model"`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "model" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "brand"`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "brand" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "is_active" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying(20) DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "first_name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_hash"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password_hash" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "users_email_key" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "end_time" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "start_time" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "end_location"`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "end_location" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "start_location"`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "start_location" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "specs"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "route_data"`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."journeys_status_enum"`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "co2_emission"`);
        await queryRunner.query(`ALTER TABLE "journeys" DROP COLUMN "distance"`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "vehicle_type" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_login" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "co2_emissions" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "distance_km" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD "transport_mode" character varying(50) NOT NULL DEFAULT 'car'`);
        await queryRunner.query(`CREATE INDEX "idx_users_email" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "idx_journeys_co2_emissions" ON "journeys" ("co2_emissions") `);
        await queryRunner.query(`CREATE INDEX "idx_journeys_vehicle_id" ON "journeys" ("vehicle_id") `);
        await queryRunner.query(`CREATE INDEX "idx_journeys_user_id" ON "journeys" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD CONSTRAINT "journeys_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "journeys" ADD CONSTRAINT "journeys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}