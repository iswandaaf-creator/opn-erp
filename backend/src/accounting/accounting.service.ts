import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry } from './entities/journal-entry.entity';

@Injectable()
export class AccountingService {
    constructor(
        @InjectRepository(JournalEntry)
        private journalRepository: Repository<JournalEntry>,
    ) { }

    async createEntry(dto: { reference: string; description: string; date: string; lines: any[] }) {
        const entry = this.journalRepository.create(dto);
        return this.journalRepository.save(entry);
    }

    findAll() {
        return this.journalRepository.find({ relations: ['lines'] });
    }

    findOne(id: string) {
        return this.journalRepository.findOne({ where: { id }, relations: ['lines'] });
    }
}
