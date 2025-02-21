'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';

interface CarbonGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalAdded: () => void;
  userId?: string;
}

interface CarbonGoalFormData {
  target_co2: number;
  previous_month_co2: number;
  target_month: Date;
  user_id?: string;
  is_global: boolean;
}

export const CarbonGoalModal: React.FC<CarbonGoalModalProps> = ({ 
  isOpen, 
  onClose, 
  onGoalAdded,
  userId 
}) => {
  const [formData, setFormData] = useState<CarbonGoalFormData>({
    target_co2: 0,
    previous_month_co2: 0,
    target_month: new Date(),
    user_id: userId,
    is_global: !userId,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/carbon-goals', formData);

      if (response.status === 201) {
        onGoalAdded();
        onClose();
        setFormData({
          target_co2: 0,
          previous_month_co2: 0,
          target_month: new Date(),
          user_id: userId,
          is_global: !userId,
        });
      }
    } catch (err: any) {
      console.error('Error creating carbon goal:', err);
      setError(err.response?.data?.message || 'Failed to create carbon goal');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {userId ? 'Ajouter un objectif carbone' : 'Ajouter un objectif global'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Objectif CO2 (kg)
            </label>
            <input
              type="number"
              step="0.01"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
              value={formData.target_co2}
              onChange={(e) => setFormData({ ...formData, target_co2: parseFloat(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              CO2 du mois précédent (kg)
            </label>
            <input
              type="number"
              step="0.01"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
              value={formData.previous_month_co2}
              onChange={(e) => setFormData({ ...formData, previous_month_co2: parseFloat(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mois cible
            </label>
            <input
              type="date"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
              value={formData.target_month.toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, target_month: new Date(e.target.value) })}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm mt-2">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
