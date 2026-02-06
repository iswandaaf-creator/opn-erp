import io, { Socket } from 'socket.io-client';
import api from './api';
import type { Message, Conversation } from '../data/mockData';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ChatService {
    private socket: Socket | null = null;
    private userId: string | null = null;

    initialize(userId: string) {
        if (this.socket) return;
        this.userId = userId;
        this.socket = io(SOCKET_URL, {
            query: { userId },
            transports: ['websocket'],
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket?.id);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    onNewMessage(callback: (message: Message) => void) {
        if (!this.socket) return;
        this.socket.on('newMessage', (message: any) => {
            // Transform backend message to frontend Message interface
            const formattedMessage: Message = {
                id: message.id,
                senderId: message.senderId,
                content: message.content,
                timestamp: new Date(message.createdAt).getTime(),
                isMe: message.senderId === this.userId,
                type: 'text', // Assuming text for now
            };
            callback(formattedMessage);
        });
    }

    onUserStatus(callback: (status: { userId: string, status: string }) => void) {
        if (!this.socket) return;
        this.socket.on('userStatus', callback);
    }

    // API Calls
    async getConversations(): Promise<Conversation[]> {
        const response = await api.get('/chat/conversations');
        // Transform backend response to frontend Conversation interface
        return response.data.map((conv: any) => ({
            id: conv.partnerId,
            name: conv.partnerName,
            lastMessage: conv.lastMessage,
            timestamp: new Date(conv.lastMessageAt).getTime(),
            unreadCount: conv.unreadCount,
            members: [
                { id: conv.partnerId, name: conv.partnerName, avatar: '', role: 'user', status: 'offline' }, // Placeholder
                { id: 'me', name: 'Me', avatar: '', role: 'user', status: 'online' }
            ],
            isGroup: false,
            messages: []
        }));
    }

    async getMessages(partnerId: string): Promise<Message[]> {
        const response = await api.get(`/chat/messages/${partnerId}`);
        return response.data.map((msg: any) => ({
            id: msg.id,
            senderId: msg.senderId,
            content: msg.content,
            timestamp: new Date(msg.createdAt).getTime(),
            isMe: msg.senderId === this.userId,
            type: 'text'
        }));
    }

    async sendMessage(receiverId: string, content: string): Promise<Message> {
        // Optimistic UI update or wait for ack?
        // Let's use Socket for sending too for real-time feel, or API. 
        // Logic: Send via Socket, or API. If API, Gateway broadcasts.
        // Let's use API for consistency and persistence guarantee return
        const response = await api.post('/chat/messages', { receiverId, content });
        const msg = response.data;
        return {
            id: msg.id,
            senderId: msg.senderId,
            content: msg.content,
            timestamp: new Date(msg.createdAt).getTime(),
            isMe: true,
            type: 'text'
        };
    }
}

export const chatService = new ChatService();
