import React, { useState } from 'react';

interface MapPreviewProps {
  origin: string;
  destination: string;
}

export const MapPreview: React.FC<MapPreviewProps> = ({ origin, destination }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!origin || !destination) return null;

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  
  return (
    <div className={`map-preview ${isLoading ? 'map-preview--loading' : ''} ${hasError ? 'map-preview--error' : ''}`}>
      {isLoading && (
        <div className="map-preview__loading-spinner" />
      )}
      
      {hasError ? (
        <div className="map-preview__error-message">
          Impossible de charger la carte. Veuillez vérifier votre connexion et réessayer.
        </div>
      ) : (
        <iframe
          className="map-preview__iframe"
          src={`https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=driving&language=fr&region=FR`}
          onLoad={handleLoad}
          onError={handleError}
          allowFullScreen
        />
      )}
    </div>
  );
};
