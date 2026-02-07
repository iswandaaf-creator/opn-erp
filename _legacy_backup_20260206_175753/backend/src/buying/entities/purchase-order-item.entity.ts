import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('purchase_order_items')
export class PurchaseOrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PurchaseOrder, (po) => po.items)
    purchaseOrder: PurchaseOrder;

    @ManyToOne(() => Product)
    product: Product;

    @Column()
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    unitCost: number;
}
