import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantAwareEntity } from '../../tenancy/tenant-aware.entity';
import { MarketplaceAccount } from './marketplace-account.entity';
import { Product } from '../../inventory/entities/product.entity';

@Entity('product_mappings')
export class ProductMapping extends TenantAwareEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => MarketplaceAccount)
    @JoinColumn({ name: 'marketplace_account_id' })
    marketplace_account: MarketplaceAccount;

    @Column()
    marketplace_account_id: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'erp_product_id' })
    product: Product;

    @Column()
    erp_product_id: number;

    @Column()
    marketplace_sku: string;

    @Column({ nullable: true })
    marketplace_product_id: string; // ID from the platform (e.g. 12345678)
}
