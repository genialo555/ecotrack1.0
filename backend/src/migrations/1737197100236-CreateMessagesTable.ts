import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMessagesTable1737197100236 implements MigrationInterface {
    name = 'CreateMessagesTable1737197100236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop existing tables if they exist
        await queryRunner.query(`DROP TABLE IF EXISTS "message_attachments"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "messages"`);

        // Create messages table
        await queryRunner.query(`
            CREATE TABLE "messages" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(100) NOT NULL,
                "content" text NOT NULL,
                "is_read" boolean NOT NULL DEFAULT false,
                "sender_id" uuid NOT NULL,
                "recipient_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "pk_messages" PRIMARY KEY ("id"),
                CONSTRAINT "chk_title_length" CHECK (length(title) <= 100),
                CONSTRAINT "chk_content_length" CHECK (length(content) <= 2000)
            )
        `);

        // Create message_attachments table
        await queryRunner.query(`
            CREATE TABLE "message_attachments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "filename" character varying NOT NULL,
                "original_filename" character varying NOT NULL,
                "mime_type" character varying NOT NULL,
                "file_size" integer NOT NULL,
                "file_path" character varying NOT NULL,
                "message_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "pk_message_attachments" PRIMARY KEY ("id"),
                CONSTRAINT "chk_file_size" CHECK (file_size <= 5242880),
                CONSTRAINT "fk_message_attachments_message" FOREIGN KEY ("message_id") 
                    REFERENCES "messages"("id") ON DELETE CASCADE
            )
        `);

        // Add foreign key constraints for user references
        await queryRunner.query(`
            ALTER TABLE "messages" 
            ADD CONSTRAINT "fk_messages_sender" 
            FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "messages" 
            ADD CONSTRAINT "fk_messages_recipient" 
            FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "message_attachments"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "messages"`);
    }
}
