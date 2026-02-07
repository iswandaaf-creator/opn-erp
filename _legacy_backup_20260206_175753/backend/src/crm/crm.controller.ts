import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CrmService } from './crm.service';
import { Customer } from './entities/customer.entity';

@Controller('crm/customers')
export class CrmController {
    constructor(private readonly crmService: CrmService) { }

    @Post()
    create(@Body() createCustomerDto: Partial<Customer>) {
        return this.crmService.create(createCustomerDto);
    }

    @Get()
    findAll() {
        return this.crmService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.crmService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCustomerDto: Partial<Customer>) {
        return this.crmService.update(+id, updateCustomerDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.crmService.remove(+id);
    }
}
