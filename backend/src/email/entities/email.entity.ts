import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('emails')
export class Email {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    senderId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @Column()
    receiverId: string; // Could be multiple, but simplest start is 1-to-1 or use a pivot table for multiple

    @ManyToOne(() => User)
    @JoinColumn({ name: 'receiverId' })
    receiver: User;

    @Column()
    subject: string;

    @Column('text')
    body: string;

    @Column({ default: false })
    isRead: boolean;

    @Column({ default: false })
    isStarred: boolean;

    @Column({ default: false })
    isArchived: boolean;

    @Column({ default: false })
    isDeleted: boolean; // Trash

    // Folder is dynamic: if receiver == me && !deleted -> INBOX
    // if sender == me && !deleted -> SENT
    // isDeleted -> TRASH
    // isDraft -> DRAFTS (need flag)

    @Column({ default: false })
    isDraft: boolean;

    @Column('simple-json', { nullable: true })
    attachments: { name: string; url: string; type: string; size: number }[];

    @CreateDateColumn()
    createdAt: Date;
}
