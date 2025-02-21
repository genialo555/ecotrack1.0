import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLocationToUsers1735386463713 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'last_latitude',
        type: 'decimal',
        precision: 10,
        scale: 7,
        isNullable: true,
      }),
      new TableColumn({
        name: 'last_longitude',
        type: 'decimal',
        precision: 10,
        scale: 7,
        isNullable: true,
      }),
      new TableColumn({
        name: 'last_location_update',
        type: 'timestamp',
        isNullable: true,
      }),
    ]);

    // Créer un index pour les requêtes de géolocalisation
    await queryRunner.query(
      'CREATE INDEX "IDX_users_location" ON "users" ("last_latitude", "last_longitude")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_users_location"');
    await queryRunner.dropColumn('users', 'last_location_update');
    await queryRunner.dropColumn('users', 'last_longitude');
    await queryRunner.dropColumn('users', 'last_latitude');
  }
} 