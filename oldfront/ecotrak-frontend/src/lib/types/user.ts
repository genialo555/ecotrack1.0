// src/lib/types/user.ts

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',

}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  companyId?: string;
  createdAt: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  role: UserRole;
  companyId?: string;
}
