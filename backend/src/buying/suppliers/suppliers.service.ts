import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class SuppliersService {
    constructor(
        @InjectRepository(Supplier)
        private suppliersRepository: Repository<Supplier>,
    ) { }

    findAll() {
        return this.suppliersRepository.find();
    }

    findOne(id: number) {
        return this.suppliersRepository.findOneBy({ id });
    }

    create(data: Partial<Supplier>) {
        const supplier = this.suppliersRepository.create(data);
        return this.suppliersRepository.save(supplier);
    }

    async update(id: number, data: Partial<Supplier>) {
        await this.suppliersRepository.update(id, data);
        return this.findOne(id);
    }

    remove(id: number) {
        return this.suppliersRepository.delete(id);
    }
}
