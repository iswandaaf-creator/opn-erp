import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
    private readonly SALT_ROUNDS = 10;

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        await this.seedUsers();
    }

    async seedUsers() {
        const defaultPassword = 'password123';

        // Hash the password for secure storage
        const hashedPassword = await bcrypt.hash(defaultPassword, this.SALT_ROUNDS);

        const usersToSeed = [
            {
                email: 'superadmin@erp.com',
                fullName: 'Super Admin',
                role: UserRole.SUPER_ADMIN,
                passwordHash: hashedPassword,
            },
            {
                email: 'admin@erp.com',
                fullName: 'Admin User',
                role: UserRole.ADMIN,
                passwordHash: hashedPassword,
            },
            {
                email: 'manager@erp.com',
                fullName: 'Manager User',
                role: UserRole.MANAGER,
                passwordHash: hashedPassword,
            },
            {
                email: 'staff@erp.com',
                fullName: 'Staff User',
                role: UserRole.USER,
                passwordHash: hashedPassword,
            },
        ];

        for (const userData of usersToSeed) {
            const existingUser = await this.usersRepository.findOne({ where: { email: userData.email } });
            if (!existingUser) {
                const nip = await this.generateNip();
                const user = this.usersRepository.create({ ...userData, nip });
                await this.usersRepository.save(user);
                console.log(`Seeded user: ${userData.email} with NIP: ${nip}`);
            } else {
                // FORCE RESET PASSWORD for verified users during this audit phase
                existingUser.passwordHash = hashedPassword;
                // Update role if changed
                existingUser.role = userData.role;
                await this.usersRepository.save(existingUser);
                console.log(`Updated user: ${userData.email} with default password.`);
            }
        }
    }

    async generateNip(): Promise<string> {
        // Format: YYYY + 4 digit sequence (e.g., 20240001)
        const year = new Date().getFullYear().toString();
        const lastUser = await this.usersRepository.createQueryBuilder('user')
            .where('user.nip LIKE :pattern', { pattern: `${year}%` })
            .orderBy('user.nip', 'DESC')
            .getOne();

        let sequence = 1;
        if (lastUser && lastUser.nip) {
            const lastSequence = parseInt(lastUser.nip.substring(4));
            sequence = lastSequence + 1;
        }

        return `${year}${sequence.toString().padStart(4, '0')}`;
    }

    async create(createUserDto: any) {
        const nip = await this.generateNip();
        const user = this.usersRepository.create({ ...createUserDto, nip });
        return this.usersRepository.save(user);
    }

    findAll() {
        return this.usersRepository.find();
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: any) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }
}
