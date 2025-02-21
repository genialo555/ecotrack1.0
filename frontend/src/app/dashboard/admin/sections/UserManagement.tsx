'use client';

import React, { useEffect, useState } from 'react';
import { AddUserModal } from './AddUserModal';
import { CarbonGoalModal } from './CarbonGoalModal';
import { UpdateUserModal } from './UpdateUserModal';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  isActive: boolean;
  created_at: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isCarbonGoalModalOpen, setIsCarbonGoalModalOpen] = useState(false);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}`, {
        is_active: isActive,
      });
      fetchUsers(); // Refresh user list
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  const handleAddCarbonGoal = (userId: string) => {
    setSelectedUserId(userId);
    setIsCarbonGoalModalOpen(true);
  };

  const handleUpdateUser = (userId: string) => {
    setSelectedUserId(userId);
    setIsUpdateUserModalOpen(true);
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestion des utilisateurs
        </h2>
        <div className="space-x-2">
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="btn btn-primary"
          >
            Ajouter un utilisateur
          </button>
          <button
            onClick={() => {
              setSelectedUserId(undefined);
              setIsCarbonGoalModalOpen(true);
            }}
            className="btn btn-secondary"
          >
            Objectif global
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          className="input input-bordered w-full max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-4">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center py-4">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Email</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Date de création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.last_name}</td>
                  <td>{user.first_name}</td>
                  <td>{user.role}</td>
                  <td>
                    <label className="cursor-pointer label">
                      <input
                        type="checkbox"
                        className="toggle toggle-success"
                        checked={user.isActive}
                        onChange={(e) => handleUpdateUserStatus(user.id, e.target.checked)}
                      />
                    </label>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateUser(user.id)}
                        className="btn btn-sm btn-secondary"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleAddCarbonGoal(user.id)}
                        className="btn btn-sm btn-secondary"
                      >
                        Objectif CO2
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onUserAdded={fetchUsers}
      />

      <CarbonGoalModal
        isOpen={isCarbonGoalModalOpen}
        onClose={() => {
          setIsCarbonGoalModalOpen(false);
          setSelectedUserId(undefined);
        }}
        onGoalAdded={() => {
          // Optionally refresh data if needed
        }}
        userId={selectedUserId}
      />

      <UpdateUserModal
        isOpen={isUpdateUserModalOpen}
        onClose={() => {
          setIsUpdateUserModalOpen(false);
          setSelectedUserId(undefined);
        }}
        onUserUpdated={fetchUsers}
        userId={selectedUserId}
      />
    </div>
  );
};
