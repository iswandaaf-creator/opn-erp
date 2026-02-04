import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { SalesQuotation } from './entities/sales-quotation.entity';
import { SalesInvoice } from './entities/sales-invoice.entity';
import { CustomerPayment } from './entities/customer-payment.entity';
import { AccountingModule } from '../accounting/accounting.module'; // Import Account Module to use Service

@Module({
    imports: [
        TypeOrmModule.forFeature([SalesQuotation, SalesInvoice, CustomerPayment]),
        AccountingModule
    ],
    controllers: [SalesController],
    providers: [SalesService],
})
export class SalesModule { }
