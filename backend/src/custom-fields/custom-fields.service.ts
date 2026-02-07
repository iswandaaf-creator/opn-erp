import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomFieldDefinition } from './entities/custom-field-definition.entity';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { ConnectionService } from '../tenancy/connection.service';

@Injectable()
export class CustomFieldsService {
    constructor(private connectionService: ConnectionService) { }

    private async getRepo(): Promise<Repository<CustomFieldDefinition>> {
        const connection = await this.connectionService.getTenantConnection();
        return connection.getRepository(CustomFieldDefinition);
    }

    async create(createCustomFieldDto: CreateCustomFieldDto) {
        const repo = await this.getRepo();
        // Validate: field_name should be snake_case
        const definition = repo.create(createCustomFieldDto);
        return repo.save(definition);
    }

    async findAll(entityType: string) {
        const repo = await this.getRepo();
        return repo.find({ where: { entity_type: entityType } });
    }

    async findAllByEntity() {
        const repo = await this.getRepo();
        return repo.find();
    }
}
