import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Department } from './entities/department.entity';
import { AttendanceLog } from './entities/attendance-log.entity';
import { EmployeesService } from './employees.service';
import { AttendanceService } from './attendance.service';
import { HrController } from './hr.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Employee, Department, AttendanceLog])],
    controllers: [HrController],
    providers: [EmployeesService, AttendanceService],
})
export class HrModule { }
