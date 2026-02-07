import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CustomFieldsService } from './custom-fields.service';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';

@Controller('custom-fields')
export class CustomFieldsController {
    constructor(private readonly customFieldsService: CustomFieldsService) { }

    @Post()
    create(@Body() createCustomFieldDto: CreateCustomFieldDto) {
        return this.customFieldsService.create(createCustomFieldDto);
    }

    @Get()
    findAll(@Query('entity_type') entityType?: string) {
        if (entityType) {
            return this.customFieldsService.findAll(entityType);
        }
        return this.customFieldsService.findAllByEntity();
    }
}
