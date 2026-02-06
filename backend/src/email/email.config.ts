/**
 * Email Service Configuration
 * Uses Nodemailer for real SMTP email delivery
 */

export interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    from: string;
}

export function getEmailConfig(): EmailConfig {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        console.warn('⚠️ SMTP configuration not set - email sending disabled');
        return {
            host: '',
            port: 587,
            secure: false,
            auth: { user: '', pass: '' },
            from: 'noreply@openerp.local',
        };
    }

    return {
        host,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user, pass },
        from: process.env.SMTP_FROM || `OpenERP <${user}>`,
    };
}

export const isEmailConfigured = (): boolean => {
    return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
};
