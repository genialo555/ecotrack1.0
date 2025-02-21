import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Message } from './message.entity';

@Entity('message_attachments')
@Check(`file_size <= 5242880`) // 5MB max
export class MessageAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  original_filename: string;

  @Column()
  mime_type: string;

  @Column('int')
  file_size: number;

  @Column()
  file_path: string;

  @Column('uuid')
  message_id: string;

  @ManyToOne(() => Message, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @CreateDateColumn()
  created_at: Date;

  // Champs de sécurité supplémentaires
  @Column()
  checksum: string; // Pour vérifier l'intégrité du fichier

  @Column({ default: true })
  is_safe: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
} 