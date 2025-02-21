// src/lib/types/auth.ts
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  role: UserRole;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}