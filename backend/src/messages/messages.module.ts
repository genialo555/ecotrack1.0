import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { MessageAttachment } from './entities/message-attachment.entity';
import { MessageAttachmentService } from './message-attachment.service';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, MessageAttachment]),
    S3Module
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessageAttachmentService],
  exports: [MessagesService, MessageAttachmentService],
})
export class MessagesModule {}