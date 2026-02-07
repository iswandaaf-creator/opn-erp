import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('attendance_logs')
export class AttendanceLog {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Employee)
    @JoinColumn({ name: 'employee_id' })
    employee: Employee;

    @Column({ type: 'date' })
    date: Date; // date part only

    @Column({ type: 'datetime', nullable: true })
    clock_in_time: Date;

    @Column({ type: 'datetime', nullable: true })
    clock_out_time: Date;

    @Column({ nullable: true })
    clock_in_image_url: string; // Selfie URL

    @Column({ nullable: true })
    clock_out_image_url: string;

    // Storing location as JSON for simplicity in MVP (lat, lng)
    // Replacing PostGIS 'GEOMETRY' to ensure compatibility with standard postgres images
    @Column('simple-json', { nullable: true })
    clock_in_location: { lat: number; lng: number };

    @Column('simple-json', { nullable: true })
    clock_out_location: { lat: number; lng: number };

    @Column({ default: 'PENDING' })
    status: string; // ON_TIME, LATE, OVERTIME, PENDING

    @Column({ nullable: true })
    device_info: string;

    @CreateDateColumn()
    created_at: Date;
}
