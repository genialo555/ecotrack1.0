// src/lib/hooks/useJourneys.ts
import { useState, useEffect } from 'react';
import { Journey, CreateJourneyDTO } from '../types/journey';
import { api } from '../utils/api-client';

export function useJourneys() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Récupérer tous les trajets
  async function fetchJourneys() {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching journeys...');
      const data = await api.get<Journey[]>('/api/journeys');
      console.log('Fetched journeys:', data);
      setJourneys(data);
    } catch (err) {
      console.error('Erreur lors du chargement des trajets:', err);
      setError(err instanceof Error ? err : new Error('Erreur lors du chargement des trajets'));
    } finally {
      setLoading(false);
    }
  }

  // Ajouter un nouveau trajet
  async function addJourney(journey: CreateJourneyDTO): Promise<Journey> {
    try {
      setError(null);
      const newJourney = await api.post<Journey>('/api/journeys', journey);
      setJourneys(prev => [...prev, newJourney]);
      return newJourney;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du trajet:', err);
      throw err instanceof Error ? err : new Error('Erreur lors de l\'ajout du trajet');
    }
  }

  // Modifier un trajet existant
  async function updateJourney(id: string, updates: UpdateJourneyDTO): Promise<Journey> {
    try {
      setError(null);
      const updatedJourney = await api.patch<Journey>(`/api/journeys/${id}`, updates);
      setJourneys(prev =>
        prev.map(journey => (journey.id === id ? updatedJourney : journey))
      );
      return updatedJourney;
    } catch (err) {
      console.error('Erreur lors de la modification du trajet:', err);
      throw err instanceof Error ? err : new Error('Erreur lors de la modification du trajet');
    }
  }

  // Supprimer un trajet
  async function deleteJourney(id: string): Promise<void> {
    try {
      setError(null);
      await api.delete(`/api/journeys/${id}`);
      setJourneys(prev => prev.filter(journey => journey.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du trajet:', err);
      throw err instanceof Error ? err : new Error('Erreur lors de la suppression du trajet');
    }
  }

  // Récupérer un seul trajet par ID
  async function getJourneyById(id: string): Promise<Journey> {
    try {
      setError(null);
      const journey = await api.get<Journey>(`/api/journeys/${id}`);
      if (!journey) {
        throw new Error('Trajet non trouvé');
      }
      return journey;
    } catch (err) {
      console.error('Erreur lors de la récupération du trajet:', err);
      throw err instanceof Error ? err : new Error('Erreur lors de la récupération du trajet');
    }
  }

  useEffect(() => {
    fetchJourneys();
  }, []);

  return {
    journeys,
    loading,
    error,
    addJourney,
    updateJourney,
    deleteJourney,
    getJourneyById,
    refreshJourneys: fetchJourneys
  };
}