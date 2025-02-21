import axios from 'axios';
import type { Journey, JourneyStats, JourneyChartData } from '@/types/journey';
import { CreateJourneyDto } from '@/types/journey.dto';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Point {
  latitude: number;
  longitude: number;
}

export const createJourney = async (journeyData: CreateJourneyDto): Promise<Journey> => {
  try {
    const response = await axios.post(`${API_URL}/journeys`, journeyData);
    return response.data;
  } catch (error) {
    console.error('Error creating journey:', error);
    throw error;
  }
};

export const getJourneyStats = async (userId: string): Promise<JourneyStats> => {
  try {
    const response = await axios.get(`${API_URL}/journeys/stats`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching journey stats:', error);
    throw error;
  }
};

export const getJourneyChartData = async (userId: string, days: number = 7): Promise<JourneyChartData[]> => {
  try {
    const response = await axios.get(`${API_URL}/journeys/chart`, {
      params: { userId, days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching journey chart data:', error);
    throw error;
  }
};

export const getLastJourney = async (userId: string): Promise<Journey | null> => {
  try {
    const response = await axios.get(`${API_URL}/journeys/last`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching last journey:', error);
    throw error;
  }
};
