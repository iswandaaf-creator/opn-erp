import { Controller, Get, Post, Body, Param, Put, Patch } from '@nestjs/common';
import { ManufacturingService } from './manufacturing.service';
import { BOM } from './entities/bom.entity';
import { WorkOrder, WorkOrderStatus } from './entities/work-order.entity';

@Controller('manufacturing')
export class ManufacturingController {
    constructor(private readonly manufacturingService: ManufacturingService) { }

    @Post('boms')
    createBOM(@Body() createBOMDto: any) {
        // In real app, DTO validation here
        return this.manufacturingService.createBOM(createBOMDto);
    }

    @Get('boms')
    findAllBOMs() {
        return this.manufacturingService.findAllBOMs();
    }

    @Get('boms/:id')
    findBOM(@Param('id') id: string) {
        return this.manufacturingService.findBOM(+id);
    }

    @Post('work-orders')
    createWorkOrder(@Body() createWorkOrderDto: any) {
        return this.manufacturingService.createWorkOrder(createWorkOrderDto);
    }

    @Get('work-orders')
    findAllWorkOrders() {
        return this.manufacturingService.findAllWorkOrders();
    }

    @Patch('work-orders/:id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: WorkOrderStatus) {
        return this.manufacturingService.updateWorkOrderStatus(+id, status);
    }
}
