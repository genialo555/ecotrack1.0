// src/lib/utils/api-client.ts
import Cookies from 'js-cookie';

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const fullEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;

  console.log('🚀 API Request:', {
    url: `${API_URL}${fullEndpoint}`,
    method: options.method || 'GET',
  });

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  const token = Cookies.get('token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
    console.log('🔑 Token présent:', !!token);
  }

  try {
    const response = await fetch(`${API_URL}${fullEndpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    console.log('📡 Response status:', response.status);

    // Gérer un 401 (session expirée, token invalide)
    if (response.status === 401) {
      Cookies.remove('token');
      throw new Error('Session expirée');
    }

    // Gérer les autres erreurs
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: 'Erreur inconnue',
        statusCode: response.status
      }));
      
      console.error('❌ API Error:', {
        status: response.status,
        error: errorData
      });

      throw new Error(errorData.message || `Erreur ${response.status}`);
    }

    const responseData = await response.json();
    console.log('✅ API Success:', { status: response.status, data: responseData });
    
    // Si la réponse est déjà au format attendu (avec data), on la retourne
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      return responseData.data;
    }
    
    // Sinon, on retourne directement les données
    return responseData;

  } catch (error) {
    console.error('🚨 API Client Error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Une erreur de connexion est survenue');
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};