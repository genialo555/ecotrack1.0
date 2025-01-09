import { Expose } from 'class-transformer';

export class UserDto {
  @Expose() id: string;
  @Expose() email: string;
  @Expose() first_name: string;
  @Expose() last_name: string;
  @Expose() role: string;
  @Expose() is_active: boolean;
  @Expose() created_at: Date;
  @Expose() updated_at: Date;
}
