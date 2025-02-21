import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: Date;
  isActive?: boolean;
}

export interface LocationHistory {
  startDate: Date;
  endDate: Date;
}

export const updateUserLocation = async (location: LocationUpdate): Promise<void> => {
  try {
    await axios.post(`${API_URL}/tracking/location`, location);
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
};

export const getUserLocation = async (): Promise<LocationUpdate> => {
  try {
    const response = await axios.get(`${API_URL}/tracking/location`);
    return response.data;
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
};

export const getLocationHistory = async (params: LocationHistory): Promise<LocationUpdate[]> => {
  try {
    const response = await axios.get(`${API_URL}/tracking/history`, { params });
    return response.data;
  } catch (error) {
    console.error('Error getting location history:', error);
    throw error;
  }
};
