import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TenantAwareEntity } from '../../tenancy/tenant-aware.entity';

export enum MarketplacePlatform {
    SHOPEE = 'SHOPEE',
    TOKOPEDIA = 'TOKOPEDIA',
    TIKTOK = 'TIKTOK',
}

@Entity('marketplace_accounts')
export class MarketplaceAccount extends TenantAwareEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'simple-enum',
        enum: MarketplacePlatform,
    })
    platform: MarketplacePlatform;

    @Column()
    shop_name: string;

    @Column({ type: 'text', nullable: true })
    access_token: string;

    @Column({ type: 'text', nullable: true })
    refresh_token: string;

    @Column({ type: 'datetime', nullable: true })
    last_sync: Date;

    @Column({ default: true })
    is_active: boolean;
}
