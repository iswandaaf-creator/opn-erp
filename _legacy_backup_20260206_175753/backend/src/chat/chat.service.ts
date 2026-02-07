import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { Message } from './entities/message.entity';
import { ChatGroup } from './entities/chat-group.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @InjectRepository(ChatGroup)
        private groupRepository: Repository<ChatGroup>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    // Get all conversations for a user
    async getConversations(userId: string) {
        // Get personal conversations
        const messages = await this.messageRepository
            .createQueryBuilder('message')
            .where('message.senderId = :userId OR message.receiverId = :userId', { userId })
            .andWhere('message.groupId IS NULL')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.receiver', 'receiver')
            .orderBy('message.createdAt', 'DESC')
            .getMany();

        // Group by conversation partner
        const conversationMap = new Map();
        messages.forEach(msg => {
            const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
            if (partnerId && !conversationMap.has(partnerId)) {
                const partner = msg.senderId === userId ? msg.receiver : msg.sender;
                conversationMap.set(partnerId, {
                    partnerId,
                    partnerName: partner?.fullName || 'Unknown',
                    lastMessage: msg.content,
                    lastMessageAt: msg.createdAt,
                    unreadCount: 0,
                });
            }
        });

        return Array.from(conversationMap.values());
    }

    // Get messages with a specific user
    async getPersonalMessages(userId: string, partnerId: string) {
        const messages = await this.messageRepository.find({
            where: [
                { senderId: userId, receiverId: partnerId, groupId: IsNull() },
                { senderId: partnerId, receiverId: userId, groupId: IsNull() },
            ],
            order: { createdAt: 'ASC' },
        });

        // Mark as read
        await this.messageRepository.update(
            { senderId: partnerId, receiverId: userId, isRead: false },
            { isRead: true }
        );

        return messages;
    }

    // Send a personal message
    async sendPersonalMessage(senderId: string, receiverId: string, content: string) {
        const message = this.messageRepository.create({
            senderId,
            receiverId,
            content,
        });
        return this.messageRepository.save(message);
    }

    // Get user's groups
    async getUserGroups(userId: string) {
        const groups = await this.groupRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.members', 'member')
            .where('member.id = :userId', { userId })
            .orWhere('group.createdById = :userId', { userId })
            .getMany();

        return groups;
    }

    // Create a new group
    async createGroup(createdById: string, name: string, description: string, memberIds: string[], projectId?: number) {
        const members = await this.userRepository.findBy({ id: In(memberIds) });
        const creator = await this.userRepository.findOne({ where: { id: createdById } });

        if (creator && !members.find(m => m.id === createdById)) {
            members.push(creator);
        }

        const group = this.groupRepository.create({
            name,
            description,
            projectId,
            createdById,
            members,
        });

        return this.groupRepository.save(group);
    }

    // Get group messages
    async getGroupMessages(groupId: number) {
        return this.messageRepository.find({
            where: { groupId },
            order: { createdAt: 'ASC' },
        });
    }

    // Send group message
    async sendGroupMessage(senderId: string, groupId: number, content: string) {
        const message = this.messageRepository.create({
            senderId,
            groupId,
            content,
        });
        return this.messageRepository.save(message);
    }

    // Get group details
    async getGroup(groupId: number) {
        return this.groupRepository.findOne({
            where: { id: groupId },
            relations: ['members'],
        });
    }

    // Get all users for selection
    async getAllUsers() {
        return this.userRepository.find({
            select: ['id', 'fullName', 'email', 'role'],
        });
    }
}
