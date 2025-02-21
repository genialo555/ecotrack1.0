import axios from 'axios';
import { VehicleEmissions } from '@/types/emissions.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Default emissions data for different vehicle types
export const defaultVehicleEmissions: VehicleEmissions[] = [
  {
    vehicle: {
      id: 'default-car',
      userId: '',
      brand: 'Voiture moyenne',
      model: 'Essence',
      year: 2020,
      type: 'DRIVING',
      fuelType: 'petrol',
      consumption: 7,
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    co2: 120 // g/km
  },
  {
    vehicle: {
      id: 'default-train',
      userId: '',
      brand: 'Train',
      model: 'TGV',
      year: 2020,
      type: 'TRANSIT',
      fuelType: 'electric',
      consumption: 0,
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    co2: 3.5 // g/km
  },
  {
    vehicle: {
      id: 'default-plane',
      userId: '',
      brand: 'Avion',
      model: 'Court-courrier',
      year: 2020,
      type: 'FLYING',
      fuelType: 'kerosene',
      consumption: 0,
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    co2: 285 // g/km
  }
];

/**
 * Fetches emissions data for all available vehicles
 */
export const getVehicleEmissions = async (): Promise<VehicleEmissions[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/vehicles/emissions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle emissions:', error);
    // Return default emissions if API call fails
    return defaultVehicleEmissions;
  }
};

interface CalculateEmissionsParams {
  distance: number;
  vehicleId?: string;
  transportMode: google.maps.TravelMode;
}

/**
 * Calculates CO2 emissions for a specific journey
 */
export const calculateJourneyEmissions = async ({
  distance,
  vehicleId,
  transportMode
}: CalculateEmissionsParams): Promise<number> => {
  try {
    const response = await axios.post('/api/emissions/calculate', {
      distance,
      vehicleId,
      transportMode
    });
    return response.data.co2Emissions;
  } catch (error) {
    console.error('Error calculating emissions:', error);
    throw error;
  }
};
