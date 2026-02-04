import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { InventoryService } from './inventory.service';
// import { AuthGuard } from '@nestjs/passport'; // Add Auth later if needed

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post('requests')
    createRequest(@Body() dto: any) {
        // Hardcoded User ID for now until Auth is fully piped
        return this.inventoryService.createMaterialRequest(dto, dto.userId);
    }

    @Get('requests')
    findAllRequests() {
        return this.inventoryService.findAllRequests();
    }

    @Patch('requests/:id/approve')
    approveRequest(@Param('id') id: string, @Body() body: { userId: string }) {
        return this.inventoryService.approveMaterialRequest(id, body.userId);
    }

    @Post('receipts')
    createReceipt(@Body() dto: any) {
        return this.inventoryService.createGoodsReceipt(dto, dto.userId);
    }

    @Get('receipts')
    findAllReceipts() {
        return this.inventoryService.findAllReceipts();
    }

    @Patch('receipts/:id/verify')
    verifyReceipt(@Param('id') id: string, @Body() body: { userId: string }) {
        return this.inventoryService.verifyGoodsReceipt(id, body.userId);
    }

    @Get('ledger')
    getLedger() {
        return this.inventoryService.getStockLedger();
    }
}
