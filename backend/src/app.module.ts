import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { EmployeesModule } from './employees/employees.module';
import { AccountingModule } from './accounting/accounting.module';
import { ManufacturingModule } from './manufacturing/manufacturing.module';
import { BuyingModule } from './buying/buying.module';
import { CrmModule } from './crm/crm.module';
import { SettingsModule } from './settings/settings.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { EventsModule } from './events/events.module';
import { TasksModule } from './tasks/tasks.module';
import { CompaniesModule } from './companies/companies.module';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sales/sales.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => {
        const isProduction = !!process.env.DATABASE_URL;
        return {
          type: isProduction ? 'postgres' : 'sqlite',
          url: isProduction ? process.env.DATABASE_URL : undefined,
          database: isProduction ? undefined : 'db.sqlite',
          autoLoadEntities: true,
          synchronize: true,
          ssl: isProduction ? { rejectUnauthorized: false } : undefined,
        } as any; // Cast to avoid complex union type checks during build
      },
      inject: [],
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    EmployeesModule,
    AccountingModule,
    ManufacturingModule,
    BuyingModule,
    CrmModule,
    SettingsModule,
    TasksModule,
    ApprovalsModule,
    EventsModule,
    CompaniesModule,
    InventoryModule,
    SalesModule,
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
