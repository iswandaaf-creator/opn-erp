import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { ConnectionService } from '../tenancy/connection.service';
import { Department } from './entities/department.entity';

@Injectable()
export class EmployeesService {
    constructor(private connectionService: ConnectionService) { }

    private async getRepo(): Promise<Repository<Employee>> {
        const connection = await this.connectionService.getTenantConnection();
        return connection.getRepository(Employee);
    }

    async create(createEmployeeDto: CreateEmployeeDto) {
        const repo = await this.getRepo();
        // In real app, we need to fetch User and Department entities to link them
        // For now, we assume simple linking by ID if TypeORM supports it, or we fetch them.
        // Simplifying:
        const employee = repo.create({
            ...createEmployeeDto,
            user: { id: createEmployeeDto.user_id } as any,
            department: { id: createEmployeeDto.department_id } as any,
        });
        return repo.save(employee);
    }

    async findAll() {
        const repo = await this.getRepo();
        return repo.find({ relations: ['user', 'department'] });
    }

    async findOneByUserId(userId: string) {
        const repo = await this.getRepo();
        return repo.findOne({ where: { user: { id: userId } }, relations: ['department'] });
    }
}
