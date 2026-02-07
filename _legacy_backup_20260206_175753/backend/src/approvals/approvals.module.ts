import { Module } from '@nestjs/common';
import { ApprovalsController } from './approvals.controller';
import { BuyingModule } from '../buying/buying.module';

@Module({
    imports: [BuyingModule],
    controllers: [ApprovalsController],
})
export class ApprovalsModule { }
