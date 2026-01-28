import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';

@Controller('suppliers')
export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) { }

    @Get()
    findAll() {
        return this.suppliersService.findAll();
    }

    @Post()
    create(@Body() body: any) {
        return this.suppliersService.create(body);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        return this.suppliersService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.suppliersService.remove(id);
    }
}
