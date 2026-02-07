import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { StockLedger } from './stock-ledger.entity';

@Entity('warehouses')
export class Warehouse {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    location: string;

    @OneToMany(() => StockLedger, (ledger) => ledger.warehouse)
    stockLedgers: StockLedger[];
}
