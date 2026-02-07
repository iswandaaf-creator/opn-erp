import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OmnichannelService } from './omnichannel.service';
import { MarketplaceAccount } from './entities/marketplace-account.entity';
import { ProductMapping } from './entities/product-mapping.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([MarketplaceAccount, ProductMapping]),
    ],
    controllers: [],
    providers: [OmnichannelService],
    exports: [OmnichannelService],
})
export class OmnichannelModule { }
