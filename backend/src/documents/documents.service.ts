import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentAttachment } from './entities/document-attachment.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentsService {
    private readonly uploadPath = './uploads';

    constructor(
        @InjectRepository(DocumentAttachment)
        private documentRepo: Repository<DocumentAttachment>,
    ) {
        // Ensure upload directory exists
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }

    async saveFile(file: Express.Multer.File, entityId: string, entityType: string) {
        // In a real app, strict file type validation would go here

        const attachment = this.documentRepo.create({
            originalName: file.originalname,
            filename: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
            relatedEntityId: entityId,
            relatedEntityType: entityType
        });

        return this.documentRepo.save(attachment);
    }

    async findByEntity(entityId: string, entityType: string) {
        return this.documentRepo.find({
            where: { relatedEntityId: entityId, relatedEntityType: entityType },
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: string) {
        return this.documentRepo.findOneBy({ id });
    }

    async delete(id: string) {
        const doc = await this.findOne(id);
        if (doc) {
            // Delete from disk
            if (fs.existsSync(doc.path)) {
                fs.unlinkSync(doc.path);
            }
            return this.documentRepo.remove(doc);
        }
        return null;
    }
}
