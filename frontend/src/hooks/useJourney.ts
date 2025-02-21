import { useState, useCallback } from 'react';
import type { CreateJourneyDto } from '../types/journey.dto';

interface UseJourneyProps {
  userId: string;
  vehicleId: string;
}

export const useJourney = ({ userId, vehicleId }: UseJourneyProps) => {
  const [journey, setJourney] = useState<Partial<CreateJourneyDto>>({
    userId,
    vehicleId,
    start_time: new Date(),
  });

  const updateJourney = useCallback((updates: Partial<CreateJourneyDto>) => {
    setJourney(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const updateLocation = useCallback((location: google.maps.LatLng, isStart: boolean = true) => {
    const updates: Partial<CreateJourneyDto> = {
      ...(isStart ? {
        startLatitude: location.lat(),
        startLongitude: location.lng(),
      } : {
        endLatitude: location.lat(),
        endLongitude: location.lng(),
      })
    };
    setJourney(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const completeJourney = useCallback(() => {
    setJourney(prev => ({
      ...prev,
      end_time: new Date(),
    }));
  }, []);

  return {
    journey,
    updateJourney,
    updateLocation,
    completeJourney,
  };
};
