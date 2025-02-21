import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../users/roles.enum';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createMessage(sender: User, createMessageDto: CreateMessageDto): Promise<Message> {
    // Vérifier que l'expéditeur est un admin
    if (sender.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can send messages');
    }

    const message = this.messageRepository.create({
      ...createMessageDto,
      sender_id: sender.id,
    });

    return this.messageRepository.save(message);
  }

  async getMessageById(id: string, user: User): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender', 'recipient'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Vérifier que l'utilisateur est autorisé à voir ce message
    if (user.role !== UserRole.ADMIN && message.recipient_id !== user.id) {
      throw new ForbiddenException('You are not authorized to view this message');
    }

    return message;
  }

  async getUserMessages(userId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { recipient_id: userId },
      relations: ['sender'],
      order: { created_at: 'DESC' },
    });
  }

  async markAsRead(id: string, user: User): Promise<Message> {
    const message = await this.getMessageById(id, user);
    
    if (message.recipient_id !== user.id) {
      throw new ForbiddenException('You can only mark your own messages as read');
    }

    message.is_read = true;
    return this.messageRepository.save(message);
  }

  async deleteMessage(id: string, user: User): Promise<void> {
    const message = await this.getMessageById(id, user);

    // Seul l'admin ou le destinataire peut supprimer le message
    if (user.role !== UserRole.ADMIN && message.recipient_id !== user.id) {
      throw new ForbiddenException('You are not authorized to delete this message');
    }

    await this.messageRepository.remove(message);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.messageRepository.count({
      where: {
        recipient_id: userId,
        is_read: false,
      },
    });
  }
} 