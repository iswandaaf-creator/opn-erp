import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesQuotation } from './entities/sales-quotation.entity';
import { SalesInvoice } from './entities/sales-invoice.entity';
import { CustomerPayment } from './entities/customer-payment.entity';
import { SalesOrder } from './entities/sales-order.entity';
import { DeliveryOrder } from './entities/delivery-order.entity';
import { AccountingService } from '../accounting/accounting.service';

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(SalesQuotation)
        private quotationRepo: Repository<SalesQuotation>,
        @InjectRepository(SalesInvoice)
        private invoiceRepo: Repository<SalesInvoice>,
        @InjectRepository(CustomerPayment)
        private paymentRepo: Repository<CustomerPayment>,
        @InjectRepository(SalesOrder)
        private orderRepo: Repository<SalesOrder>,
        @InjectRepository(DeliveryOrder)
        private deliveryRepo: Repository<DeliveryOrder>,
        private accountingService: AccountingService,
    ) { }

    private generateNumber(prefix: string): string {
        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}-${datePart}-${randomPart}`;
    }

    // Quotations
    async createQuotation(data: any) {
        const quote = this.quotationRepo.create({
            ...data,
            quotationNumber: this.generateNumber('SQ'),
            status: 'DRAFT'
        });
        return this.quotationRepo.save(quote);
    }

    async findAllQuotations() {
        return this.quotationRepo.find({ order: { createdAt: 'DESC' } });
    }

    // Sales Orders
    async createOrder(data: any) {
        const order = this.orderRepo.create({
            ...data,
            orderNumber: this.generateNumber('SO'),
            status: 'PENDING'
        });
        return this.orderRepo.save(order);
    }

    async findAllOrders() {
        return this.orderRepo.find({ order: { createdAt: 'DESC' } });
    }

    // Delivery Orders
    async createDelivery(data: any) {
        // Logic: Check if Status is confirmed, etc. could go here
        const delivery = this.deliveryRepo.create({
            ...data,
            deliveryNumber: this.generateNumber('DO'),
            status: 'DRAFT'
        });
        return this.deliveryRepo.save(delivery);
    }

    async findAllDeliveries() {
        return this.deliveryRepo.find({ order: { createdAt: 'DESC' } });
    }

    // Invoices
    async createInvoice(data: any) {
        const invoice = (this.invoiceRepo.create({
            ...data,
            invoiceNumber: this.generateNumber('INV'),
            status: 'UNPAID',
            paidAmount: 0
        }) as unknown) as SalesInvoice;
        const savedInvoice: SalesInvoice = await this.invoiceRepo.save(invoice);

        // AUTO-JOURNAL: Debit AR, Credit Sales
        await this.accountingService.createEntry({
            reference: savedInvoice.invoiceNumber,
            description: `Sales Invoice ${savedInvoice.invoiceNumber} - ${savedInvoice.customerName}`,
            date: new Date().toISOString(),
            lines: [
                { accountCode: '1100', accountName: 'Accounts Receivable', debit: savedInvoice.totalAmount, credit: 0 },
                { accountCode: '4100', accountName: 'Sales Revenue', debit: 0, credit: savedInvoice.totalAmount }
            ]
        });

        return savedInvoice;
    }

    async findAllInvoices() {
        return this.invoiceRepo.find({ order: { createdAt: 'DESC' } });
    }

    // Payments
    async recordPayment(data: any) {
        const payment = (this.paymentRepo.create(data) as unknown) as CustomerPayment;
        const savedPayment = await this.paymentRepo.save(payment);

        // Update Invoice Status
        const invoice = await this.invoiceRepo.findOneBy({ id: data.invoiceId });
        if (invoice) {
            invoice.paidAmount = Number(invoice.paidAmount) + Number(data.amount);
            if (invoice.paidAmount >= invoice.totalAmount) {
                invoice.status = 'PAID';
            } else {
                invoice.status = 'PARTIAL';
            }
            await this.invoiceRepo.save(invoice);
        }

        // AUTO-JOURNAL: Debit Cash/Bank, Credit AR
        await this.accountingService.createEntry({
            reference: `PAY-${savedPayment.id.slice(0, 8)}`,
            description: `Payment for Invoice ${invoice?.invoiceNumber}`,
            date: new Date().toISOString(),
            lines: [
                { accountCode: '1000', accountName: 'Cash/Bank', debit: payment.amount, credit: 0 },
                { accountCode: '1100', accountName: 'Accounts Receivable', debit: 0, credit: payment.amount }
            ]
        });

        return savedPayment;
    }

    async findAllPayments() {
        return this.paymentRepo.find({ order: { createdAt: 'DESC' }, relations: ['invoice'] });
    }
}
