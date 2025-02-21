// src/lib/services/auth.service.ts
import { User } from '../types/auth';
import { api } from '../utils/api-client';

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string | null;
    lastName: string | null;
    isActive: boolean;
  };
}

export class AuthService {
  static async login(email: string, password: string): Promise<LoginResponse> {
    console.log('🔒 Tentative de connexion:', email);
    return api.post<LoginResponse>('/api/auth/login', { email, password });
  }

  static async getCurrentUser(): Promise<User> {
    console.log('🔍 Vérification de la session utilisateur');
    return api.get<User>('/api/auth/profile');
  }

  static async logout(): Promise<void> {
    return api.post<void>('/api/auth/logout');
  }
}