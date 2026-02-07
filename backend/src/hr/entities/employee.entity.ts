import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Department } from './department.entity';

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ unique: true })
    nik: string; // Employee ID Number

    @Column()
    full_name: string;

    @ManyToOne(() => Department)
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @Column({ type: 'date' })
    join_date: Date;

    @Column('decimal', { precision: 15, scale: 2 })
    salary_base: number;

    @Column('simple-json')
    custom_attributes: Record<string, any> = {}; // For "Shoe Size", "Blood Type" etc

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
