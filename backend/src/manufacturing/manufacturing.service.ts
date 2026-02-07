import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ManufacturingOrder, MoState } from './entities/manufacturing-order.entity';
import { Bom } from './entities/bom.entity';
import { InventoryService } from '../inventory/inventory.service';
import { MovementType } from '../inventory/entities/stock-movement.entity';

@Injectable()
export class ManufacturingService {
    constructor(
        @InjectRepository(ManufacturingOrder)
        private moRepo: Repository<ManufacturingOrder>,
        @InjectRepository(Bom)
        private bomRepo: Repository<Bom>,
        private inventoryService: InventoryService,
        private dataSource: DataSource,
    ) { }

    async createMo(dto: any, tenantId: string) {
        const bom = await this.bomRepo.findOne({ where: { id: dto.bomId, tenant_id: tenantId } as any, relations: ['lines'] });
        if (!bom) throw new BadRequestException('BOM not found');

        const mo = this.moRepo.create({
            tenant_id: tenantId,
            bom_id: bom.id,
            product_id: bom.product_id,
            quantity_to_produce: dto.quantity,
            state: MoState.DRAFT
        } as any);

        return await this.moRepo.save(mo);
    }

    async finishMo(id: string, tenantId: string) {
        const mo = await this.moRepo.findOne({
            where: { id, tenant_id: tenantId } as any,
            relations: ['bom', 'bom.lines']
        });
        if (!mo) throw new BadRequestException('MO not found');
        if (mo.state !== MoState.DRAFT && mo.state !== MoState.CONFIRMED) throw new BadRequestException('MO not in executable state');

        // Transactional Consumption
        await this.dataSource.transaction(async manager => {
            // 1. Consume Components
            for (const line of mo.bom.lines) {
                const qtyNeeded = Number(line.quantity) * Number(mo.quantity_to_produce);
                // We use generic 'Production' warehouse or default for now
                // Ideally we pass Source Warehouse ID in MO
                // await this.inventoryService.addMovement({ ... }, tenantId);
                // Placeholder: Logging consumption intent
                console.log(`Consuming: Product ${line.component_id}, Qty: ${qtyNeeded}`);
            }

            // 2. Add Finished Good
            // logic similar to above: IN move for mo.product_id

            // 3. Update MO State
            mo.state = MoState.DONE;
            await manager.save(mo);
        });

        return mo;
    }
}
