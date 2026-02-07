import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum MaterialRequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    FULFILLED = 'FULFILLED',
}

@Entity('material_requests')
export class MaterialRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    workOrderId: string; // Optional link to a specific Work Order

    @Column({
        type: 'simple-enum',
        enum: MaterialRequestStatus,
        default: MaterialRequestStatus.PENDING,
    })
    status: MaterialRequestStatus;

    @Column('jsonb', { nullable: true })
    items: { productId: number; quantity: number }[]; // Simplified list of requested items

    @ManyToOne(() => User)
    @JoinColumn({ name: 'requestedById' })
    requestedBy: User;

    @Column({ nullable: true })
    requestedById: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'approvedById' })
    approvedBy: User;

    @Column({ nullable: true })
    approvedById: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
