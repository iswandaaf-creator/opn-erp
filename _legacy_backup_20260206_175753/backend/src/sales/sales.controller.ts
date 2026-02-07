import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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

    @Post('orders')
    createOrder(@Body() dto: any) {
        return this.salesService.createOrder(dto);
    }

    @Get('orders')
    getOrders() {
        return this.salesService.findAllOrders();
    }

    @Post('delivery')
    createDelivery(@Body() dto: any) {
        return this.salesService.createDelivery(dto);
    }

    @Get('delivery')
    getDeliveries() {
        return this.salesService.findAllDeliveries();
    }

    @Post('payments')
    recordPayment(@Body() dto: any) {
        return this.salesService.recordPayment(dto);
    }

    @Get('payments')
    getPayments() {
        return this.salesService.findAllPayments();
    }

    @Post('quotations/:id/convert')
    convertQuote(@Param('id') id: string) {
        return this.salesService.convertQuoteToOrder(id);
    }

    @Post('orders/:id/convert-delivery')
    convertOrderToDelivery(@Param('id') id: string) {
        return this.salesService.convertOrderToDelivery(id);
    }

    @Post('orders/:id/convert-invoice')
    convertOrderToInvoice(@Param('id') id: string) {
        return this.salesService.convertOrderToInvoice(id);
    }
}
