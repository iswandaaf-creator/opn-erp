import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';

export enum MovementType {
    INBOUND = 'INBOUND', // Pembelian / Terima Barang
    SALES = 'SALES', // Penjualan POS
    ADJUSTMENT = 'ADJUSTMENT', // Stock Opname
    TRANSFER = 'TRANSFER', // Pindah Gudang
}

@Entity('stock_movements')
export class StockMovement {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Warehouse)
    @JoinColumn({ name: 'warehouse_id' })
    warehouse: Warehouse;

    @Column('decimal', { precision: 10, scale: 2 })
    quantity: number; // Positive for IN, Negative for OUT

    @Column({
        type: 'simple-enum',
        enum: MovementType,
    })
    movement_type: MovementType;

    @Column({ nullable: true })
    reference_doc: string; // PO Number, Invoice Number, or Adjustment ID

    @Column({ nullable: true })
    notes: string;

    @Column({ nullable: true })
    created_by_user_id: string; // UUID of user who performed action

    @CreateDateColumn()
    created_at: Date;
}
