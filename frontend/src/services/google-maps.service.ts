import { Libraries, useLoadScript } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export interface GeocodingResult {
  address: string;
  latitude: number;
  longitude: number;
}

export const libraries: Libraries = ['places', 'geometry'];

export function useGoogleMapsScript() {
  return useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });
}

export async function initGoogleMaps(): Promise<void> {
  if (window.google && window.google.maps) {
    return;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=${libraries.join(',')}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodingResult> {
  try {
    await initGoogleMaps();
    
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({
      location: { lat, lng }
    });

    if (response.results && response.results[0]) {
      const result = response.results[0];
      return {
        address: result.formatted_address,
        latitude: lat,
        longitude: lng
      };
    }

    throw new Error('No results found');
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
}

export async function geocode(address: string): Promise<GeocodingResult> {
  try {
    await initGoogleMaps();
    
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({
      address
    });

    if (response.results && response.results[0]) {
      const result = response.results[0];
      const location = result.geometry.location;
      
      return {
        address: result.formatted_address,
        latitude: location.lat(),
        longitude: location.lng()
      };
    }

    throw new Error('No results found');
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}
