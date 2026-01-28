import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*', // Allow all for now, restrict in prod
    },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('EventsGateway');

    afterInit(server: Server) {
        this.logger.log('WebSocket Gateway Initialized');
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
        // Optional: Authenticate client here using JWT from query params
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    // Method to emit events to all clients
    emitEvent(event: string, data: any) {
        this.server.emit(event, data);
    }

    // Method to emit notifications specifically
    emitNotification(message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') {
        this.server.emit('notification', { message, type, time: new Date().toISOString() });
    }

    @SubscribeMessage('ping')
    handlePing(@MessageBody() data: string): string {
        return 'pong';
    }
}
