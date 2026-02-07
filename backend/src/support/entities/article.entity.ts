import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TenantAwareEntity } from '../../tenancy/tenant-aware.entity';

@Entity('support_articles')
export class SupportArticle extends TenantAwareEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    content: string; // Markdown/HTML

    @Column({ nullable: true })
    context_tag: string; // e.g. 'invoice_page', 'pos_screen'

    @Column({ default: true })
    is_published: boolean;
}
