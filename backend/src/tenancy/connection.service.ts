import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.REQUEST })
export class ConnectionService {
    private _tenantConnection: DataSource;

    constructor(
        @Inject(REQUEST) private request: Request,
        private dataSource: DataSource,
        private configService: ConfigService,
    ) { }

    async getTenantConnection(): Promise<DataSource> {
        if (this._tenantConnection) {
            return this._tenantConnection;
        }

        const dbType = this.configService.get('DB_TYPE');
        if (dbType === 'sqlite') {
            // SQLite doesn't support schemas like Postgres. Use shared DB for dev/audit.
            return this.dataSource;
        }

        const tenantId = this.request['tenantId'];
        const schemaName = tenantId === 'public' ? 'public' : `tenant_${tenantId}`; // e.g., tenant_pt_maju_jaya

        // We reuse the main connection but switch schema context if possible, 
        // OR create a new connection for full isolation (safer for multi-tenant).
        // For this blueprint, we use a new connection per request logic (cached) or schema search path.
        // OPTIMIZATION: In Postgres, we can just set search_path.

        // APPROACH: Create a new QueryRunner or utilize schema search path.
        // Simpler Approach for MVP: Create a new DataSource with specific schema.

        // Note: Creating a new datasource object for every request is heavy.
        // In production, we should cache these datasources in a Map<TenantID, DataSource>.
        // For now, simpler implementation:

        const dbConfig = this.configService.get('database');

        const tenantDataSource = new DataSource({
            type: 'postgres',
            host: dbConfig.host,
            port: dbConfig.port,
            username: dbConfig.username,
            password: dbConfig.password,
            database: dbConfig.database,
            schema: schemaName, // <--- MAGIC: Point to specific schema
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: false, // Never auto-sync tenant schemas in prod!
        });

        this._tenantConnection = await tenantDataSource.initialize();

        // Set search path explicitly to ensure isolation
        await this._tenantConnection.query(`SET search_path TO ${schemaName}, public`);

        return this._tenantConnection;
    }
}
