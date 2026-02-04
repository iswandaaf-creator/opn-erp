import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post('quotations')
    createQuotation(@Body() dto: any) {
        return this.salesService.createQuotation(dto);
    }

    @Get('quotations')
    getQuotations() {
        return this.salesService.findAllQuotations();
    }

    @Post('invoices')
    createInvoice(@Body() dto: any) {
        return this.salesService.createInvoice(dto);
    }

    @Get('invoices')
    getInvoices() {
        return this.salesService.findAllInvoices();
    }

    @Post('payments')
    recordPayment(@Body() dto: any) {
        return this.salesService.recordPayment(dto);
    }
}
