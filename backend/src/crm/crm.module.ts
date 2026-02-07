import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmService } from './crm.service';
import { CrmLead } from './entities/lead.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CrmLead])],
    controllers: [],
    providers: [CrmService],
    exports: [CrmService],
})
export class CrmModule { }
