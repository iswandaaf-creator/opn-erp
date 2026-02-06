import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class InitialSchema1707200000000 implements MigrationInterface {
    name = 'InitialSchema1707200000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create companies table
        await queryRunner.createTable(
            new Table({
                name: 'companies',
                columns: [
                    { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
                    { name: 'name', type: 'varchar', isNullable: false },
                    { name: 'address', type: 'varchar', isNullable: true },
                    { name: 'phone', type: 'varchar', isNullable: true },
                    { name: 'email', type: 'varchar', isNullable: true },
                    { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                ],
            }),
            true,
        );

        // Create users table
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
                    { name: 'email', type: 'varchar', isUnique: true, isNullable: false },
                    { name: 'passwordHash', type: 'varchar', isNullable: false },
                    { name: 'fullName', type: 'varchar', isNullable: false },
                    { name: 'nip', type: 'varchar', isUnique: true, isNullable: true },
                    { name: 'role', type: 'varchar', default: "'USER'" },
                    { name: 'isActive', type: 'boolean', default: true },
                    { name: 'isEmailVerified', type: 'boolean', default: false },
                    { name: 'emailVerificationToken', type: 'varchar', isNullable: true },
                    { name: 'companyId', type: 'uuid', isNullable: true },
                    { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                ],
                foreignKeys: [
                    {
                        columnNames: ['companyId'],
                        referencedTableName: 'companies',
                        referencedColumnNames: ['id'],
                        onDelete: 'SET NULL',
                    },
                ],
            }),
            true,
        );

        // Create indexes for users table
        await queryRunner.createIndex('users', new TableIndex({ name: 'IDX_USERS_EMAIL', columnNames: ['email'] }));
        await queryRunner.createIndex('users', new TableIndex({ name: 'IDX_USERS_ROLE', columnNames: ['role'] }));
        await queryRunner.createIndex('users', new TableIndex({ name: 'IDX_USERS_COMPANY', columnNames: ['companyId'] }));
        await queryRunner.createIndex('users', new TableIndex({ name: 'IDX_USERS_ACTIVE', columnNames: ['isActive'] }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
        await queryRunner.dropTable('companies');
    }
}
