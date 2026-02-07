import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { ConnectionService } from '../tenancy/connection.service';

@Injectable()
export class RolesService {
    constructor(private connectionService: ConnectionService) { }

    private async getRepo(): Promise<Repository<Role>> {
        const connection = await this.connectionService.getTenantConnection();
        return connection.getRepository(Role);
    }

    async create(createRoleDto: CreateRoleDto) {
        const repo = await this.getRepo();
        const role = repo.create(createRoleDto);
        return repo.save(role);
    }

    async findAll() {
        const repo = await this.getRepo();
        return repo.find();
    }

    async findOne(id: number) {
        const repo = await this.getRepo();
        return repo.findOne({ where: { id } });
    }
}
