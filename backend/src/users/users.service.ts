import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConnectionService } from '../tenancy/connection.service';

@Injectable()
export class UsersService {
    constructor(private connectionService: ConnectionService) { }

    private async getRepo(): Promise<Repository<User>> {
        const connection = await this.connectionService.getTenantConnection();
        return connection.getRepository(User);
    }

    async create(createUserDto: CreateUserDto) {
        const repo = await this.getRepo();
        const user = repo.create(createUserDto);
        return repo.save(user);
    }

    async findAll() {
        const repo = await this.getRepo();
        return repo.find({ relations: ['role'] });
    }

    async findOne(username: string) {
        const repo = await this.getRepo();
        return repo.findOne({ where: { username }, relations: ['role'] });
    }
}
