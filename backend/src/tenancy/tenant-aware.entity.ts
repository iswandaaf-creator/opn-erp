import { BaseEntity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class TenantAwareEntity extends BaseEntity {
    @Column({ name: 'tenant_id', nullable: true }) // Nullable for super admin / public
    tenant_id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
