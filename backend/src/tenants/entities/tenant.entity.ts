import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tenants')
export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    company_name: string;

    @Column({ unique: true })
    schema_name: string;

    @Column({ nullable: true })
    subscription_plan: string;

    @Column({ default: 'ACTIVE' })
    status: string;

    @Column({ name: 'owner_email' })
    ownerEmail: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
