import { Vehicle } from './vehicle';
import { Journey } from './journey';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager'
}

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login: Date | null;
  failed_login_attempts: number;
  last_latitude: number | null;
  last_longitude: number | null;
  last_location_update: Date | null;
  journeys?: Journey[];
  vehicles?: Vehicle[];
}

export interface CreateUserDto {
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
  is_active?: boolean;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

// Fonction utilitaire pour normaliser un utilisateur
export const normalizeUser = (user: User) => ({
  id: user.id,
  email: user.email,
  first_name: user.first_name,
  last_name: user.last_name,
  role: user.role,
  is_active: user.is_active,
  created_at: user.created_at,
  updated_at: user.updated_at
});
