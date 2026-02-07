import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { TenantAwareEntity } from '../../tenancy/tenant-aware.entity';
import { Product } from '../../inventory/entities/product.entity';
import { BomLine } from './bom-line.entity';

@Entity('boms')
export class Bom extends TenantAwareEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    product_id: number;

    @Column('decimal', { precision: 10, scale: 2, default: 1 })
    quantity: number; // Output quantity (e.g. 1 Bundle)

    @OneToMany(() => BomLine, (line) => line.bom, { cascade: true })
    lines: BomLine[];

    @Column({ default: true })
    is_active: boolean;
}
