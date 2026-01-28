import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BOM } from './entities/bom.entity';
import { BOMLine } from './entities/bom-line.entity';
import { WorkOrder, WorkOrderStatus } from './entities/work-order.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ManufacturingService {
    constructor(
        @InjectRepository(BOM)
        private bomRepository: Repository<BOM>,
        @InjectRepository(BOMLine)
        private bomLineRepository: Repository<BOMLine>,
        @InjectRepository(WorkOrder)
        private workOrderRepository: Repository<WorkOrder>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    // --- BOMs ---
    async createBOM(data: Partial<BOM> & { bomLines: any[] }) {
        const bom = this.bomRepository.create(data);
        return this.bomRepository.save(bom);
    }

    async findAllBOMs() {
        return this.bomRepository.find({ relations: ['bomLines', 'bomLines.material', 'product'] });
    }

    async findBOM(id: number) {
        const bom = await this.bomRepository.findOne({
            where: { id },
            relations: ['bomLines', 'bomLines.material', 'product']
        });
        if (!bom) throw new NotFoundException('BOM not found');
        return bom;
    }

    // --- Work Orders ---
    async createWorkOrder(data: Partial<WorkOrder>) {
        const workOrder = this.workOrderRepository.create(data);

        // Auto-schedule if not provided
        if (!workOrder.startDate) workOrder.startDate = new Date();

        return this.workOrderRepository.save(workOrder);
    }

    async findAllWorkOrders() {
        return this.workOrderRepository.find({
            relations: ['product'],
            order: { createdAt: 'DESC' }
        });
    }

    async updateWorkOrderStatus(id: number, status: WorkOrderStatus) {
        const wo = await this.workOrderRepository.findOne({ where: { id } });
        if (!wo) throw new NotFoundException('Work Order not found');

        wo.status = status;
        if (status === WorkOrderStatus.COMPLETED) {
            wo.endDate = new Date();
            // TODO: In a real system, we would:
            // 1. Consume raw materials (Inventory deduction)
            // 2. Add finished good (Inventory addition)
            // 3. Create Accounting Journal Entries (Cost of Goods Manufactured)
        }
        return this.workOrderRepository.save(wo);
    }
}
