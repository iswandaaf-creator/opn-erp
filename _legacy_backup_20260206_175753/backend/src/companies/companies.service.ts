import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectRepository(Company)
        private companiesRepository: Repository<Company>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createCompanyDto: any) {
        // 1. Create Company
        const company = this.companiesRepository.create({
            name: createCompanyDto.name,
            address: createCompanyDto.address,
        });
        const savedCompany = await this.companiesRepository.save(company);

        // 2. Create Owner User
        const owner = this.usersRepository.create({
            email: createCompanyDto.ownerEmail,
            fullName: createCompanyDto.ownerName,
            passwordHash: createCompanyDto.password, // TODO: Apply hashing
            role: UserRole.OWNER,
            company: savedCompany,
            companyId: savedCompany.id,
        });
        await this.usersRepository.save(owner);

        return savedCompany;
    }

    findAll() {
        return this.companiesRepository.find({ relations: ['users'] });
    }

    findOne(id: string) {
        return this.companiesRepository.findOne({ where: { id }, relations: ['users'] });
    }
}
