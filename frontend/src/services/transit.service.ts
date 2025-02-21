import axios from 'axios';

declare global {
  interface Window {
    google: typeof google;
  }
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
}

export interface TransitStep {
  mode: string;
  duration: number;
  distance: number;
  instructions: string;
  transit?: {
    departure_stop: {
      name: string;
      location: {
        lat: number;
        lng: number;
      };
    };
    arrival_stop: {
      name: string;
      location: {
        lat: number;
        lng: number;
      };
    };
    line: {
      vehicle: {
        type: string;
        name: string;
      };
      name: string;
      short_name?: string;
    };
  };
}

export interface TransitRoute {
  distance: number;
  duration: number;
  steps: TransitStep[];
  fare?: number;
  departure_time?: Date;
  arrival_time?: Date;
}

async function initGoogleMapsServices(): Promise<{
  directionsService: google.maps.DirectionsService;
  placesService: google.maps.places.PlacesService;
}> {
  // Create a temporary map div for PlacesService (required)
  const tempMapDiv = document.createElement('div');
  const map = new google.maps.Map(tempMapDiv, {
    center: { lat: 0, lng: 0 },
    zoom: 1
  });

  return {
    directionsService: new google.maps.DirectionsService(),
    placesService: new google.maps.places.PlacesService(map)
  };
}

async function findPlace(
  placesService: google.maps.places.PlacesService,
  query: string,
  isTrainStation: boolean = false
): Promise<google.maps.places.PlaceResult | null> {
  const request: google.maps.places.FindPlaceFromQueryRequest = {
    query: isTrainStation ? `gare ${query}` : query,
    fields: ['place_id', 'name', 'geometry', 'formatted_address'],
    locationBias: 'IP_BIAS'
  };

  return new Promise((resolve, reject) => {
    placesService.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        resolve(results[0]);
      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve(null);
      } else {
        reject(new Error(`Places API error: ${status}`));
      }
    });
  });
}

export async function findTrainStations(query: string): Promise<PlaceDetails[]> {
  try {
    const { placesService } = await initGoogleMapsServices();
    const place = await findPlace(placesService, query, true);
    if (!place || !place.place_id) {
      return [];
    }
    
    // Convert PlaceResult to PlaceDetails
    const placeDetails: PlaceDetails = {
      place_id: place.place_id,
      name: place.name || '',
      formatted_address: place.formatted_address || '',
      geometry: {
        location: {
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0
        }
      }
    };
    
    return [placeDetails];
  } catch (error) {
    console.error('Error finding train stations:', error);
    return [];
  }
}

export async function getTransitDirections(
  origin: string,
  destination: string,
  travelMode: google.maps.TravelMode | 'FLYING' = google.maps.TravelMode.TRANSIT
): Promise<TransitRoute[]> {
  try {
    const { directionsService, placesService } = await initGoogleMapsServices();

    // Handle FLYING mode
    if (travelMode === 'FLYING') {
      return getMockFlyingRoute(origin, destination);
    }

    // Find places for origin and destination
    const [originPlace, destinationPlace] = await Promise.all([
      findPlace(placesService, origin, travelMode === google.maps.TravelMode.TRANSIT),
      findPlace(placesService, destination, travelMode === google.maps.TravelMode.TRANSIT)
    ]);

    if (!originPlace || !destinationPlace) {
      throw new Error('Could not find location');
    }

    // Get directions
    const request: google.maps.DirectionsRequest = {
      origin: { 
        placeId: originPlace.place_id,
        location: originPlace.geometry?.location
      },
      destination: { 
        placeId: destinationPlace.place_id,
        location: destinationPlace.geometry?.location
      },
      travelMode: travelMode as google.maps.TravelMode,
      transitOptions: travelMode === google.maps.TravelMode.TRANSIT ? {
        modes: [
          google.maps.TransitMode.BUS,
          google.maps.TransitMode.RAIL,
          google.maps.TransitMode.SUBWAY,
          google.maps.TransitMode.TRAIN,
          google.maps.TransitMode.TRAM
        ],
        routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
      } : undefined,
      provideRouteAlternatives: true
    };

    const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          resolve(result);
        } else {
          reject(new Error(`Directions API error: ${status}`));
        }
      });
    });

    // Transform the result into our TransitRoute format
    return result.routes.map(route => {
      const leg = route.legs[0];
      return {
        distance: leg.distance?.value || 0,
        duration: leg.duration?.value || 0,
        steps: leg.steps?.map(step => ({
          mode: step.travel_mode.toLowerCase(),
          duration: step.duration?.value || 0,
          distance: step.distance?.value || 0,
          instructions: step.instructions || '',
          transit: step.transit ? {
            departure_stop: {
              name: step.transit.departure_stop?.name || '',
              location: {
                lat: step.transit.departure_stop?.location?.lat() || 0,
                lng: step.transit.departure_stop?.location?.lng() || 0
              }
            },
            arrival_stop: {
              name: step.transit.arrival_stop?.name || '',
              location: {
                lat: step.transit.arrival_stop?.location?.lat() || 0,
                lng: step.transit.arrival_stop?.location?.lng() || 0
              }
            },
            line: {
              vehicle: {
                type: step.transit.line?.vehicle?.type || 'BUS',
                name: step.transit.line?.vehicle?.name || 'Bus'
              },
              name: step.transit.line?.name || '',
              short_name: step.transit.line?.short_name
            }
          } : undefined
        })) || []
      };
    });
  } catch (error) {
    console.error('Error getting transit directions:', error);
    return getMockFlyingRoute(origin, destination);
  }
}

