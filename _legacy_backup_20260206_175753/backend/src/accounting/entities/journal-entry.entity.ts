import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { JournalLine } from './journal-line.entity';

@Entity('journal_entries')
export class JournalEntry {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    reference: string; // e.g., ORDER-123

    @Column()
    description: string;

    @Column({ type: 'date' })
    date: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => JournalLine, (line) => line.entry, { cascade: true })
    lines: JournalLine[];
}
