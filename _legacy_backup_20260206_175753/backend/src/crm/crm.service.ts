import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CrmService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
    ) { }

    create(createCustomerDto: Partial<Customer>) {
        const customer = this.customerRepository.create(createCustomerDto);
        return this.customerRepository.save(customer);
    }

    findAll() {
        return this.customerRepository.find();
    }

    findOne(id: number) {
        return this.customerRepository.findOneBy({ id });
    }

    update(id: number, updateCustomerDto: Partial<Customer>) {
        return this.customerRepository.update(id, updateCustomerDto);
    }

    remove(id: number) {
        return this.customerRepository.delete(id);
    }
}
