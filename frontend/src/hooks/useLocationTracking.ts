import { useState, useEffect } from 'react';
import { updateUserLocation } from '@/services/tracking.service';
import type { LocationUpdate } from '@/services/tracking.service';

interface LocationTrackingOptions {
  enabled?: boolean;
  updateInterval?: number;
  enableHighAccuracy?: boolean;
}

export const useLocationTracking = (options: LocationTrackingOptions = {}) => {
  const {
    enabled = true,
    updateInterval = 10000, // 10 seconds
    enableHighAccuracy = true
  } = options;

  const [location, setLocation] = useState<LocationUpdate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let watchId: number;
    let updateIntervalId: NodeJS.Timeout;

    const handlePositionUpdate = async (position: GeolocationPosition) => {
      const newLocation: LocationUpdate = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(),
        isActive: true
      };

      setLocation(newLocation);
      setError(null);

      try {
        await updateUserLocation(newLocation);
      } catch (err) {
        console.error('Failed to update location:', err);
        // Don't set error state here to avoid UI disruption
      }
    };

    const handleError = (err: GeolocationPositionError) => {
      setError(err.message);
      setIsTracking(false);
    };

    const startTracking = () => {
      if ('geolocation' in navigator) {
        setIsTracking(true);

        // Get initial position
        navigator.geolocation.getCurrentPosition(
          handlePositionUpdate,
          handleError,
          { enableHighAccuracy }
        );

        // Watch for position changes
        watchId = navigator.geolocation.watchPosition(
          handlePositionUpdate,
          handleError,
          {
            enableHighAccuracy,
            timeout: 5000,
            maximumAge: 0
          }
        );

        // Set up interval for periodic updates to backend
        updateIntervalId = setInterval(async () => {
          if (location) {
            try {
              await updateUserLocation(location);
            } catch (err) {
              console.error('Failed to update location:', err);
            }
          }
        }, updateInterval);
      } else {
        setError('Geolocation is not supported by your browser');
        setIsTracking(false);
      }
    };

    startTracking();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (updateIntervalId) {
        clearInterval(updateIntervalId);
      }
      setIsTracking(false);
    };
  }, [enabled, updateInterval, enableHighAccuracy]);

  const stopTracking = () => {
    setIsTracking(false);
    if (location) {
      updateUserLocation({ ...location, isActive: false }).catch(console.error);
    }
  };

  return { location, error, isTracking, stopTracking };
};
