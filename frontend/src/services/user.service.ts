import { User, normalizeUser } from '@/types/user';
import { api } from '@/lib/api';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const { data } = await api.get('/admin/users');
      return data.map(normalizeUser);
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      throw error?.response?.data?.message || error.message || 'Failed to fetch users';
    }
  },

  getUserById: async (id: string): Promise<User> => {
    try {
      const { data } = await api.get(`/admin/users/${id}`);
      return normalizeUser(data);
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      throw error?.response?.data?.message || error.message || 'Failed to fetch user';
    }
  },

  // Fonction utilitaire pour formater le nom complet
  formatUserName: (user: User): string => {
    return `${user.first_name} ${user.last_name}`;
  }
};
