import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/roles.enum';
import { CurrentUser } from '../auth/current-user.decorator';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../users/user.entity';
import { MessageAttachmentService } from './message-attachment.service';

@Controller('messages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly attachmentService: MessageAttachmentService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async createMessage(
    @CurrentUser() user: User,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.createMessage(user, createMessageDto);
  }

  @Get()
  async getUserMessages(@CurrentUser() user: User) {
    return this.messagesService.getUserMessages(user.id);
  }

  @Get('unread/count')
  async getUnreadCount(@CurrentUser() user: User) {
    return {
      count: await this.messagesService.getUnreadCount(user.id),
    };
  }

  @Get(':id')
  async getMessage(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.messagesService.getMessageById(id, user);
  }

  @Post(':id/read')
  async markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.messagesService.markAsRead(id, user);
  }

  @Delete(':id')
  async deleteMessage(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    await this.messagesService.deleteMessage(id, user);
    return { message: 'Message deleted successfully' };
  }

  @Post(':id/attachments')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAttachment(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
    @Query('keepExifData') keepExifData = false,
  ) {
    return this.attachmentService.uploadAttachment(file, id, user.id, keepExifData);
  }

  @Get(':id/attachments/:attachmentId')
  async getAttachment(
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
    @CurrentUser() user: User,
  ) {
    return this.attachmentService.getAttachment(attachmentId);
  }

  @Delete(':id/attachments/:attachmentId')
  async deleteAttachment(
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
    @CurrentUser() user: User,
  ) {
    await this.attachmentService.deleteAttachment(attachmentId);
    return { message: 'Attachment deleted successfully' };
  }
} 