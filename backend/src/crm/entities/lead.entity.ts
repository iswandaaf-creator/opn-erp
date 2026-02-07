import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TenantAwareEntity } from '../../tenancy/tenant-aware.entity';

export enum LeadStage {
    NEW = 'NEW',
    QUALIFIED = 'QUALIFIED',
    PROPOSITION = 'PROPOSITION',
    WON = 'WON',
    LOST = 'LOST',
}

@Entity('crm_leads')
export class CrmLead extends TenantAwareEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string; // e.g. "Project Laptop Procurement"

    @Column()
    contact_name: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    expected_revenue: number;

    @Column({
        type: 'simple-enum',
        enum: LeadStage,
        default: LeadStage.NEW,
    })
    stage: LeadStage;

    @Column({ default: 0 })
    probability: number; // 0-100

    @Column({ nullable: true })
    salesperson_id: string; // User ID
}
