// src/lib/hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { User, CreateUserDTO } from '../types/user';
import { AdminService } from '../services/admin.service';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await AdminService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users//impossible de trouver le /user/'));
    } finally {
      setLoading(false);
    }
  }

  async function createUser(userData: CreateUserDTO) {
    const newUser = await AdminService.createUser(userData);
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }

  async function deleteUser(userId: string) {
    await AdminService.deleteUser(userId);
    setUsers(prev => prev.filter(user => user.id !== userId));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    createUser,
    deleteUser,
    refreshUsers: fetchUsers
  };
}