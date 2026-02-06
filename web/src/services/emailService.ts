import api from './api';
import type { Email } from '../data/mockData';

class EmailService {
    async getInbox(): Promise<Email[]> {
        const response = await api.get('/emails/inbox');
        return this.mapEmails(response.data, 'inbox');
    }

    async getSent(): Promise<Email[]> {
        const response = await api.get('/emails/sent');
        return this.mapEmails(response.data, 'sent');
    }

    async getDrafts(): Promise<Email[]> {
        const response = await api.get('/emails/drafts');
        return this.mapEmails(response.data, 'drafts');
    }

    async getTrash(): Promise<Email[]> {
        const response = await api.get('/emails/trash');
        return this.mapEmails(response.data, 'trash');
    }

    async sendEmail(to: string, subject: string, body: string, attachments: File[]) {
        // Handle attachments (upload first or base64? For now simple mock-like struct)
        // Real implementation would involve FormData
        // const formData = new FormData();
        // ...
        // For PoC, let's just send text data
        return api.post('/emails', { to, subject, body });
    }

    async markAsRead(id: string) {
        return api.patch(`/emails/${id}/read`);
    }

    async toggleStar(id: string) {
        return api.patch(`/emails/${id}/star`);
    }

    async moveToTrash(id: string) {
        return api.delete(`/emails/${id}`);
    }

    private mapEmails(data: any[], folder: 'inbox' | 'sent' | 'drafts' | 'trash'): Email[] {
        return data.map((e: any) => ({
            id: e.id,
            sender: e.sender?.fullName || 'Unknown',
            subject: e.subject,
            body: e.body,
            date: new Date(e.createdAt).toLocaleDateString(),
            read: e.isRead,
            starred: e.isStarred,
            folder: folder,
            attachments: e.attachments
        }));
    }
}

export const emailService = new EmailService();
