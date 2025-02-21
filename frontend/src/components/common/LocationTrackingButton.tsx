import React, { useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { reverseGeocode } from '@/services/google-maps.service';
import { toast } from 'react-hot-toast';

interface LocationTrackingButtonProps {
  onLocationUpdate?: (location: { 
    latitude: number; 
    longitude: number;
    address?: string;
  }) => void;
  className?: string;
}

export const LocationTrackingButton: React.FC<LocationTrackingButtonProps> = ({
  onLocationUpdate,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Géolocalisation non supportée par votre navigateur'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error: GeolocationPositionError) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  };

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Get current location
      const location = await getCurrentLocation();
      
      try {
        // Get address using reverse geocoding
        const result = await reverseGeocode(location.lat, location.lng);
        
        onLocationUpdate?.({
          latitude: result.latitude,
          longitude: result.longitude,
          address: result.address
        });
        
        toast.success('Position actuelle enregistrée');
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        // Still update with coordinates even if geocoding fails
        onLocationUpdate?.({
          latitude: location.lat,
          longitude: location.lng
        });
        toast.success('Position actuelle enregistrée (coordonnées uniquement)');
      }
    } catch (error) {
      console.error('Location error:', error);
      let errorMessage = 'Impossible d\'obtenir votre position';
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            errorMessage = 'Veuillez autoriser l\'accès à votre position';
            break;
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            errorMessage = 'Position non disponible';
            break;
          case GeolocationPositionError.TIMEOUT:
            errorMessage = 'Délai d\'attente dépassé';
            break;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`btn btn-circle ${isLoading ? 'loading' : ''} ${className}`}
      title="Utiliser ma position actuelle"
    >
      {!isLoading && (
        <MapPinIcon className="h-6 w-6 transition-transform hover:scale-110" />
      )}
    </button>
  );
};
