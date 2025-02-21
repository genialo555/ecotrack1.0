import { MigrationInterface, QueryRunner, TableColumn, Table } from 'typeorm';

export class AddUserLocationTracking1737196636058 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Vérifier si les colonnes existent déjà
        const table = await queryRunner.getTable('users');
        if (!table) {
            throw new Error('Table users not found');
        }

        const columns = table.columns.map(column => column.name);
        const hasLastLatitude = columns.includes('last_latitude');
        const hasLastLongitude = columns.includes('last_longitude');
        const hasLastLocationUpdate = columns.includes('last_location_update');

        if (!hasLastLatitude) {
            await queryRunner.addColumn('users', new TableColumn({
                name: 'last_latitude',
                type: 'decimal',
                precision: 10,
                scale: 7,
                isNullable: true,
            }));
        }

        if (!hasLastLongitude) {
            await queryRunner.addColumn('users', new TableColumn({
                name: 'last_longitude',
                type: 'decimal',
                precision: 10,
                scale: 7,
                isNullable: true,
            }));
        }

        if (!hasLastLocationUpdate) {
            await queryRunner.addColumn('users', new TableColumn({
                name: 'last_location_update',
                type: 'timestamp',
                isNullable: true,
            }));
        }

        // Créer un index pour les requêtes de géolocalisation s'il n'existe pas déjà
        const hasLocationIndex = table.indices.some(index => index.name === 'IDX_users_location');
        if (!hasLocationIndex) {
            await queryRunner.query(
                'CREATE INDEX "IDX_users_location" ON "users" ("last_latitude", "last_longitude")',
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Supprimer l'index s'il existe
        await queryRunner.query('DROP INDEX IF EXISTS "IDX_users_location"');

        // Supprimer les colonnes
        const table = await queryRunner.getTable('users');
        if (!table) {
            return;
        }

        const columns = table.columns.map(column => column.name);
        
        if (columns.includes('last_location_update')) {
            await queryRunner.dropColumn('users', 'last_location_update');
        }

        if (columns.includes('last_longitude')) {
            await queryRunner.dropColumn('users', 'last_longitude');
        }

        if (columns.includes('last_latitude')) {
            await queryRunner.dropColumn('users', 'last_latitude');
        }
    }
}
