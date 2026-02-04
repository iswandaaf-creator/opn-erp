import { Controller, Post, Get, Param, UploadedFile, UseInterceptors, Body, Res, Delete, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async uploadFile(
        @UploadedFile() file: any,
        @Body('entityId') entityId: string,
        @Body('entityType') entityType: string
    ) {
        return this.documentsService.saveFile(file, entityId, entityType);
    }

    @Get('list/:entityType/:entityId')
    getDocuments(
        @Param('entityType') entityType: string,
        @Param('entityId') entityId: string
    ) {
        return this.documentsService.findByEntity(entityId, entityType);
    }

    @Get('download/:id')
    async downloadFile(@Param('id') id: string, @Res() res: any) {
        const doc = await this.documentsService.findOne(id);
        if (!doc) {
            throw new NotFoundException('Document not found');
        }
        res.download(doc.path, doc.originalName);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.documentsService.delete(id);
    }

    @Post('send-email')
    async sendEmail(@Body() body: any) {
        // Mock Email Sending
        console.log(`[EMAIL MOCK] Sending email to ${body.recipient} with attachments:`, body.attachmentIds);
        return { success: true, message: 'Email queued successfully (Mock)' };
    }
}
