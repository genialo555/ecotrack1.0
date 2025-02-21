// ecotrak/frontend/src/components/journey/GmapsJourneyDetails/GmapsJourneyDetails.tsx
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, DirectionsRenderer, Marker, Polyline } from '@react-google-maps/api';
import { toast } from 'react-hot-toast';
import { NextDeparturesList } from './components/NextDeparturesList';

interface GmapsJourneyDetailsProps {
  journey: {
    origin: string;
    destination: string;
    transportMode: google.maps.TravelMode | 'FLYING';
    startLatitude?: number;
    startLongitude?: number;
    endLatitude?: number;
    endLongitude?: number;
  };
  onComplete: () => void;
  onConfirm: (distance: number, duration: number) => void;
}

interface MarkerData {
  position: google.maps.LatLngLiteral;
  label?: string;
  title?: string;
}

interface TransitDeparture {
  line: string;
  departure: string;
  arrival: string;
  stops: number;
}

export const GmapsJourneyDetails: React.FC<GmapsJourneyDetailsProps> = ({
  journey,
  onComplete,
  onConfirm
}) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [polylinePath, setPolylinePath] = useState<google.maps.LatLngLiteral[]>([]);
  const [nextDepartures, setNextDepartures] = useState<TransitDeparture[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!journey.origin || !journey.destination) return;

    const calculateRoute = async () => {
      setIsCalculating(true);
      const directionsService = new google.maps.DirectionsService();

      try {
        // Skip Google Maps directions for FLYING mode
        if (journey.transportMode === 'FLYING') {
          // For flying mode, we'll create a direct line between points
          if (journey.startLatitude && journey.startLongitude && journey.endLatitude && journey.endLongitude) {
            const path = [
              { lat: journey.startLatitude, lng: journey.startLongitude },
              { lat: journey.endLatitude, lng: journey.endLongitude }
            ];
            setPolylinePath(path);
            setMarkers([
              { position: path[0], label: 'A' },
              { position: path[1], label: 'B' }
            ]);

            // Center the map on the midpoint
            const midLat = (journey.startLatitude + journey.endLatitude) / 2;
            const midLng = (journey.startLongitude + journey.endLongitude) / 2;
            mapRef.current?.setCenter({ lat: midLat, lng: midLng });
            mapRef.current?.fitBounds(new google.maps.LatLngBounds(
              new google.maps.LatLng(path[0]),
              new google.maps.LatLng(path[1])
            ));

            // Calculate straight-line distance for flying mode
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(path[0]),
              new google.maps.LatLng(path[1])
            );
            // Assume average flight speed of 800 km/h
            const duration = (distance / 1000) / 800 * 3600; // Convert to seconds
            onConfirm(distance, duration);
          }
          setIsCalculating(false);
          return;
        }

        // For non-flying modes, use Google Maps Directions
        const result = await directionsService.route({
          origin: journey.origin,
          destination: journey.destination,
          travelMode: journey.transportMode as google.maps.TravelMode,
          transitOptions: journey.transportMode === google.maps.TravelMode.TRANSIT ? {
            departureTime: new Date(),
          } : undefined,
        });

        if (result && result.routes && result.routes[0] && result.routes[0].legs && result.routes[0].legs[0]) {
          const leg = result.routes[0].legs[0];
          setDirections(result);

          // Set markers
          setMarkers([
            {
              position: {
                lat: leg.start_location.lat(),
                lng: leg.start_location.lng()
              },
              label: 'A',
              title: journey.origin
            },
            {
              position: {
                lat: leg.end_location.lat(),
                lng: leg.end_location.lng()
              },
              label: 'B',
              title: journey.destination
            }
          ]);

          // Set polyline path
          if (result.routes[0].overview_path) {
            const path = result.routes[0].overview_path.map(point => ({
              lat: point.lat(),
              lng: point.lng()
            }));
            setPolylinePath(path);
          }

          // Handle transit details
          if (journey.transportMode === google.maps.TravelMode.TRANSIT) {
            const transitSteps = leg.steps.filter(step => step.travel_mode === 'TRANSIT');
            const departures = transitSteps.map(step => ({
              line: step.transit?.line?.short_name || step.transit?.line?.name || '',
              departure: step.transit?.departure_time?.text || '',
              arrival: step.transit?.arrival_time?.text || '',
              stops: step.transit?.num_stops || 0
            }));
            setNextDepartures(departures);
          }

          // Fit bounds
          if (mapRef.current) {
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(leg.start_location);
            bounds.extend(leg.end_location);
            mapRef.current.fitBounds(bounds);
          }
        }
      } catch (error) {
        console.error('Error calculating route:', error);
        toast.error('Erreur lors du calcul de l\'itinéraire');
      } finally {
        setIsCalculating(false);
      }
    };

    calculateRoute();
  }, [journey]);

  const handleConfirmClick = () => {
    if (!directions?.routes?.[0]?.legs?.[0]) {
      toast.error('Données de trajet non disponibles');
      return;
    }

    const leg = directions.routes[0].legs[0];
    if (!leg.distance?.value || !leg.duration?.value) {
      toast.error('Distance ou durée non disponible');
      return;
    }

    // Only pass the route information to parent without creating a journey
    onConfirm(leg.distance.value, leg.duration.value);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative flex-1 min-h-[400px]">
        <GoogleMap
          mapContainerClassName="w-full h-full rounded-lg"
          zoom={12}
          onLoad={onMapLoad}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: '#3B82F6',
                  strokeWeight: 4,
                }
              }}
            />
          )}

          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              label={marker.label}
              title={marker.title}
            />
          ))}

          {journey.transportMode === 'FLYING' && polylinePath.length > 0 && (
            <Polyline
              path={polylinePath}
              options={{
                strokeColor: '#3B82F6',
                strokeWeight: 2,
                geodesic: true,
              }}
            />
          )}
        </GoogleMap>
      </div>

      {/* Journey Details */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mt-4">
        <div className="space-y-4">
          {/* Route Details */}
          <div className="bg-base-200 p-3 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">De: </span>
                  <span className="font-medium">{journey.origin}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">À: </span>
                  <span className="font-medium">{journey.destination}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Next Departures for Transit */}
          {journey.transportMode === google.maps.TravelMode.TRANSIT && nextDepartures.length > 0 && (
            <div className="bg-base-200 p-3 rounded-lg">
              <NextDeparturesList departures={nextDepartures} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              className="btn btn-outline btn-sm"
              onClick={onComplete}
            >
              Annuler
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleConfirmClick}
              disabled={isCalculating || !directions?.routes?.[0]?.legs?.[0]?.distance?.value}
            >
              {isCalculating ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Calcul en cours...
                </>
              ) : (
                'Confirmer le trajet'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
