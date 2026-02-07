import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    // Get all conversations for current user
    @Get('conversations')
    async getConversations(@Req() req: any) {
        return this.chatService.getConversations(req.user.id);
    }

    // Get messages with a specific user
    @Get('messages/:partnerId')
    async getPersonalMessages(@Req() req: any, @Param('partnerId') partnerId: string) {
        return this.chatService.getPersonalMessages(req.user.id, partnerId);
    }

    // Send a personal message
    @Post('messages')
    async sendPersonalMessage(@Req() req: any, @Body() body: { receiverId: string; content: string }) {
        return this.chatService.sendPersonalMessage(req.user.id, body.receiverId, body.content);
    }

    // Get all groups for current user
    @Get('groups')
    async getUserGroups(@Req() req: any) {
        return this.chatService.getUserGroups(req.user.id);
    }

    // Create a new group
    @Post('groups')
    async createGroup(@Req() req: any, @Body() body: { name: string; description: string; memberIds: string[]; projectId?: number }) {
        return this.chatService.createGroup(
            req.user.id,
            body.name,
            body.description,
            body.memberIds,
            body.projectId
        );
    }

    // Get group details
    @Get('groups/:groupId')
    async getGroup(@Param('groupId') groupId: string) {
        return this.chatService.getGroup(parseInt(groupId));
    }

    // Get group messages
    @Get('groups/:groupId/messages')
    async getGroupMessages(@Param('groupId') groupId: string) {
        return this.chatService.getGroupMessages(parseInt(groupId));
    }

    // Send group message
    @Post('groups/:groupId/messages')
    async sendGroupMessage(@Req() req: any, @Param('groupId') groupId: string, @Body() body: { content: string }) {
        return this.chatService.sendGroupMessage(req.user.id, parseInt(groupId), body.content);
    }

    // Get all users for member selection
    @Get('users')
    async getAllUsers() {
        return this.chatService.getAllUsers();
    }
}
