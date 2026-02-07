import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrmLead, LeadStage } from './entities/lead.entity';

@Injectable()
export class CrmService {
    constructor(
        @InjectRepository(CrmLead)
        private leadRepo: Repository<CrmLead>,
    ) { }

    async create(dto: any, tenantId: string) {
        const lead = this.leadRepo.create({ ...dto, tenant_id: tenantId });
        return this.leadRepo.save(lead);
    }

    async findAll(tenantId: string) {
        return this.leadRepo.find({ where: { tenant_id: tenantId } as any });
    }

    async updateStage(id: string, stage: LeadStage, tenantId: string) {
        const lead = await this.leadRepo.findOne({ where: { id, tenant_id: tenantId } as any });
        if (!lead) throw new Error('Lead not found');

        lead.stage = stage;
        if (stage === LeadStage.WON) lead.probability = 100;
        return this.leadRepo.save(lead);
    }
}
