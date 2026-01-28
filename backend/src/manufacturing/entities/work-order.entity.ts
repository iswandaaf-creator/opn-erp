import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

export enum WorkOrderStatus {
    DRAFT = 'DRAFT',
    PLANNED = 'PLANNED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

@Entity('work_orders')
export class WorkOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: number;

    @Column('float')
    quantity: number;

    @Column({
        type: 'simple-enum',
        enum: WorkOrderStatus,
        default: WorkOrderStatus.DRAFT
    })
    status: WorkOrderStatus;

    @Column({ type: 'datetime', nullable: true })
    startDate: Date;

    @Column({ type: 'datetime', nullable: true })
    endDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
