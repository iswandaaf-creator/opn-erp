import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PosService } from './pos.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('pos')
export class PosController {
    constructor(private readonly posService: PosService) { }

    @Post('sales')
    createSale(@Body() createSaleDto: CreateSaleDto, @Req() req) {
        // Assuming simple link for now, middleware sets tenantId 
        // We need user ID from Auth Guard. 
        // Mocking user ID for now if not present, or extracting from request if Auth is active
        const userId = req.user ? req.user.id : null;
        return this.posService.createSale(createSaleDto, userId);
    }
}
