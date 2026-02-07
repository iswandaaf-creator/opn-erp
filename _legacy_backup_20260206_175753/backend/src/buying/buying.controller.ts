import { Controller, Get, Post, Body, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { BuyingService } from './buying.service';

@Controller('buying/purchase-orders')
export class BuyingController {
    constructor(private readonly buyingService: BuyingService) { }

    @Get()
    findAll() {
        return this.buyingService.findAll();
    }

    @Post()
    create(@Body() body: any) {
        return this.buyingService.create(body);
    }

    @Patch(':id/submit')
    submit(@Param('id', ParseIntPipe) id: number) {
        return this.buyingService.submitOrder(id);
    }

    @Patch(':id/receive')
    receive(@Param('id', ParseIntPipe) id: number) {
        return this.buyingService.receiveOrder(id);
    }
}
