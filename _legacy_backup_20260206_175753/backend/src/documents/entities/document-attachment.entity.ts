import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('document_attachments')
export class DocumentAttachment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    originalName: string;

    @Column()
    filename: string;

    @Column()
    mimeType: string;

    @Column('int')
    size: number;

    @Column()
    path: string;

    @Column()
    relatedEntityId: string;

    @Column()
    relatedEntityType: string; // 'QUOTATION', 'INVOICE', 'ORDER', etc.

    @CreateDateColumn()
    createdAt: Date;
}
