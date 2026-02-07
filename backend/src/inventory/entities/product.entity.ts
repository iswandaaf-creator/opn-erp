import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    sku: string;

    @Column({ unique: true, nullable: true })
    barcode: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    purchase_price: number;

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    selling_price: number;

    @Column({ default: 10 })
    stock_alert_limit: number;

    @Column({ default: 'Pcs' })
    unit: string;

    @Column({ nullable: true })
    image_url: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
