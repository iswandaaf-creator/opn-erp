import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantAwareEntity } from '../../tenancy/tenant-aware.entity';
import { AccountMove } from './account-move.entity';
import { ChartOfAccount } from './chart-of-account.entity';

@Entity('account_move_lines')
export class AccountMoveLine extends TenantAwareEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => AccountMove, (move) => move.lines, { onDelete: 'CASCADE' })
    move: AccountMove;

    @ManyToOne(() => ChartOfAccount)
    @JoinColumn({ name: 'account_id' })
    account: ChartOfAccount;

    @Column({ nullable: true })
    account_id: number;

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    debit: number;

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    credit: number;

    @Column({ nullable: true })
    partner_id: number; // Can link to Supplier/Customer ID later

    @Column({ nullable: true })
    name: string; // Description/Label
}
