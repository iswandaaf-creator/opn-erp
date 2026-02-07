import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyingService } from './buying.service';
import { BuyingController } from './buying.controller';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { Product } from '../products/entities/product.entity';
import { SuppliersModule } from './suppliers/suppliers.module';
import { AccountingModule } from '../accounting/accounting.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PurchaseOrder, PurchaseOrderItem, Product]),
        SuppliersModule,
        AccountingModule,
    ],
    controllers: [BuyingController],
    providers: [BuyingService],
    exports: [BuyingService],
})
export class BuyingModule { }
