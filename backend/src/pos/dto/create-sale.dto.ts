import { PaymentMethod } from '../entities/sales-transaction.entity';

export class TransactionItemDto {
    product_id: number;
    quantity: number;
    // unit_price is fetched from DB to prevent tampering, or allowed for overrides if authorized
}

export class CreateSaleDto {
    payment_method: PaymentMethod;
    customer_name?: string;
    items: TransactionItemDto[];
    warehouse_id: number; // Which warehouse to deduct stock from
}
