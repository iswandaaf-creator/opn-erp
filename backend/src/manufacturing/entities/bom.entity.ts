import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { BOMLine } from './bom-line.entity';

@Entity('boms')
export class BOM {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: number;

    @OneToMany(() => BOMLine, (line) => line.bom, { cascade: true })
    bomLines: BOMLine[];

    @Column({ default: true })
    isActive: boolean;
}
