import { Controller, Post, Body, Req } from '@nestjs/common';
import { AccountingService } from './accounting.service';

@Controller('accounting')
export class AccountingController {
    constructor(private readonly accountingService: AccountingService) { }

    @Post('init-coa')
    async initCoa(@Req() req) {
        // Manual trigger for dev
        await this.accountingService.initDefaultCOA(req.user.tenant_id);
        return { message: 'COA Initialized' };
    }
}
