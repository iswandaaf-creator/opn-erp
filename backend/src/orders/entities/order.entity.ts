import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customerName: string;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ default: 'PENDING' })
    status: string; // PENDING, COMPLETED, CANCELLED

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];
}
