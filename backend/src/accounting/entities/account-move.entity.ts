import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { TenantAwareEntity } from '../../tenancy/tenant-aware.entity';
import { AccountMoveLine } from './account-move-line.entity';

export enum MoveState {
    DRAFT = 'DRAFT',
    POSTED = 'POSTED',
    CANCELLED = 'CANCELLED',
}

@Entity('account_moves')
export class AccountMove extends TenantAwareEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date' })
    date: string;

    @Column({ nullable: true })
    ref: string; // E.g., INV/2024/001, POS/2024/005

    @Column({
        type: 'simple-enum',
        enum: MoveState,
        default: MoveState.DRAFT,
    })
    state: MoveState;

    @OneToMany(() => AccountMoveLine, (line) => line.move, { cascade: true })
    lines: AccountMoveLine[];
}
