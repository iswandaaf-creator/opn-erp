import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BOM } from './bom.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('bom_lines')
export class BOMLine {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => BOM, (bom) => bom.bomLines, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bomId' })
    bom: BOM;

    @Column()
    bomId: number;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'materialId' })
    material: Product;

    @Column()
    materialId: number;

    @Column('float')
    quantity: number;

    @Column('float', { nullable: true })
    cost: number;
}
