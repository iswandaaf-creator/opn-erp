import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AttendanceLog } from './entities/attendance-log.entity';
import { ClockInDto } from './dto/clock-in.dto';
import { ConnectionService } from '../tenancy/connection.service';

@Injectable()
export class AttendanceService {
    constructor(private connectionService: ConnectionService) { }

    private async getRepo(): Promise<Repository<AttendanceLog>> {
        const connection = await this.connectionService.getTenantConnection();
        return connection.getRepository(AttendanceLog);
    }

    async clockIn(clockInDto: ClockInDto) {
        const repo = await this.getRepo();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already clocked in
        const existing = await repo.findOne({
            where: {
                employee: { id: clockInDto.employee_id },
                date: today,
            }
        });

        if (existing) {
            throw new BadRequestException('Already clocked in for today');
        }

        const log = repo.create({
            employee: { id: clockInDto.employee_id } as any,
            date: today,
            clock_in_time: new Date(),
            clock_in_image_url: clockInDto.image_url,
            clock_in_location: { lat: clockInDto.latitude, lng: clockInDto.longitude },
            device_info: clockInDto.device_info,
            status: 'PENDING'
        });

        return repo.save(log);
    }
}
