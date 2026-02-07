import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingService } from './accounting.service';
import { AccountingController } from './accounting.controller';
import { ChartOfAccount } from './entities/chart-of-account.entity';
import { AccountMove } from './entities/account-move.entity';
import { AccountMoveLine } from './entities/account-move-line.entity';

@Global() // Make global so POS/Inventory can use service easily
@Module({
    imports: [
        TypeOrmModule.forFeature([ChartOfAccount, AccountMove, AccountMoveLine]),
    ],
    controllers: [AccountingController],
    providers: [AccountingService],
    exports: [AccountingService],
})
export class AccountingModule { }
