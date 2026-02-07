import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomFieldDefinition } from './entities/custom-field-definition.entity';
import { CustomFieldsService } from './custom-fields.service';
import { CustomFieldsController } from './custom-fields.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CustomFieldDefinition])],
    controllers: [CustomFieldsController],
    providers: [CustomFieldsService],
})
export class CustomFieldsModule { }
