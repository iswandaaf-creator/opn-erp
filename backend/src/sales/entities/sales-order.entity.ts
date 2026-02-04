import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sales_orders')
export class SalesOrder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    orderNumber: string; // SO-YYYYMMDD-XXXX

    @Column({ nullable: true })
    quotationId: string; // Link to Quotation

    @Column()
    customerName: string;

    @Column({ type: 'date' })
    orderDate: Date;

    @Column({ type: 'date', nullable: true })
    deliveryDate: Date;

    @Column({
        type: 'simple-enum',
        enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    })
    status: string;

    @Column('decimal', { precision: 12, scale: 2 })
    totalAmount: number;

    @Column('jsonb', { nullable: true })
    items: any[]; // [{ productId, description, quantity, unitPrice, total }]

    @Column({ type: 'text', nullable: true })
    shippingAddress: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
