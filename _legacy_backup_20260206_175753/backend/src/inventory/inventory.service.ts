import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { StockLedger, StockTransactionType } from './entities/stock-ledger.entity';
import { MaterialRequest, MaterialRequestStatus } from './entities/material-request.entity';
import { GoodsReceipt, GoodsReceiptStatus } from './entities/goods-receipt.entity';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(Warehouse)
        private warehouseRepo: Repository<Warehouse>,
        @InjectRepository(StockLedger)
        private ledgerRepo: Repository<StockLedger>,
        @InjectRepository(MaterialRequest)
        private materialRequestRepo: Repository<MaterialRequest>,
        @InjectRepository(GoodsReceipt)
        private goodsReceiptRepo: Repository<GoodsReceipt>,
    ) { }

    // --- Material Requests (Production -> Warehouse) ---

    async createMaterialRequest(dto: any, userId: string) {
        const request = this.materialRequestRepo.create({
            ...dto,
            requestedById: userId,
            status: MaterialRequestStatus.PENDING,
        });
        return this.materialRequestRepo.save(request);
    }

    async findAllRequests() {
        return this.materialRequestRepo.find({ relations: ['requestedBy', 'approvedBy'] });
    }

    async approveMaterialRequest(id: string, userId: string) {
        const request = await this.materialRequestRepo.findOne({ where: { id } });
        if (!request) throw new NotFoundException('Request not found');
        if (request.status !== MaterialRequestStatus.PENDING) throw new BadRequestException('Request already processed');

        // Logic: Issue stock from Warehouse
        // For simplicity, we assume a default warehouse (ID 1) or pass it in DTO
        const warehouseId = 1; // Default Main Warehouse

        // Create Ledger Entry (OUT)
        for (const item of request.items) {
            await this.ledgerRepo.save({
                productId: item.productId,
                warehouseId,
                type: StockTransactionType.OUT,
                quantity: item.quantity,
                referenceDocId: request.id,
                referenceDocType: 'MATERIAL_REQUEST',
            });
        }

        request.status = MaterialRequestStatus.APPROVED;
        request.approvedById = userId;
        return this.materialRequestRepo.save(request);
    }

    // --- Goods Receipts (Production -> Warehouse) ---

    async createGoodsReceipt(dto: any, userId: string) {
        // Production declares they finished goods
        const receipt = this.goodsReceiptRepo.create({
            ...dto,
            status: GoodsReceiptStatus.PENDING,
        });
        return this.goodsReceiptRepo.save(receipt);
    }

    async verifyGoodsReceipt(id: string, userId: string) {
        const receipt = await this.goodsReceiptRepo.findOne({ where: { id } });
        if (!receipt) throw new NotFoundException('Receipt not found');
        if (receipt.status !== GoodsReceiptStatus.PENDING) throw new BadRequestException('Receipt already processed');

        // Logic: Add stock to Warehouse (IN)
        const warehouseId = 1; // Default Main Warehouse

        await this.ledgerRepo.save({
            productId: receipt.productId,
            warehouseId,
            type: StockTransactionType.IN,
            quantity: receipt.quantity,
            referenceDocId: receipt.id,
            referenceDocType: 'GOODS_RECEIPT',
        });

        receipt.status = GoodsReceiptStatus.VERIFIED;
        receipt.receivedById = userId;
        return this.goodsReceiptRepo.save(receipt);
    }

    async findAllReceipts() {
        return this.goodsReceiptRepo.find({ relations: ['product', 'receivedBy'] });
    }

    // --- Stock Ledger ---

    async getStockLedger() {
        return this.ledgerRepo.find({
            relations: ['product', 'warehouse'],
            order: { createdAt: 'DESC' }
        });
    }
}
