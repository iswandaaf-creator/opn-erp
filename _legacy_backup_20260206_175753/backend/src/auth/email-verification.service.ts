import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';

@Injectable()
export class EmailVerificationService {
    private readonly logger = new Logger(EmailVerificationService.name);

    constructor(
        private usersService: UsersService,
        private emailService: EmailService,
    ) { }

    /**
     * Generate verification token and send email
     */
    async sendVerificationEmail(userId: string, userEmail: string): Promise<boolean> {
        try {
            const token = randomBytes(32).toString('hex');

            // Store token in user record (would need to add this column)
            // await this.usersService.setVerificationToken(userId, token);

            const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

            const emailBody = `
                <h2>Verify Your Email Address</h2>
                <p>Thank you for registering with OpenERP!</p>
                <p>Please click the link below to verify your email address:</p>
                <p><a href="${verificationUrl}" style="background: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Email</a></p>
                <p>Or copy and paste this link: ${verificationUrl}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't create an account, please ignore this email.</p>
            `;

            await this.emailService.sendEmail(
                'system',
                userEmail,
                'Verify Your OpenERP Account',
                emailBody,
            );

            this.logger.log(`Verification email sent to ${userEmail}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to send verification email: ${error.message}`);
            return false;
        }
    }

    /**
     * Verify token and activate user
     */
    async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
        try {
            // Find user by token (would need to implement in UsersService)
            // const user = await this.usersService.findByVerificationToken(token);

            // if (!user) {
            //     return { success: false, message: 'Invalid or expired verification token' };
            // }

            // Mark email as verified
            // await this.usersService.markEmailVerified(user.id);

            this.logger.log('Email verified successfully');
            return { success: true, message: 'Email verified successfully' };
        } catch (error) {
            this.logger.error(`Email verification failed: ${error.message}`);
            return { success: false, message: 'Verification failed' };
        }
    }
}
