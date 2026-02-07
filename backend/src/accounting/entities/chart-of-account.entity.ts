import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TenantAwareEntity } from '../../tenancy/tenant-aware.entity';

export enum AccountType {
    ASSET = 'ASSET',
    LIABILITY = 'LIABILITY',
    EQUITY = 'EQUITY',
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
}

@Entity('chart_of_accounts')
export class ChartOfAccount extends TenantAwareEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column({
        type: 'simple-enum',
        enum: AccountType,
    })
    type: AccountType;

    @Column({ default: true })
    is_active: boolean;
}
