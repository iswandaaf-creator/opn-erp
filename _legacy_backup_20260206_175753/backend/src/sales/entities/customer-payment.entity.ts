import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SalesInvoice } from './sales-invoice.entity';

@Entity('customer_payments')
export class CustomerPayment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => SalesInvoice)
    @JoinColumn({ name: 'invoiceId' })
    invoice: SalesInvoice;

    @Column()
    invoiceId: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    paymentMethod: string; // CASH, BANK_TRANSFER, CHEQUE

    @Column({ nullable: true })
    referenceNumber: string;

    @Column({ type: 'date' })
    paymentDate: Date;

    @CreateDateColumn()
    createdAt: Date;
}
