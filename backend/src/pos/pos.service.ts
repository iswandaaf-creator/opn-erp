import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { SalesTransaction, PaymentMethod } from './entities/sales-transaction.entity';
import { TransactionItem } from './entities/transaction-item.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ConnectionService } from '../tenancy/connection.service';
import { InventoryService } from '../inventory/inventory.service';
import { MovementType } from '../inventory/entities/stock-movement.entity';

@Injectable()
export class PosService {
    constructor(
        private connectionService: ConnectionService,
        private inventoryService: InventoryService,
    ) { }

    private async getTransactionRepo(): Promise<Repository<SalesTransaction>> {
        return (await this.connectionService.getTenantConnection()).getRepository(SalesTransaction);
    }

    private async generateInvoiceNumber(repo: Repository<SalesTransaction>): Promise<string> {
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
        const count = await repo.count(); // Simple count, better to count by date in real app
        const sequence = (count + 1).toString().padStart(4, '0');

        return `INV-${dateStr}-${sequence}`;
    }

    async createSale(dto: CreateSaleDto, userId: string | null) {
        const transactionRepo = await this.getTransactionRepo();
        const productIds = dto.items.map(i => i.product_id);

        // 1. Fetch products to get prices
        // We can reuse InventoryService or just direct access if module is shared/exported
        // Let's assume InventoryService has a method to get products by IDs or we fetch all
        // For MVP optimization, we'll iterate. 
        const allProducts = await this.inventoryService.findAllProducts(); // Optimization needed in prod

        let totalAmount = 0;
        const transactionItems: TransactionItem[] = [];

        // 2. Process Items and Check Stock
        for (const itemDto of dto.items) {
            const product = allProducts.find(p => p.id === itemDto.product_id);
            if (!product) throw new BadRequestException(`Product ${itemDto.product_id} not found`);

            const currentStock = await this.inventoryService.getStockBalance(product.id, dto.warehouse_id);
            if (currentStock < itemDto.quantity) {
                throw new BadRequestException(`Insufficient stock for ${product.name}. Available: ${currentStock}`);
            }

            const subtotal = Number(product.selling_price) * itemDto.quantity;
            totalAmount += subtotal;

            const tItem = new TransactionItem();
            tItem.product = product;
            tItem.quantity = itemDto.quantity;
            tItem.unit_price = product.selling_price;
            tItem.subtotal = subtotal;

            transactionItems.push(tItem);
        }

        // 3. Create Transaction Header
        const transaction = new SalesTransaction();
        transaction.invoice_number = await this.generateInvoiceNumber(transactionRepo);
        transaction.total_amount = totalAmount;
        transaction.payment_method = dto.payment_method;
        transaction.customer_name = dto.customer_name || null;
        transaction.cashier_id = userId || null;
        transaction.items = transactionItems;

        // 4. Save and Deduct Stock
        // Ideally wrap in transaction
        const savedTransaction = await transactionRepo.save(transaction);

        // Deduct stock
        for (const itemDto of dto.items) {
            await this.inventoryService.addMovement({
                product_id: itemDto.product_id,
                warehouse_id: dto.warehouse_id,
                quantity: -itemDto.quantity, // Negative for deduction
                movement_type: MovementType.SALES,
                reference_doc: savedTransaction.invoice_number,
                notes: 'POS Sale'
            }, userId);
        }

        return savedTransaction;
    }
}
