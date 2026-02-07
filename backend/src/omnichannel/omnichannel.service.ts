import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketplaceAccount } from './entities/marketplace-account.entity';
import { ProductMapping } from './entities/product-mapping.entity';

@Injectable()
export class OmnichannelService {
    constructor(
        @InjectRepository(MarketplaceAccount)
        private accountRepo: Repository<MarketplaceAccount>,
        @InjectRepository(ProductMapping)
        private mappingRepo: Repository<ProductMapping>,
    ) { }

    async findAllAccounts(tenantId: string) {
        return this.accountRepo.find({ where: { tenant_id: tenantId } as any });
    }

    async syncOrders(item: any) {
        // Placeholder for Sync Logic (Cron Job or Webhook)
        console.log('Syncing orders for tenant...', item);
    }
}
