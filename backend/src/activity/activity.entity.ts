import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from 'typeorm';
import { User } from '../users/user.entity';

export enum ActivityType {
  VEHICLE = 'vehicle',
  JOURNEY = 'journey',
  USER = 'user'
}

export enum ActivityAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ActivityType,
    enumName: 'activities_type_enum'
  })
  @Index()
  type: ActivityType;

  @Column({
    type: 'enum',
    enum: ActivityAction,
    enumName: 'activities_action_enum'
  })
  action: ActivityAction;

  @Column('jsonb')
  details: Record<string, any>;

  @CreateDateColumn()
  @Index()
  timestamp: Date;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid')
  @Index()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
