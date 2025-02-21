export interface AdminJourneysResponse {
  journeys: Array<{
    id: string;
    user_id: string;
    transport_mode: string;
    distance_km: number;
    co2_emissions: number;
    start_time: string;
    end_time: string;
  }>;
  total: number;
  page: number;
  pageSize: number;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  isActive: boolean;
  created_at: string;
}

export interface Journey {
  id: string;
  user_id: string;
  transport_mode: string;
  distance_km: number;
  co2_emissions: number;
  start_time: string;
  end_time: string;
}

export async function fetchAdminJourneys(): Promise<AdminJourneysResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/journeys`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch admin journeys');
  }

  return response.json();
}

export async function fetchAllUsers(): Promise<User[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/admin/users`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

export async function fetchAllJourneys(): Promise<Journey[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/journeys`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch journeys');
  }

  return response.json();
}

export async function fetchUserJourneys(userId: string): Promise<Journey[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/journeys?userId=${userId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch journeys for user ${userId}`);
  }

  return response.json();
}
