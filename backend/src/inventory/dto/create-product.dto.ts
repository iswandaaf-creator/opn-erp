export class CreateProductDto {
    sku: string;
    name: string;
    barcode?: string;
    purchase_price: number;
    selling_price: number;
    stock_alert_limit?: number;
    unit?: string;
}
