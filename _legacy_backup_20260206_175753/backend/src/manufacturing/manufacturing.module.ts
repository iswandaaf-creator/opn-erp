import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufacturingService } from './manufacturing.service';
import { ManufacturingController } from './manufacturing.controller';
import { BOM } from './entities/bom.entity';
import { BOMLine } from './entities/bom-line.entity';
import { WorkOrder } from './entities/work-order.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity'; // Import needed for Product relation if cross-module

@Module({
    imports: [
        TypeOrmModule.forFeature([BOM, BOMLine, WorkOrder, Product])
    ],
    controllers: [ManufacturingController],
    providers: [ManufacturingService],
    exports: [ManufacturingService]
})
export class ManufacturingModule { }
