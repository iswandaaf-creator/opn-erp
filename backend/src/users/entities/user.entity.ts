import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN', // Can create companies
    OWNER = 'OWNER',             // Owns a company
    ADMIN = 'ADMIN',             // Company Admin
    MANAGER = 'MANAGER',
    USER = 'USER',
    EMPLOYEE = 'EMPLOYEE',       // Added for consistency with frontend
    CASHIER = 'CASHIER',         // Added for consistency with frontend
    HR_ADMIN = 'HR_ADMIN',
    INVENTORY = 'INVENTORY',
    PRODUCTION = 'PRODUCTION',
    PPIC = 'PPIC',               // Planning / MRP
    PURCHASING = 'PURCHASING',   // Procurement
    WAREHOUSE = 'WAREHOUSE',     // Gudang
    QUALITY_CONTROL = 'QUALITY_CONTROL', // QC
    SALES = 'SALES',             // Sales Admin
    FINANCE = 'FINANCE',         // Accounting
    ACCOUNTANT = 'ACCOUNTANT'    // Keep existing if used, or alias to FINANCE
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column()
    fullName: string;

    @Column({ unique: true, nullable: true })
    nip: string; // Nomor Induk Pegawai (Auto-generated numeric)

    @Column({
        type: 'simple-enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Company, (company) => company.users, { nullable: true })
    @JoinColumn({ name: 'companyId' })
    company: Company;

    @Column({ nullable: true })
    companyId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
