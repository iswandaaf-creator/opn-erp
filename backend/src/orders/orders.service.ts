import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';

import { AccountingService } from '../accounting/accounting.service';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        private dataSource: DataSource,
        private accountingService: AccountingService,
        private tasksService: TasksService,
    ) { }

    async create(createOrderDto: CreateOrderDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const order = new Order();
            order.customerName = createOrderDto.customerName;
            order.items = [];
            let totalAmount = 0;

            for (const itemDto of createOrderDto.items) {
                // Fetch Product
                const product = await queryRunner.manager.findOne(Product, {
                    where: { id: itemDto.productId }
                });

                if (!product) {
                    throw new BadRequestException(`Product #${itemDto.productId} not found`);
                }

                // Service Logic: Skip stock check, create task
                if (product.type === 'service') {
                    await this.tasksService.create({
                        title: `Fulfill Service: ${product.name}`,
                        description: `Order #${createOrderDto.customerName} - ${itemDto.quantity}x ${product.name}`,
                        orderId: 0, // Will update after save
                        status: 'PENDING'
                    });
                } else {
                    // Goods Logic: Check and deduct stock
                    if (product.quantity < itemDto.quantity) {
                        throw new BadRequestException(`Insufficient stock for ${product.name}`);
                    }
                    product.quantity -= itemDto.quantity;
                    await queryRunner.manager.save(product);
                }

                // Create Order Item
                const orderItem = new OrderItem();
                orderItem.product = product;
                orderItem.productId = product.id;
                orderItem.quantity = itemDto.quantity;
                orderItem.price = Number(product.price); // Snapshot price

                order.items.push(orderItem);
                totalAmount += Number(product.price) * itemDto.quantity;
            }

            order.totalAmount = totalAmount;
            order.status = 'COMPLETED'; // Auto-complete for simplicity in this mature MVP

            const savedOrder = await queryRunner.manager.save(Order, order);
            await queryRunner.commitTransaction();

            // Auto-create Accounting Journal Logic
            try {
                await this.accountingService.createEntry({
                    reference: `ORD-${savedOrder.id}`,
                    description: `Sale to ${savedOrder.customerName}`,
                    date: new Date().toISOString(),
                    lines: [
                        { accountName: 'Cash/Bank', debit: order.totalAmount, credit: 0 },
                        { accountName: 'Sales Revenue', debit: 0, credit: order.totalAmount }
                    ]
                });
            } catch (accErr) {
                console.error("Failed to create journal entry", accErr);
            }

            return savedOrder;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    findAll() {
        return this.ordersRepository.find({ relations: ['items', 'items.product'], order: { createdAt: 'DESC' } });
    }
}

