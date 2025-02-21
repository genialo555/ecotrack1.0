'use client';

import React from 'react';
import { useJourneyForm } from '../JourneyFormContext';
import { AddressSearch } from '../AddressSearch';
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import dynamic from 'next/dynamic';
import { AlertCircle, Loader2 } from 'lucide-react';

interface LocationStepProps {
  onNext: () => void;
}

const defaultCenter = { lat: 46.227638, lng: 2.213749 }; // Center of France

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ color: 'var(--muted-foreground)' }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry.fill',
      stylers: [{ color: 'var(--muted)' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{ color: 'var(--primary)' }],
    },
  ],
};

export const LocationStep: React.FC<LocationStepProps> = ({ onNext }) => {
  const { state, dispatch } = useJourneyForm();
  const [error, setError] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  });

  const handleLocationSelect = async () => {
    if (!state.origin || !state.destination) {
      setError('Please select both origin and destination');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const directionsService = new google.maps.DirectionsService();
      const result = await directionsService.route({
        origin: state.origin,
        destination: state.destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      // Calculate distance in kilometers
      const distance = result.routes[0].legs[0].distance?.value || 0;
      dispatch({ type: 'SET_DISTANCE', payload: distance / 1000 }); // Convert to km

      dispatch({ type: 'SET_ROUTE_DATA', payload: result });
      onNext();
    } catch (error) {
      console.error('Route calculation error:', error);
      setError('Could not calculate route. Please try different locations.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-foreground/90 mb-1">
            Origin
          </label>
          <AddressSearch
            id="origin"
            value={state.origin}
            onSelect={(value) => {
              setError('');
              dispatch({
                type: 'SET_LOCATIONS',
                payload: { origin: value, destination: state.destination },
              });
            }}
            error={!!state.errors.origin}
            placeholder="Enter origin address"
            className="w-full"
          />
          {state.errors.origin && (
            <p className="mt-1 text-sm text-destructive">
              {state.errors.origin}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-foreground/90 mb-1">
            Destination
          </label>
          <AddressSearch
            id="destination"
            value={state.destination}
            onSelect={(value) => {
              setError('');
              dispatch({
                type: 'SET_LOCATIONS',
                payload: { origin: state.origin, destination: value },
              });
            }}
            error={!!state.errors.destination}
            placeholder="Enter destination address"
            className="w-full"
          />
          {state.errors.destination && (
            <p className="mt-1 text-sm text-destructive">
              {state.errors.destination}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 dark:bg-destructive/20 border border-destructive/50">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="relative h-[300px] rounded-lg overflow-hidden border border-border/50">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={defaultCenter}
            zoom={5}
            options={mapOptions}
          >
            {state.routeData && (
              <DirectionsRenderer
                directions={state.routeData}
                options={{
                  suppressMarkers: false,
                  polylineOptions: {
                    strokeColor: 'hsl(var(--primary))',
                    strokeWeight: 4,
                  },
                }}
              />
            )}
          </GoogleMap>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleLocationSelect}
          disabled={!state.origin || !state.destination || isLoading}
          className="
            inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md
            hover:bg-primary/90 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-primary/50
          "
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Calculating Route...
            </>
          ) : (
            'Next'
          )}
        </button>
      </div>
    </div>
  );
};
