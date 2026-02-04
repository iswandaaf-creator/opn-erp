import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

export enum GoodsReceiptStatus {
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    REJECTED = 'REJECTED',
}

@Entity('goods_receipts')
export class GoodsReceipt {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    workOrderId: string; // Link to the Work Order that produced this

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: number;

    @Column('int')
    quantity: number;

    @Column({
        type: 'simple-enum',
        enum: GoodsReceiptStatus,
        default: GoodsReceiptStatus.PENDING,
    })
    status: GoodsReceiptStatus;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'receivedById' })
    receivedBy: User;

    @Column({ nullable: true })
    receivedById: string;

    @CreateDateColumn()
    createdAt: Date;
}
