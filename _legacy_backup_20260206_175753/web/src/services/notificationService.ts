// Notification Service for Web Push
class NotificationService {
    private static instance: NotificationService;
    private registration: ServiceWorkerRegistration | null = null;
    private permission: NotificationPermission = 'default';

    private constructor() {
        this.permission = 'Notification' in window ? Notification.permission : 'denied';
    }

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    async initialize(): Promise<boolean> {
        if (!('serviceWorker' in navigator) || !('Notification' in window)) {
            console.warn('Service Worker or Notifications not supported');
            return false;
        }

        try {
            // Register service worker
            this.registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('Service Worker registered:', this.registration);

            // Wait for service worker to be ready
            await navigator.serviceWorker.ready;

            return true;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return false;
        }
    }

    async requestPermission(): Promise<NotificationPermission> {
        if (!('Notification' in window)) {
            console.warn('Notifications not supported');
            return 'denied';
        }

        if (this.permission === 'granted') {
            return 'granted';
        }

        this.permission = await Notification.requestPermission();
        return this.permission;
    }

    async showNotification(title: string, options?: {
        body?: string;
        icon?: string;
        badge?: string;
        tag?: string;
        data?: any;
        requireInteraction?: boolean;
    }): Promise<boolean> {
        if (this.permission !== 'granted') {
            const permission = await this.requestPermission();
            if (permission !== 'granted') {
                console.warn('Notification permission denied');
                return false;
            }
        }

        if (!this.registration) {
            await this.initialize();
        }

        if (!this.registration) {
            console.error('No service worker registration');
            return false;
        }

        try {
            await this.registration.showNotification(title, {
                body: options?.body || '',
                icon: options?.icon || '/logo192.png',
                badge: options?.badge || '/logo192.png',
                tag: options?.tag || 'openerp-notification',
                data: options?.data || {},
                requireInteraction: options?.requireInteraction || false
            });

            return true;
        } catch (error) {
            console.error('Failed to show notification:', error);
            return false;
        }
    }

    // Helper methods for specific notification types
    async notifyNewMessage(from: string, message: string) {
        return this.showNotification(`New message from ${from}`, {
            body: message,
            icon: '/logo192.png',
            tag: 'chat-message',
            data: { type: 'chat', from },
            requireInteraction: false
        });
    }

    async notifyNewEmail(from: string, subject: string) {
        return this.showNotification(`New email from ${from}`, {
            body: subject,
            icon: '/logo192.png',
            tag: 'email',
            data: { type: 'email', from },
            requireInteraction: false
        });
    }

    async notifySystemAlert(title: string, message: string) {
        return this.showNotification(title, {
            body: message,
            icon: '/logo192.png',
            tag: 'system-alert',
            data: { type: 'system' },
            requireInteraction: true
        });
    }

    getPermission(): NotificationPermission {
        return this.permission;
    }

    isSupported(): boolean {
        return 'serviceWorker' in navigator && 'Notification' in window;
    }
}

export const notificationService = NotificationService.getInstance();
export default NotificationService;
