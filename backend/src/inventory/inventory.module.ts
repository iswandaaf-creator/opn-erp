import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { StockLedger } from './entities/stock-ledger.entity';
import { MaterialRequest } from './entities/material-request.entity';
import { GoodsReceipt } from './entities/goods-receipt.entity';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Warehouse,
            Warehouse,
            StockLedger,
            MaterialRequest,
            GoodsReceipt,
        ]),
    ],
    controllers: [InventoryController],
    providers: [InventoryService],
    exports: [],
})
export class InventoryModule { }
