import { api } from '@/lib/api';

export interface Activity {
  id: string;
  type: 'vehicle' | 'journey' | 'user';
  action: 'create' | 'update' | 'delete';
  timestamp: Date;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  details: Record<string, any>;
}

export const activityService = {
  getRecentActivities: async (limit: number = 10): Promise<Activity[]> => {
    try {
      const { data } = await api.get(`/api/activities?limit=${limit}`);
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format from server');
      }
      return data.map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp),
      }));
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        const errorDetails = error?.response?.data || (error instanceof Error ? error.message : 'Unknown error');
        console.warn('Failed to fetch activities:', errorDetails);
      }
      if (error?.response?.status === 401) {
        throw new Error('Unauthorized access. Please log in again.');
      }
      throw error?.response?.data?.message || error.message || 'Failed to fetch activities';
    }
  },
};
