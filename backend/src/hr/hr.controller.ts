import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { AttendanceService } from './attendance.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { ClockInDto } from './dto/clock-in.dto';

@Controller('hr')
export class HrController {
    constructor(
        private readonly employeesService: EmployeesService,
        private readonly attendanceService: AttendanceService,
    ) { }

    @Post('employees')
    createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.employeesService.create(createEmployeeDto);
    }

    @Get('employees')
    findAllEmployees() {
        return this.employeesService.findAll();
    }

    @Post('attendance/clock-in')
    clockIn(@Body() clockInDto: ClockInDto) {
        return this.attendanceService.clockIn(clockInDto);
    }
}
