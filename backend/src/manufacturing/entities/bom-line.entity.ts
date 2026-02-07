import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantAwareEntity } from '../../tenancy/tenant-aware.entity';
import { Bom } from './bom.entity';
import { Product } from '../../inventory/entities/product.entity';

@Entity('bom_lines')
export class BomLine extends TenantAwareEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Bom, (bom) => bom.lines, { onDelete: 'CASCADE' })
    bom: Bom;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'component_id' })
    component: Product; // Input Material

    @Column()
    component_id: number;

    @Column('decimal', { precision: 10, scale: 2 })
    quantity: number; // Required Qty per BOM Qty
}
