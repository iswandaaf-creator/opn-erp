import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AccountingService } from './accounting.service';

@Controller('accounting')
export class AccountingController {
    constructor(private readonly accountingService: AccountingService) { }

    @Post()
    create(@Body() createentryDto: any) {
        return this.accountingService.createEntry(createentryDto);
    }

    @Get()
    findAll() {
        return this.accountingService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.accountingService.findOne(id);
    }
}
