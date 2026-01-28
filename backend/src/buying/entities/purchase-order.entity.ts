import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';

@Entity('purchase_orders')
export class PurchaseOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Supplier)
    supplier: Supplier;

    @Column({ default: 'DRAFT' })
    status: string; // DRAFT, ORDERED, RECEIVED, CANCELLED

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    totalAmount: number;

    @OneToMany(() => PurchaseOrderItem, (item) => item.purchaseOrder, { cascade: true })
    items: PurchaseOrderItem[];

    @CreateDateColumn()
    createdAt: Date;
}
