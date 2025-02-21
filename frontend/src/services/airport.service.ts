import axios from 'axios';

interface Airport {
  id: string;
  name: string;
  iata: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  distance: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Fetches the nearest airport to the given coordinates
 */
export const getNearestAirport = async (
  latitude: number,
  longitude: number
): Promise<Airport> => {
  try {
    const response = await axios.get(`${API_URL}/api/airports/nearest`, {
      params: {
        latitude,
        longitude,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching nearest airport:', error);
    throw new Error('Failed to fetch nearest airport');
  }
};

/**
 * Calculates the flight path between two airports
 */
export const getFlightPath = async (
  originAirportId: string,
  destinationAirportId: string
): Promise<{
  distance: number;
  duration: number;
  path: { latitude: number; longitude: number }[];
}> => {
  try {
    const response = await axios.get(`${API_URL}/api/flights/path`, {
      params: {
        origin: originAirportId,
        destination: destinationAirportId,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error calculating flight path:', error);
    throw new Error('Failed to calculate flight path');
  }
};

/**
 * Calculates the CO2 emissions for a flight
 */
export const calculateFlightEmissions = async (
  distance: number,
  aircraftType: string = 'average'
): Promise<{
  emissions: number;
  savings: number;
  recommendations: string[];
}> => {
  try {
    const response = await axios.get(`${API_URL}/api/flights/emissions`, {
      params: {
        distance,
        aircraftType,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error calculating flight emissions:', error);
    throw new Error('Failed to calculate flight emissions');
  }
};
