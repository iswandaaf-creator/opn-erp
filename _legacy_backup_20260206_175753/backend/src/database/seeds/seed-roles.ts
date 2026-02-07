import { DataSource } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import { Company } from '../../companies/entities/company.entity';
import * as bcrypt from 'bcrypt';
import * as path from 'path';

async function seed() {
    const isProduction = !!process.env.DATABASE_URL;

    // Adjust database path for SQLite to be absolute or relative to execution
    const dbPath = path.resolve(__dirname, '../../../db.sqlite');

    const dataSource = new DataSource({
        type: isProduction ? 'postgres' : 'sqlite',
        url: isProduction ? process.env.DATABASE_URL : undefined,
        database: isProduction ? undefined : dbPath, // Use absolute path for safety
        entities: [User, Company],
        synchronize: true, // Sync schema to ensure tables exist
        ssl: isProduction ? { rejectUnauthorized: false } : undefined,
    } as any);

    try {
        await dataSource.initialize();
        console.log('Database connected');

        const userRepository = dataSource.getRepository(User);

        const rolesToSeed = [
            { email: 'ppic@openerp.com', role: UserRole.PPIC, name: 'PPIC Staff' },
            { email: 'purchasing@openerp.com', role: UserRole.PURCHASING, name: 'Purchasing Staff' },
            { email: 'warehouse@openerp.com', role: UserRole.WAREHOUSE, name: 'Warehouse Staff' },
            { email: 'production@openerp.com', role: UserRole.PRODUCTION, name: 'Production Staff' },
            { email: 'qc@openerp.com', role: UserRole.QUALITY_CONTROL, name: 'QC Staff' },
            { email: 'sales_admin@openerp.com', role: UserRole.SALES, name: 'Sales Admin' },
            { email: 'finance@openerp.com', role: UserRole.FINANCE, name: 'Finance Staff' },
        ];

        for (const userData of rolesToSeed) {
            const existing = await userRepository.findOne({ where: { email: userData.email } });
            if (!existing) {
                const hashedPassword = await bcrypt.hash('password', 10);
                const user = userRepository.create({
                    email: userData.email,
                    passwordHash: hashedPassword,
                    fullName: userData.name,
                    role: userData.role,
                    isActive: true,
                    // nip is optional
                });
                await userRepository.save(user);
                console.log(`Created user: ${userData.email}`);
            } else {
                console.log(`User already exists: ${userData.email}`);
            }
        }

        await dataSource.destroy();
        console.log('Seeding completed');
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
