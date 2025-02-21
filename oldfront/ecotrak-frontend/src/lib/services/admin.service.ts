import { apiClient } from '../utils/api-client';
import { User, CreateUserDTO } from '../types/user';

export class AdminService {
  static async getUsers(): Promise<User[]> {
    try {
      // Appel en GET : /admin/users
      return await apiClient('/admin/users');
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
      throw error;
    }
  }

  static async createUser(
    userData: CreateUserDTO & { first_name?: string; last_name?: string }
  ): Promise<User> {
    try {
      // Préparation des données utilisateur
      const payload = {
        email: userData.email,
        password: userData.password, // mot de passe en clair (hachage côté backend)
        role: userData.role,
        companyId: userData.companyId,
        first_name: userData.first_name,
        last_name: userData.last_name,
      };

      // Envoi en POST vers /admin/users
      return await apiClient('/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur :", error);
      throw error;
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      // Envoi en DELETE vers /admin/users/:id
      await apiClient(`/admin/users/${userId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      throw error;
    }
  }
}
