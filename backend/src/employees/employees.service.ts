import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private employeesRepository: Repository<Employee>,
    ) { }

    create(createEmployeeDto: any) {
        const employee = this.employeesRepository.create(createEmployeeDto);
        return this.employeesRepository.save(employee);
    }

    findAll() {
        return this.employeesRepository.find();
    }

    findOne(id: string) {
        return this.employeesRepository.findOneBy({ id });
    }

    update(id: string, updateEmployeeDto: any) {
        return this.employeesRepository.update(id, updateEmployeeDto);
    }

    remove(id: string) {
        return this.employeesRepository.delete(id);
    }
}
