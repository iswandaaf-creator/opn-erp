import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { JournalEntry } from './journal-entry.entity';

@Entity('journal_lines')
export class JournalLine {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => JournalEntry, (entry) => entry.lines)
    entry: JournalEntry;

    @Column()
    accountName: string; // e.g., Cash, Revenue, AR

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    debit: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    credit: number;
}
