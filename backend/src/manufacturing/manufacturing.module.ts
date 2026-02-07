import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufacturingService } from './manufacturing.service';
import { Bom } from './entities/bom.entity';
import { BomLine } from './entities/bom-line.entity';
import { ManufacturingOrder } from './entities/manufacturing-order.entity';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Bom, BomLine, ManufacturingOrder]),
        InventoryModule,
    ],
    controllers: [],
    providers: [ManufacturingService],
    exports: [ManufacturingService],
})
export class ManufacturingModule { }
