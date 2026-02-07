import { Controller, Get, Post, Body, Param, Req, UseGuards, Patch, Delete } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('emails')
@UseGuards(JwtAuthGuard)
export class EmailController {
    constructor(private readonly emailService: EmailService) { }

    @Post()
    async sendEmail(@Req() req: any, @Body() body: { to: string; subject: string; body: string; attachments?: any[] }) {
        return this.emailService.sendEmail(req.user.id, body.to, body.subject, body.body, body.attachments);
    }

    @Post('drafts')
    async saveDraft(@Req() req: any, @Body() body: { subject: string; body: string; attachments?: any[] }) {
        return this.emailService.saveDraft(req.user.id, body.subject, body.body, body.attachments);
    }

    @Get('inbox')
    async getInbox(@Req() req: any) {
        return this.emailService.getInbox(req.user.id);
    }

    @Get('sent')
    async getSent(@Req() req: any) {
        return this.emailService.getSent(req.user.id);
    }

    @Get('drafts')
    async getDrafts(@Req() req: any) {
        return this.emailService.getDrafts(req.user.id);
    }

    @Get('trash')
    async getTrash(@Req() req: any) {
        return this.emailService.getTrash(req.user.id);
    }

    @Patch(':id/read')
    async markAsRead(@Param('id') id: string) {
        return this.emailService.markAsRead(id);
    }

    @Patch(':id/star')
    async toggleStar(@Param('id') id: string) {
        return this.emailService.toggleStar(id);
    }

    @Delete(':id')
    async moveToTrash(@Param('id') id: string) {
        return this.emailService.moveToTrash(id);
    }
}
