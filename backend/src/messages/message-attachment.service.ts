 import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageAttachment } from './entities/message-attachment.entity';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class MessageAttachmentService {
  constructor(
    @InjectRepository(MessageAttachment)
    private attachmentRepo: Repository<MessageAttachment>,
    private s3Service: S3Service,
  ) {}

  async uploadAttachment(
    file: Express.Multer.File,
    messageId: string,
    userId: string,
    keepExifData: boolean = false,
  ): Promise<MessageAttachment> {
    const uploadResult = await this.s3Service.upload(file.buffer, {
      contentType: file.mimetype,
      metadata: {
        messageId,
        userId,
        originalName: file.originalname,
      },
    });
    
    const attachment = new MessageAttachment();
    attachment.message_id = messageId;
    attachment.filename = uploadResult.key;
    attachment.original_filename = file.originalname;
    attachment.file_size = file.size;
    attachment.mime_type = file.mimetype;
    attachment.file_path = uploadResult.Location;

    return this.attachmentRepo.save(attachment);
  }

  async getAttachment(id: string): Promise<MessageAttachment> {
    return this.attachmentRepo.findOne({ where: { id } });
  }

  async findByMessageId(messageId: string): Promise<MessageAttachment[]> {
    return this.attachmentRepo.find({ where: { message_id: messageId } });
  }

  async deleteAttachment(id: string): Promise<void> {
    const attachment = await this.attachmentRepo.findOne({ where: { id } });
    if (attachment) {
      await this.s3Service.delete(attachment.file_path);
      await this.attachmentRepo.remove(attachment);
    }
  }
}