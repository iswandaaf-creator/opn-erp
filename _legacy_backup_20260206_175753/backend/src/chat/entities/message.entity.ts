import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    senderId: string;

    @Column({ nullable: true })
    receiverId: string;

    @Column({ nullable: true })
    groupId: number;

    @Column('text')
    content: string;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'receiverId' })
    receiver: User;
}
