import { MovementType } from '../entities/stock-movement.entity';

export class CreateStockMovementDto {
    product_id: number;
    warehouse_id: number;
    quantity: number; // Positive or negative
    movement_type: MovementType;
    reference_doc?: string;
    notes?: string;
}
