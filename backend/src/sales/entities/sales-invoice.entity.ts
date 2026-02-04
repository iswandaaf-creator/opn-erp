import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sales_invoices')
export class SalesInvoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    salesOrderId: string; // Link to Order

    @Column()
    customerName: string;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    paidAmount: number;

    @Column({ type: 'date' })
    dueDate: Date;

    @Column({
        type: 'simple-enum',
        enum: ['UNPAID', 'PARTIAL', 'PAID', 'OVERDUE'],
        default: 'UNPAID'
    })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
