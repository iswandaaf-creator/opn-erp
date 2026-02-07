import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Warehouse } from './warehouse.entity';

export enum StockTransactionType {
    IN = 'IN',
    OUT = 'OUT',
}

@Entity('stock_ledger')
export class StockLedger {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: number;

    @ManyToOne(() => Warehouse, (warehouse) => warehouse.stockLedgers)
    @JoinColumn({ name: 'warehouseId' })
    warehouse: Warehouse;

    @Column()
    warehouseId: number;

    @Column({
        type: 'simple-enum',
        enum: StockTransactionType,
    })
    type: StockTransactionType;

    @Column('int')
    quantity: number;

    @Column({ nullable: true })
    referenceDocId: string; // Links to PO, SO, WO, MaterialRequest, etc.

    @Column({ nullable: true })
    referenceDocType: string; // 'PURCHASE_ORDER', 'SALES_ORDER', 'WORK_ORDER', 'MATERIAL_REQUEST'

    @CreateDateColumn()
    createdAt: Date;
}
