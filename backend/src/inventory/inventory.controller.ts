import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post('products')
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.inventoryService.createProduct(createProductDto);
    }

    @Get('products')
    findAllProducts() {
        return this.inventoryService.findAllProducts();
    }

    @Post('warehouses')
    createWarehouse(@Body() body: { name: string; location: string }) {
        return this.inventoryService.createWarehouse(body.name, body.location);
    }

    @Post('movements')
    addMovement(@Body() dto: CreateStockMovementDto) {
        return this.inventoryService.addMovement(dto);
    }

    @Get('balance/:productId/:warehouseId')
    getBalance(
        @Param('productId') productId: string,
        @Param('warehouseId') warehouseId: string
    ) {
        return this.inventoryService.getStockBalance(+productId, +warehouseId);
    }
}
