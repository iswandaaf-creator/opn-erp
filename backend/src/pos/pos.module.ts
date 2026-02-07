import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesTransaction } from './entities/sales-transaction.entity';
import { TransactionItem } from './entities/transaction-item.entity';
import { PosService } from './pos.service';
import { PosController } from './pos.controller';
import { InventoryModule } from '../inventory/inventory.module'; // Import Inventory

@Module({
    imports: [
        TypeOrmModule.forFeature([SalesTransaction, TransactionItem]),
        InventoryModule
    ],
    controllers: [PosController],
    providers: [PosService],
})
export class PosModule { }
