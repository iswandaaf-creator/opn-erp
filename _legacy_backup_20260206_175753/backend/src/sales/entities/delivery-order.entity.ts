import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('delivery_orders')
export class DeliveryOrder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    deliveryNumber: string; // DO-YYYYMMDD-XXXX

    @Column()
    salesOrderId: string;

    @Column({ nullable: true })
    trackingNumber: string;

    @Column({ nullable: true })
    driverName: string;

    @Column({ type: 'date' })
    shippingDate: Date;

    @Column({
        type: 'simple-enum',
        enum: ['DRAFT', 'SHIPPED', 'DELIVERED', 'RETURNED'],
        default: 'DRAFT'
    })
    status: string;

    @Column('jsonb', { nullable: true })
    items: any[]; // Items shipped

    @Column({ type: 'text', nullable: true })
    shippingAddress: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
