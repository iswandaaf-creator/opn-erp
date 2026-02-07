import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: 'PENDING' }) // PENDING, IN_PROGRESS, COMPLETED
    status: string;

    @Column({ nullable: true })
    orderId: number;

    @Column({ nullable: true })
    assignedTo: string;

    @CreateDateColumn()
    createdAt: Date;
}
