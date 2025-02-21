import axios from 'axios';

interface Airport {
  id: string;
  name: string;
  cityName: string;
  cityId: string;
  countryName: string;
  countryId: string;
  iata: string;
  latitude: number;
  longitude: number;
}

export interface SkyId {
  entityId: string;
  name: string;
  cityName?: string;
  countryName: string;
  type: 'PLACE' | 'AIRPORT' | 'CITY';
  iata?: string;
  photoUri?: string;
}

interface FlightSearchParams {
  fromEntityId: string;
  toEntityId?: string;
  departDate: string;
  returnDate?: string;
  type?: 'oneway' | 'roundtrip';
}

interface FlightDestination {
  cityName: string;
  countryName: string;
  price: {
    amount: number;
    currency: string;
  };
  departureDate: string;
  returnDate?: string;
}

interface FlightResponse {
  itineraries: Array<{
    legs: Array<{
      originPlaceId: string;
      destinationPlaceId: string;
      departureDateTime: string;
      arrivalDateTime: string;
      durationInMinutes: number;
      distance?: number; // in km
      segments: Array<{
        operatingCarrier: {
          name: string;
        };
      }>;
    }>;
  }>;
}

export async function searchAirports(query: string): Promise<SkyId[]> {
  try {
    const options = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination',
      params: { query },
      headers: {
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
        'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || ''
      }
    };

    const response = await axios.request(options);
    console.log('API Response:', response.data);

    if (!response.data.status || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch cities');
    }

    // Map the response to our format, focusing on cities
    const cities = response.data.data
      .filter((item: any) => item.type === 'CITY')
      .map((item: any) => ({
        entityId: item.id,
        name: item.name,
        cityName: item.cityName || item.name,
        countryName: item.countryName,
        type: 'CITY',
        iata: item.code,
        photoUri: item.photoUri
      }));

    return cities;
  } catch (error) {
    console.error('Error fetching cities:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Impossible de récupérer la liste des villes. Veuillez réessayer plus tard.');
    }
    throw new Error('Impossible de récupérer la liste des villes. Veuillez réessayer plus tard.');
  }
}

export async function getSkyIdList(): Promise<SkyId[]> {
  try {
    const response = await fetch(`https://sky-scanner3.p.rapidapi.com/flights/auto-complete?query=`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'sky-scanner3.p.rapidapi.com',
        'x-rapidapi-key': process.env.NEXT_PUBLIC_SKYSCANNER_API_KEY || ''
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch SkyIDs');
    }

    const data = await response.json();
    return data.data.map((item: any) => ({
      entityId: item.id,
      name: item.name,
      cityName: item.city?.name,
      countryName: item.country?.name,
      type: item.type === 'AIRPORT' ? 'AIRPORT' : 'CITY',
      iata: item.iata
    })) || [];
  } catch (error) {
    console.error('Error fetching SkyIDs:', error);
    throw new Error('Impossible de récupérer la liste des aéroports. Veuillez réessayer plus tard.');
  }
}

export async function searchEverywhereFlights(params: FlightSearchParams): Promise<FlightDestination[]> {
  try {
    const url = `https://${process.env.NEXT_PUBLIC_SKYSCANNER_API_HOST}/flights/search-everywhere?fromEntityId=${params.fromEntityId}&type=${params.type || 'oneway'}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': process.env.NEXT_PUBLIC_SKYSCANNER_API_HOST || '',
        'x-rapidapi-key': process.env.NEXT_PUBLIC_SKYSCANNER_API_KEY || ''
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch destinations');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching destinations:', error);
    throw new Error('Impossible de récupérer les destinations. Veuillez réessayer plus tard.');
  }
}

export async function searchFlights(params: FlightSearchParams): Promise<FlightResponse> {
  try {
    // For now, return a mock response since we don't have a flight search API
    return {
      itineraries: [{
        legs: [{
          originPlaceId: params.fromEntityId,
          destinationPlaceId: params.toEntityId || 'unknown',
          departureDateTime: params.departDate,
          arrivalDateTime: params.departDate, // Mock arrival time
          durationInMinutes: 120, // Mock duration
          distance: 500, // Mock distance
          segments: [{
            operatingCarrier: {
              name: "Mock Airline"
            }
          }]
        }]
      }]
    };
  } catch (error) {
    console.error('Error searching flights:', error);
    throw new Error('Impossible de récupérer les vols. Veuillez réessayer plus tard.');
  }
}

// CO2 emission constants for different flight distances (in kg CO2 per passenger per km)
export const FLIGHT_CO2_FACTORS = {
  SHORT_HAUL: 0.156, // Flights < 1500 km
  MEDIUM_HAUL: 0.131, // Flights 1500-3700 km
  LONG_HAUL: 0.115   // Flights > 3700 km
};

export function calculateFlightEmissions(distanceKm: number): number {
  let factor: number;
  
  if (distanceKm < 1500) {
    factor = FLIGHT_CO2_FACTORS.SHORT_HAUL;
  } else if (distanceKm < 3700) {
    factor = FLIGHT_CO2_FACTORS.MEDIUM_HAUL;
  } else {
    factor = FLIGHT_CO2_FACTORS.LONG_HAUL;
  }

  return distanceKm * factor;
}