function getMockFlyingRoute(origin: string, destination: string): TransitRoute[] {
  return [{
    distance: 50000,
    duration: 7200,
    steps: [
      {
        mode: 'FLYING',
        duration: 7200,
        distance: 50000,
        instructions: `Flight from ${origin} to ${destination}`,
        transit: {
          departure_stop: {
            name: `${origin} Airport`,
            location: { lat: 48.8448, lng: 2.3735 }
          },
          arrival_stop: {
            name: `${destination} Airport`,
            location: { lat: 43.3038, lng: 5.3831 }
          },
          line: {
            vehicle: {
              type: 'AIRPLANE',
              name: 'Commercial Flight'
            },
            name: `${origin} ✈️ ${destination}`,
            short_name: 'FLIGHT'
          }
        }
      }
    ]
  }];
}

export async function getNearestAirports(
  lat: number,
  lng: number
): Promise<{ code: string; name: string; distance: number }[]> {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50000&type=airport&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.status !== 'OK') {
      throw new Error('Failed to find nearby airports');
    }

    return response.data.results.map((airport: any) => ({
      code: airport.place_id,
      name: airport.name,
      distance: calculateDistance(
        lat,
        lng,
        airport.geometry.location.lat,
        airport.geometry.location.lng
      ),
    }));
  } catch (error) {
    console.error('Airport search error:', error);
    throw new Error('Failed to find nearby airports');
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export async function getTrainPrices(
  origin: string,
  destination: string,
  date: Date
): Promise<{ low: number; high: number; currency: string }[]> {
  // Note: This is a mock implementation since Trainline doesn't provide a public API
  // In a real implementation, you would need to integrate with Trainline's API or use web scraping
  return [
    {
      low: Math.floor(Math.random() * 50) + 20,
      high: Math.floor(Math.random() * 50) + 50,
      currency: 'EUR',
    },
    {
      low: Math.floor(Math.random() * 50) + 25,
      high: Math.floor(Math.random() * 50) + 75,
      currency: 'EUR',
    }
  ];
}

export async function getFlightPrices(
  origin: string,
  destination: string,
  date: Date
): Promise<{ low: number; high: number; currency: string }[]> {
  // Note: This is a mock implementation
  // In a real implementation, you would need to integrate with a flight search API
  return [
    {
      low: Math.floor(Math.random() * 200) + 100,
      high: Math.floor(Math.random() * 200) + 300,
      currency: 'EUR',
    },
    {
      low: Math.floor(Math.random() * 150) + 50,
      high: Math.floor(Math.random() * 150) + 250,
      currency: 'EUR',
    }
  ];
}
