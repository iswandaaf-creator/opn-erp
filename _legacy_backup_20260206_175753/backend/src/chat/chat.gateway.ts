import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    pingTimeout: 60000,
    pingInterval: 25000,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private readonly logger = new Logger(ChatGateway.name);

    @WebSocketServer()
    server: Server;

    // Track online users: userId -> socketId[]
    private onlineUsers = new Map<string, string[]>();

    constructor(private readonly chatService: ChatService) { }

    afterInit(server: Server) {
        this.logger.log('🔌 WebSocket Gateway initialized');

        server.on('connection_error', (err) => {
            this.logger.error(`WebSocket connection error: ${err.message}`);
        });
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        const userId = client.handshake.query.userId as string;
        if (userId) {
            this.addUser(userId, client.id);
            this.broadcastOnlineStatus(userId, true);
        }

        // Handle client errors
        client.on('error', (err) => {
            this.logger.error(`Client ${client.id} error: ${err.message}`);
        });
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        const userId = this.removeUser(client.id);
        if (userId) {
            this.broadcastOnlineStatus(userId, false);
        }
    }

    private addUser(userId: string, socketId: string) {
        let userSockets = this.onlineUsers.get(userId);
        if (!userSockets) {
            userSockets = [];
            this.onlineUsers.set(userId, userSockets);
        }
        userSockets.push(socketId);
    }

    private removeUser(socketId: string): string | null {
        for (const [userId, sockets] of this.onlineUsers.entries()) {
            const index = sockets.indexOf(socketId);
            if (index !== -1) {
                sockets.splice(index, 1);
                if (sockets.length === 0) {
                    this.onlineUsers.delete(userId);
                    return userId;
                }
                return null; // User still has other connected sockets
            }
        }
        return null;
    }

    private broadcastOnlineStatus(userId: string, isOnline: boolean) {
        this.server.emit('userStatus', { userId, status: isOnline ? 'online' : 'offline' });
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @MessageBody() payload: { senderId: string; receiverId?: string; groupId?: number; content: string },
        @ConnectedSocket() client: Socket,
    ) {
        // Save to DB
        let message;
        if (payload.groupId) {
            message = await this.chatService.sendGroupMessage(payload.senderId, payload.groupId, payload.content);
            // Broadcast to room (or filtered users)
            // For now, simple broadcast to all clients or specific room if we implemented rooms
            // this.server.to(`group_${payload.groupId}`).emit('newMessage', message);
            // But since we didn't implement joinRoom yet, let's just emit to everyone for PoC or implement rooms now.
            this.server.emit(`group_${payload.groupId}`, message);
        } else if (payload.receiverId) {
            message = await this.chatService.sendPersonalMessage(payload.senderId, payload.receiverId, payload.content);

            // Emit to receiver
            const receiverSockets = this.onlineUsers.get(payload.receiverId);
            if (receiverSockets) {
                receiverSockets.forEach(id => this.server.to(id).emit('newMessage', message));
            }

            // Emit back to sender (for confirmation/multi-device sync)
            const senderSockets = this.onlineUsers.get(payload.senderId);
            if (senderSockets) {
                senderSockets.forEach(id => this.server.to(id).emit('newMessage', message));
            }
        }
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
        client.join(room);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
        client.leave(room);
    }

    @SubscribeMessage('typing')
    handleTyping(@MessageBody() payload: { senderId: string, receiverId: string }) {
        const receiverSockets = this.onlineUsers.get(payload.receiverId);
        if (receiverSockets) {
            receiverSockets.forEach(id => this.server.to(id).emit('typing', { userId: payload.senderId }));
        }
    }
}
