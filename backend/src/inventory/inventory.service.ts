import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Warehouse } from './entities/warehouse.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { ConnectionService } from '../tenancy/connection.service';

@Injectable()
export class InventoryService {
    constructor(private connectionService: ConnectionService) { }

    private async getProductRepo(): Promise<Repository<Product>> {
        return (await this.connectionService.getTenantConnection()).getRepository(Product);
    }

    private async getWarehouseRepo(): Promise<Repository<Warehouse>> {
        return (await this.connectionService.getTenantConnection()).getRepository(Warehouse);
    }

    private async getMovementRepo(): Promise<Repository<StockMovement>> {
        return (await this.connectionService.getTenantConnection()).getRepository(StockMovement);
    }

    async createProduct(createProductDto: CreateProductDto) {
        const repo = await this.getProductRepo();
        const product = repo.create(createProductDto);
        return repo.save(product);
    }

    async findAllProducts() {
        const repo = await this.getProductRepo();
        return repo.find();
    }

    async createWarehouse(name: string, location: string) {
        const repo = await this.getWarehouseRepo();
        const warehouse = repo.create({ name, location });
        return repo.save(warehouse);
    }

    // CORE LOGIC: Add Stock Movement
    async addMovement(dto: CreateStockMovementDto, userId: string | null = null) {
        const movementRepo = await this.getMovementRepo();

        // In strict mode, we should check if stock goes negative before validation
        // For now, we allow negative stock for flexibility, or we can calculate balance first.

        const movement = movementRepo.create({
            ...dto,
            created_by_user_id: userId || undefined,
            product: { id: dto.product_id } as any,
            warehouse: { id: dto.warehouse_id } as any,
        });

        return movementRepo.save(movement);
    }

    // Calculate current stock on fly
    async getStockBalance(productId: number, warehouseId: number) {
        const movementRepo = await this.getMovementRepo();
        const { total } = await movementRepo
            .createQueryBuilder('movement')
            .select('SUM(movement.quantity)', 'total')
            .where('movement.product_id = :productId', { productId })
            .andWhere('movement.warehouse_id = :warehouseId', { warehouseId })
            .getRawOne();

        return parseFloat(total || 0);
    }
}
