import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TransactionItem } from './transaction-item.entity';

export enum PaymentMethod {
    CASH = 'CASH',
    QRIS = 'QRIS',
    TRANSFER = 'TRANSFER',
    CARD = 'CARD',
}

@Entity('sales_transactions')
export class SalesTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    invoice_number: string; // INV-YYYYMMDD-XXXX

    @Column('decimal', { precision: 15, scale: 2 })
    total_amount: number;

    @Column({
        type: 'simple-enum',
        enum: PaymentMethod,
        default: PaymentMethod.CASH,
    })
    payment_method: PaymentMethod;

    @Column({ type: 'text', nullable: true })
    cashier_id: string | null; // User ID of cashier

    @Column({ type: 'text', nullable: true })
    customer_name: string | null; // Optional for quick POS

    @OneToMany(() => TransactionItem, (item: TransactionItem) => item.transaction, { cascade: true })
    items: TransactionItem[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
