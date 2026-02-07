import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fullName: string;

    @Column()
    position: string; // e.g., Manager, Cashier, Chef

    @Column({ unique: true })
    email: string;

    @Column()
    phone: string;

    @Column('decimal', { precision: 10, scale: 2 })
    salary: number;

    @Column({ type: 'date' })
    joinDate: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
