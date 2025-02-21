// src/lib/hooks/useUserStats.ts
import { useState, useEffect } from 'react';
import { useJourneys } from './useJourneys';

interface UserStats {
 totalTrips: number; 
 totalEmissions: number;
 totalDistance: number;
 emissionsTrend: number;
 currentMonthEmissions: number;
 previousMonthEmissions: number;
 averageEmissionsPerTrip: number;
 loading: boolean;
 error: Error | null;
}

export function useUserStats(): UserStats {
 const [stats, setStats] = useState<UserStats>({
   totalTrips: 0,
   totalEmissions: 0,
   totalDistance: 0, 
   emissionsTrend: 0,
   currentMonthEmissions: 0,
   previousMonthEmissions: 0,
   averageEmissionsPerTrip: 0,
   loading: true,
   error: null
 });

 const { journeys, loading, error } = useJourneys();

 useEffect(() => {
   if (!loading && journeys) {
     try {
       const currentDate = new Date();
       const currentMonth = currentDate.getMonth();
       const currentYear = currentDate.getFullYear();

       // Filtrer les trajets du mois courant
       const currentMonthJourneys = journeys.filter(journey => {
         const journeyDate = new Date(journey.start_time);
         return journeyDate.getMonth() === currentMonth &&
                journeyDate.getFullYear() === currentYear;
       });

       // Filtrer les trajets du mois précédent
       const previousMonthJourneys = journeys.filter(journey => {
         const journeyDate = new Date(journey.start_time);
         const isPreviousMonth = currentMonth === 0 
           ? journeyDate.getMonth() === 11 && journeyDate.getFullYear() === currentYear - 1
           : journeyDate.getMonth() === currentMonth - 1 && journeyDate.getFullYear() === currentYear;
         return isPreviousMonth;
       });

       const currentMonthEmissions = currentMonthJourneys.reduce(
         (total, journey) => 
           total + (typeof journey.co2_emissions === 'number' ? journey.co2_emissions : 0), 
         0
       );

       const previousMonthEmissions = previousMonthJourneys.reduce(
         (total, journey) => 
           total + (typeof journey.co2_emissions === 'number' ? journey.co2_emissions : 0), 
         0
       );

       const emissionsTrend = previousMonthEmissions !== 0
         ? ((currentMonthEmissions - previousMonthEmissions) / previousMonthEmissions) * 100
         : 0;

       const totalDistance = currentMonthJourneys.reduce(
         (total, journey) => 
           total + (typeof journey.distance_km === 'number' ? journey.distance_km : 0), 
         0
       );

       const averageEmissionsPerTrip = currentMonthJourneys.length > 0
         ? currentMonthEmissions / currentMonthJourneys.length
         : 0;

       setStats({
         totalTrips: currentMonthJourneys.length,
         totalEmissions: currentMonthEmissions,
         totalDistance,
         emissionsTrend: Math.round(emissionsTrend * 100) / 100,
         currentMonthEmissions,
         previousMonthEmissions,
         averageEmissionsPerTrip,
         loading: false,
         error: null
       });

     } catch (err) {
       setStats(prev => ({
         ...prev,
         loading: false,
         error: err instanceof Error ? err : new Error('Erreur lors du calcul des statistiques')
       }));
     }
   }
 }, [journeys, loading]);

 return stats;
}