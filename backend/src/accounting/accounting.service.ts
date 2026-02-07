import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ChartOfAccount, AccountType } from './entities/chart-of-account.entity';
import { AccountMove, MoveState } from './entities/account-move.entity';
import { AccountMoveLine } from './entities/account-move-line.entity';

@Injectable()
export class AccountingService {
    constructor(
        @InjectRepository(ChartOfAccount)
        private coaRepo: Repository<ChartOfAccount>,
        @InjectRepository(AccountMove)
        private moveRepo: Repository<AccountMove>,
        private dataSource: DataSource,
    ) { }

    // Init Default COA for new tenant
    async initDefaultCOA(tenantId: string) {
        // Simplified COA seeder
        const accounts = [
            { code: '1001', name: 'Cash', type: AccountType.ASSET },
            { code: '1002', name: 'Bank', type: AccountType.ASSET },
            { code: '1200', name: 'Accounts Receivable', type: AccountType.ASSET },
            { code: '1400', name: 'Inventory Asset', type: AccountType.ASSET },
            { code: '2100', name: 'Accounts Payable', type: AccountType.LIABILITY },
            { code: '2200', name: 'Tax Payable', type: AccountType.LIABILITY },
            { code: '4000', name: 'Sales Revenue', type: AccountType.INCOME },
            { code: '5000', name: 'Cost of Goods Sold', type: AccountType.EXPENSE },
        ];

        // Check if exists
        const count = await this.coaRepo.count({ where: { tenant_id: tenantId } as any });
        if (count > 0) return;

        const entities = accounts.map(a => this.coaRepo.create({ ...a, tenant_id: tenantId } as any));
        await this.coaRepo.save(entities as any);
    }

    async createJournalEntry(
        tenantId: string,
        data: { date: string, ref: string, lines: { accountCode: string, debit: number, credit: number, name: string }[] }
    ) {
        // 1. Resolve Account IDs
        const entryLines: Partial<AccountMoveLine>[] = [];
        for (const line of data.lines) {
            const account = await this.coaRepo.findOne({ where: { code: line.accountCode, tenant_id: tenantId } as any });
            if (!account) throw new Error(`Account code ${line.accountCode} not found for tenant ${tenantId}`);

            entryLines.push({
                account: account,
                debit: line.debit,
                credit: line.credit,
                name: line.name,
                tenant_id: tenantId
            } as any);
        }

        // 2. Validate Balance
        const totalDebit = entryLines.reduce((sum, l) => sum + Number(l.debit), 0);
        const totalCredit = entryLines.reduce((sum, l) => sum + Number(l.credit), 0);

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            throw new Error(`Journal Entry Unbalanced: Debit ${totalDebit} vs Credit ${totalCredit}`);
        }

        // 3. Save
        const move = this.moveRepo.create({
            tenant_id: tenantId,
            date: data.date,
            ref: data.ref,
            state: MoveState.POSTED,
            lines: entryLines // Cascades
        } as any);

        return await this.moveRepo.save(move);
    }
}
