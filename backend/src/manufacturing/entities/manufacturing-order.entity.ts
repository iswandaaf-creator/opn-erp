import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantAwareEntity } from '../../tenancy/tenant-aware.entity';
import { Bom } from './bom.entity';
import { Product } from '../../inventory/entities/product.entity';

export enum MoState {
    DRAFT = 'DRAFT',
    CONFIRMED = 'CONFIRMED',
    DONE = 'DONE',
    CANCELLED = 'CANCELLED',
}

@Entity('manufacturing_orders')
export class ManufacturingOrder extends TenantAwareEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Bom)
    @JoinColumn({ name: 'bom_id' })
    bom: Bom;

    @Column()
    bom_id: number;

    @Column('decimal', { precision: 10, scale: 2 })
    quantity_to_produce: number;

    @Column({
        type: 'simple-enum',
        enum: MoState,
        default: MoState.DRAFT,
    })
    state: MoState;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product; // Copied from BOM for ease

    @Column()
    product_id: number;
}
