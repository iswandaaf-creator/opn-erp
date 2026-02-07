import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SalesTransaction } from './sales-transaction.entity';
import { Product } from '../../inventory/entities/product.entity';

@Entity('transaction_items')
export class TransactionItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => SalesTransaction, (transaction) => transaction.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'transaction_id' })
    transaction: SalesTransaction;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column('decimal', { precision: 10, scale: 2 })
    quantity: number;

    @Column('decimal', { precision: 15, scale: 2 })
    unit_price: number; // Price at time of sale

    @Column('decimal', { precision: 15, scale: 2 })
    subtotal: number;
}
