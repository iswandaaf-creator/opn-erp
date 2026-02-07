import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * TypeORM DataSource configuration for migrations
 * Usage:
 *   npx typeorm migration:generate -d src/database/data-source.ts src/database/migrations/InitialMigration
 *   npx typeorm migration:run -d src/database/data-source.ts
 */

const isProduction = !!process.env.DATABASE_URL;

const options: DataSourceOptions = isProduction
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/database/migrations/*.js'],
        synchronize: false,
        ssl: { rejectUnauthorized: false },
        logging: false,
    }
    : {
        type: 'sqlite',
        database: 'db.sqlite',
        entities: ['src/**/*.entity.ts'],
        migrations: ['src/database/migrations/*.ts'],
        synchronize: false,
        logging: true,
    };

export const AppDataSource = new DataSource(options);

