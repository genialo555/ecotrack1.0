// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import differenceInMinutes from 'date-fns/differenceInMinutes';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistance(meters: number | null): string {
  if (meters === null) return '-';
  if (meters < 1000) {
    return `${new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 1
    }).format(meters)}m`;
  }
  return `${new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 1
  }).format(meters / 1000)}km`;
}

export function formatCO2(grams: number | null): string {
  if (grams === null) return '-';
  if (grams < 1000) {
    return `${new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 1
    }).format(grams)}g CO₂`;
  }
  return `${new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 1
  }).format(grams / 1000)}kg CO₂`;
}

export function formatDuration(start: string | null, end: string | null): string {
  if (!start || !end) return '-';
  try {
    const minutes = differenceInMinutes(new Date(end), new Date(start));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 
      ? `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`
      : `${remainingMinutes}m`;
  } catch (error) {
    return '-';
  }
}

export function calculateEmissions(distance: number, type: 'car' | 'train' | 'plane'): number {
  // Valeurs moyennes en g/km
  const EMISSION_FACTORS = {
    car: 170,    // Moyenne pour une voiture essence
    train: 14,   // Train électrique
    plane: 285   // Vol court-courrier
  }
  
  return (distance / 1000) * EMISSION_FACTORS[type]
}