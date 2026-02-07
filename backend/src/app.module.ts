import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TenancyModule } from './tenancy/tenancy.module';
import { TenantsModule } from './tenants/tenants.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { CustomFieldsModule } from './custom-fields/custom-fields.module';
import { HrModule } from './hr/hr.module';
import { InventoryModule } from './inventory/inventory.module';
import { PosModule } from './pos/pos.module';
import { AccountingModule } from './accounting/accounting.module';
import { OmnichannelModule } from './omnichannel/omnichannel.module';
import { ManufacturingModule } from './manufacturing/manufacturing.module';
import { CrmModule } from './crm/crm.module';
import { SupportModule } from './support/support.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'sqlite',
          database: 'nexus.sqlite',
          autoLoadEntities: true,
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    TenancyModule,
    TenantsModule,
    RolesModule,
    UsersModule,
    CustomFieldsModule,
    HrModule,
    InventoryModule,
    PosModule,
    AccountingModule,
    OmnichannelModule,
    ManufacturingModule,
    CrmModule,
    SupportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
