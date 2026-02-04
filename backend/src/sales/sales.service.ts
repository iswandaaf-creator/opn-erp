import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesQuotation } from './entities/sales-quotation.entity';
import { SalesInvoice } from './entities/sales-invoice.entity';
import { CustomerPayment } from './entities/customer-payment.entity';
import { AccountingService } from '../accounting/accounting.service'; // Import Accounting Service

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(SalesQuotation)
        private quotationRepo: Repository<SalesQuotation>,
        @InjectRepository(SalesInvoice)
        private invoiceRepo: Repository<SalesInvoice>,
        @InjectRepository(CustomerPayment)
        private paymentRepo: Repository<CustomerPayment>,
        private accountingService: AccountingService, // Inject Accounting Service
    ) { }

    // Quotations
    async createQuotation(data: any) {
        const quote = this.quotationRepo.create(data);
        return this.quotationRepo.save(quote);
    }

    async findAllQuotations() {
        return this.quotationRepo.find({ order: { createdAt: 'DESC' } });
    }

    // Invoices
    async createInvoice(data: any) {
        const invoice = (this.invoiceRepo.create({
            ...data,
            status: 'UNPAID',
            paidAmount: 0
        }) as unknown) as SalesInvoice;
        const savedInvoice: SalesInvoice = await this.invoiceRepo.save(invoice);

        // AUTO-JOURNAL: Debit AR, Credit Sales
        await this.accountingService.createEntry({
            reference: `INV-${savedInvoice.id.slice(0, 8)}`,
            description: `Sales Invoice #${savedInvoice.id.slice(0, 8)} - ${savedInvoice.customerName}`,
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
            description: `Payment for Invoice #${invoice?.id.slice(0, 8)}`,
            date: new Date().toISOString(),
            lines: [
                { accountCode: '1000', accountName: 'Cash/Bank', debit: payment.amount, credit: 0 },
                { accountCode: '1100', accountName: 'Accounts Receivable', debit: 0, credit: payment.amount }
            ]
        });

        return savedPayment;
    }
}
