import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum FieldType {
    TEXT = 'TEXT',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
    DATE = 'DATE',
    DROPDOWN = 'DROPDOWN',
}

@Entity('custom_field_definitions')
export class CustomFieldDefinition {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    entity_type: string; // e.g., 'employee', 'product', 'customer'

    @Column()
    field_name: string; // Internal name, e.g., 'shoe_size'

    @Column()
    label: string; // Display name, e.g., 'Ukuran Sepatu'

    @Column({
        type: 'simple-enum',
        enum: FieldType,
        default: FieldType.TEXT,
    })
    field_type: FieldType;

    @Column('simple-json', { nullable: true })
    options: string[]; // For DROPDOWN type, e.g., ['S', 'M', 'L', 'XL']

    @Column({ default: false })
    is_required: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
