import { useState, useEffect, useRef, useCallback } from 'react';
import { DirectionsService } from '@react-google-maps/api';
import { toast } from 'react-hot-toast';
import type { JourneyDetails } from '@/components/journey/GmapsCardSelector';

interface UseGoogleMapsJourneyReturn {
  directions: google.maps.DirectionsResult | null;
  distance: number;
  duration: number;
  error: string | null;
  mapCenter: google.maps.LatLngLiteral;
  markers: { position: google.maps.LatLngLiteral; label?: string }[];
  route: google.maps.DirectionsRoute | null;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  mapZoom: number;
  polylinePath: google.maps.LatLngLiteral[] | null;
  nextDepartures: any[];
  handleFlightPath: () => void;
  isCalculating: boolean;
}

export const useGoogleMapsJourney = (
  journey: JourneyDetails,
  isLoaded: boolean,
  onConfirm?: (distance: number, duration: number) => void
): UseGoogleMapsJourneyReturn => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 48.8566, lng: 2.3522 });
  const [markers, setMarkers] = useState<{ position: google.maps.LatLngLiteral; label?: string }[]>([]);
  const [route, setRoute] = useState<google.maps.DirectionsRoute | null>(null);
  const [mapZoom, setMapZoom] = useState(12);
  const [polylinePath, setPolylinePath] = useState<google.maps.LatLngLiteral[] | null>(null);
  const [nextDepartures, setNextDepartures] = useState<any[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const calculateFlightDistance = useCallback((start: google.maps.LatLng, end: google.maps.LatLng): number => {
    return google.maps.geometry.spherical.computeDistanceBetween(start, end);
  }, []);

  useEffect(() => {
    if (!isLoaded || !journey?.origin || !journey?.destination) {
      return;
    }

    const calculateRoute = async () => {
      setIsCalculating(true);
      setError(null);

      const directionsService = new google.maps.DirectionsService();
      const geocoder = new google.maps.Geocoder();

      try {
        if (journey.travelMode === 'FLYING') {
          // Handle flight path calculation
          const [originResult, destResult] = await Promise.all([
            geocodeAddress(geocoder, journey.origin),
            geocodeAddress(geocoder, journey.destination)
          ]);

          const originLocation = originResult.geometry.location;
          const destLocation = destResult.geometry.location;

          // Calculate flight distance using haversine formula
          const flightDistance = google.maps.geometry.spherical.computeDistanceBetween(
            originLocation,
            destLocation
          );

          // Assume average flight speed of 800 km/h plus 2 hours for airport procedures
          const flightDuration = (flightDistance / 800000) * 3600 + 7200;

          setDistance(flightDistance);
          setDuration(flightDuration);
          setMapCenter({ lat: originLocation.lat(), lng: originLocation.lng() });
          setMapZoom(5);

          setPolylinePath([
            { lat: originLocation.lat(), lng: originLocation.lng() },
            { lat: destLocation.lat(), lng: destLocation.lng() }
          ]);

          setMarkers([
            {
              position: { lat: originLocation.lat(), lng: originLocation.lng() },
              label: 'A',
            },
            {
              position: { lat: destLocation.lat(), lng: destLocation.lng() },
              label: 'B',
            },
          ]);

          // Fit bounds
          if (mapRef.current) {
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(originLocation);
            bounds.extend(destLocation);
            mapRef.current.fitBounds(bounds);
          }

        } else {
          // Get coordinates for origin and destination
          const [originResult, destResult] = await Promise.all([
            geocodeAddress(geocoder, journey.origin),
            geocodeAddress(geocoder, journey.destination)
          ]);

          const request: google.maps.DirectionsRequest = {
            origin: originResult.geometry.location,
            destination: destResult.geometry.location,
            travelMode: journey.travelMode as google.maps.TravelMode,
            transitOptions: journey.travelMode === 'TRANSIT' ? {
              departureTime: new Date(),
              modes: ['BUS', 'RAIL', 'SUBWAY', 'TRAIN', 'TRAM'],
            } : undefined,
          };

          const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
            directionsService.route(request, (result, status) => {
              if (status === 'OK') resolve(result);
              else reject(new Error(`Error calculating route: ${status}`));
            });
          });

          // Extract route information
          const route = result.routes[0];
          const leg = route.legs[0];
          
          setDirections(result);
          setDistance(leg.distance?.value || 0);
          setDuration(leg.duration?.value || 0);
          setMapCenter(leg.start_location);
          setRoute(route);

          // Set markers
          setMarkers([
            {
              position: leg.start_location,
              label: 'A',
            },
            {
              position: leg.end_location,
              label: 'B',
            },
          ]);

          // Handle transit specific data
          if (journey.travelMode === 'TRANSIT') {
            const departures = leg.steps
              .filter(step => step.travel_mode === 'TRANSIT')
              .map(step => ({
                line: step.transit?.line?.short_name || step.transit?.line?.name,
                departure: step.transit?.departure_time?.text,
                arrival: step.transit?.arrival_time?.text,
                stops: step.transit?.num_stops,
              }));
            setNextDepartures(departures);
          }

          // Fit map bounds
          if (mapRef.current) {
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(leg.start_location);
            bounds.extend(leg.end_location);
            mapRef.current.fitBounds(bounds);
          }

        }
      } catch (err) {
        console.error('Error calculating route:', err);
        setError('Erreur lors du calcul de l\'itinéraire');
        toast.error('Erreur lors du calcul de l\'itinéraire');
      } finally {
        setIsCalculating(false);
      }
    };

    calculateRoute();
  }, [journey, isLoaded, calculateFlightDistance, onConfirm]);

  const geocodeAddress = (geocoder: google.maps.Geocoder, address: string): Promise<google.maps.GeocoderResult> => {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          resolve(results[0]);
        } else {
          reject(new Error(`Geocoding failed for address: ${address}`));
        }
      });
    });
  };

  const handleFlightPath = useCallback(() => {
    if (!journey?.startLatitude || !journey?.startLongitude || !journey?.endLatitude || !journey?.endLongitude) {
      return;
    }

    try {
      const geocoder = new google.maps.Geocoder();
      const [originResult, destResult] = Promise.all([
        geocodeAddress(geocoder, journey.origin),
        geocodeAddress(geocoder, journey.destination)
      ]);

      const path = [
        originResult.geometry.location,
        destResult.geometry.location,
      ];

      setPolylinePath([
        { lat: journey.startLatitude, lng: journey.startLongitude },
        { lat: journey.endLatitude, lng: journey.endLongitude }
      ]);
      setMapCenter({ lat: journey.startLatitude, lng: journey.startLongitude });
      setMapZoom(5);

      // Calculate approximate distance and duration for flight
      const distance = calculateFlightDistance(originResult.geometry.location, destResult.geometry.location);
      
      // Assume average flight speed of 800 km/h
      const duration = (distance / 800000) * 3600;

      setDistance(distance);
      setDuration(duration);

      setMarkers([
        {
          position: { lat: journey.startLatitude, lng: journey.startLongitude },
          label: 'A',
        },
        {
          position: { lat: journey.endLatitude, lng: journey.endLongitude },
          label: 'B',
        },
      ]);

    } catch (err) {
      console.error('Error calculating flight path:', err);
      setError('Erreur lors du calcul du trajet aérien');
      toast.error('Erreur lors du calcul du trajet aérien');
    }
  }, [journey, calculateFlightDistance]);

  return {
    directions,
    distance,
    duration,
    error,
    mapCenter,
    markers,
    route,
    mapRef,
    mapZoom,
    polylinePath,
    nextDepartures,
    handleFlightPath,
    isCalculating,
  };
};
