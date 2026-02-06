import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email } from './entities/email.entity';
import { getEmailConfig, isEmailConfigured } from './email.config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
    private readonly logger = new Logger(EmailService.name);
    private transporter: Transporter | null = null;

    constructor(
        @InjectRepository(Email)
        private emailRepository: Repository<Email>,
    ) { }

    async onModuleInit() {
        if (isEmailConfigured()) {
            const config = getEmailConfig();
            this.transporter = nodemailer.createTransport({
                host: config.host,
                port: config.port,
                secure: config.secure,
                auth: config.auth,
            });

            try {
                await this.transporter.verify();
                this.logger.log('✅ Email service connected to SMTP server');
            } catch (error) {
                this.logger.error('❌ Failed to connect to SMTP server:', error);
                this.transporter = null;
            }
        } else {
            this.logger.warn('⚠️ SMTP not configured - emails will only be stored in DB');
        }
    }

    // Send email - saves to DB and optionally sends via SMTP
    async sendEmail(senderId: string, receiverId: string, subject: string, body: string, attachments: any[] = []) {
        // Save to database
        const email = this.emailRepository.create({
            senderId,
            receiverId,
            subject,
            body,
            attachments,
            isDraft: false,
        });
        const savedEmail = await this.emailRepository.save(email);

        // Send via SMTP if configured
        if (this.transporter && receiverId.includes('@')) {
            try {
                const config = getEmailConfig();
                await this.transporter.sendMail({
                    from: config.from,
                    to: receiverId,
                    subject,
                    html: body,
                });
                this.logger.log(`📧 Email sent to ${receiverId}: ${subject}`);
            } catch (error) {
                this.logger.error(`Failed to send email to ${receiverId}:`, error);
                // Email is still saved in DB, just not sent externally
            }
        }

        return savedEmail;
    }

    // Save draft
    async saveDraft(senderId: string, subject: string, body: string, attachments: any[] = []) {
        const email = this.emailRepository.create({
            senderId,
            receiverId: '', // Draft might not have receiver yet
            subject,
            body,
            attachments,
            isDraft: true,
        });
        return this.emailRepository.save(email);
    }

    // Get Inbox
    async getInbox(userId: string) {
        return this.emailRepository.find({
            where: { receiverId: userId, isDeleted: false, isDraft: false },
            relations: ['sender'],
            order: { createdAt: 'DESC' },
        });
    }

    // Get Sent
    async getSent(userId: string) {
        return this.emailRepository.find({
            where: { senderId: userId, isDeleted: false, isDraft: false },
            relations: ['receiver'],
            order: { createdAt: 'DESC' },
        });
    }

    // Get Drafts
    async getDrafts(userId: string) {
        return this.emailRepository.find({
            where: { senderId: userId, isDraft: true, isDeleted: false },
            order: { createdAt: 'DESC' },
        });
    }

    // Get Trash
    async getTrash(userId: string) {
        return this.emailRepository.find({
            where: [
                { receiverId: userId, isDeleted: true },
                { senderId: userId, isDeleted: true }
            ],
            relations: ['sender', 'receiver'],
            order: { createdAt: 'DESC' },
        });
    }

    // Mark as Read
    async markAsRead(emailId: string) {
        return this.emailRepository.update(emailId, { isRead: true });
    }

    // Toggle Star
    async toggleStar(emailId: string) {
        const email = await this.emailRepository.findOneBy({ id: emailId });
        if (email) {
            return this.emailRepository.update(emailId, { isStarred: !email.isStarred });
        }
    }

    // Move to Trash
    async moveToTrash(emailId: string) {
        return this.emailRepository.update(emailId, { isDeleted: true });
    }

    // Delete Permanently
    async deletePermanently(emailId: string) {
        return this.emailRepository.delete(emailId);
    }

    // Check if email service is configured
    isConfigured(): boolean {
        return this.transporter !== null;
    }
}

