import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';


@Entity('sales_quotations')
export class SalesQuotation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    quotationNumber: string; // SQ-YYYYMMDD-XXXX

    @Column()
    customerName: string;

    @Column({ nullable: true })
    customerEmail: string;

    @Column({ type: 'text', nullable: true })
    termConditions: string;

    @Column('date')
    validUntil: Date;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column({
        type: 'simple-enum',
        enum: ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED'],
        default: 'DRAFT'
    })
    status: string;

    @Column('jsonb', { nullable: true })
    items: any[]; // Storing items as JSON for simplicity, or relation

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
