import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { Product } from '../products/entities/product.entity';
import { AccountingService } from '../accounting/accounting.service'; // Assuming export

@Injectable()
export class BuyingService {
    constructor(
        @InjectRepository(PurchaseOrder)
        private poRepository: Repository<PurchaseOrder>,
        @InjectRepository(PurchaseOrderItem)
        private poItemRepository: Repository<PurchaseOrderItem>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        private accountingService: AccountingService,
        private dataSource: DataSource,
    ) { }

    findAll() {
        return this.poRepository.find({
            relations: ['supplier', 'items', 'items.product'],
            order: { createdAt: 'DESC' },
        });
    }

    async create(data: any) {
        const { supplierId, items } = data; // items: { productId, quantity, unitCost }[]

        // Calculate total
        let totalAmount = 0;
        const poItems: PurchaseOrderItem[] = [];

        for (const item of items) {
            const product = await this.productRepository.findOneBy({ id: item.productId });
            if (!product) throw new BadRequestException('Invalid product');

            const poItem = new PurchaseOrderItem();
            poItem.product = product;
            poItem.quantity = item.quantity;
            poItem.unitCost = item.unitCost;
            poItems.push(poItem);

            totalAmount += item.quantity * item.unitCost;
        }

        const po = this.poRepository.create({
            supplier: { id: supplierId },
            totalAmount,
            items: poItems,
            status: 'DRAFT',
        });

        return this.poRepository.save(po);
    }

    async submitOrder(id: number) {
        const po = await this.poRepository.findOneBy({ id });
        if (!po) throw new NotFoundException('Order not found');
        if (po.status !== 'DRAFT') throw new BadRequestException('Order already submitted');

        po.status = 'ORDERED';
        return this.poRepository.save(po);
    }

    async receiveOrder(id: number) {
        // Transactional operation: Update PO status -> Increase Inventory -> Post Journal
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const po = await this.poRepository.findOne({
                where: { id },
                relations: ['items', 'items.product', 'supplier'],
            });

            if (!po) throw new NotFoundException('Purchase Order not found');
            if (po.status !== 'ORDERED') throw new BadRequestException('PO must be ORDERED to receive');

            // 1. Update Inventory
            for (const item of po.items) {
                // Direct query runner update to be in transaction
                await queryRunner.manager.increment(Product, { id: item.product.id }, 'quantity', item.quantity);
            }

            // 2. Post Accounting Journal
            // Debit: Inventory Asset (1200), Credit: Accounts Payable (2000)
            await this.accountingService.createEntry({
                description: `Goods Receipt PO #${po.id} - ${po.supplier.name}`,
                date: new Date().toISOString(),
                reference: `PO-${po.id}`,
                lines: [
                    { accountCode: '1200', debit: po.totalAmount, credit: 0 }, // Inventory Asset
                    { accountCode: '2000', debit: 0, credit: po.totalAmount }, // Accounts Payable
                ],
            });

            // 3. Update Status
            po.status = 'RECEIVED';
            await queryRunner.manager.save(po);

            await queryRunner.commitTransaction();
            return po;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
