import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService {
    constructor(
        @InjectRepository(Tenant)
        private tenantsRepository: Repository<Tenant>,
        private dataSource: DataSource,
    ) { }

    async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
        // 1. Generate Schema Name (sanitize company name)
        const schemaName = 'tenant_' + createTenantDto.company_name.toLowerCase().replace(/[^a-z0-9]/g, '_');

        // 2. Save Tenant to Public Schema
        const tenant = this.tenantsRepository.create({
            ...createTenantDto,
            schema_name: schemaName,
        });
        const savedTenant = await this.tenantsRepository.save(tenant);

        // 3. Create Schema in Database
        await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

        // 4. Run Migrations / Sync Schema for the new Tenant
        // This is crucial. We need to create tables INSIDE the new schema.
        // For now, we will assume the ConnectionService will handle table creation 
        // when the first request comes in with sync=true, OR we can force it here.
        // Ideally, we run a migration script here.

        return savedTenant;
    }

    findAll() {
        return this.tenantsRepository.find();
    }
}
