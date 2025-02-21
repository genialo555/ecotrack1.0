import { IsString, IsUUID, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000, { message: 'Content must not exceed 2000 characters' })
  content: string;

  @IsUUID()
  recipient_id: string;
} 