import axios from 'axios';

// Frontend runs on 4000, backend on 3000
const baseURL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    try {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
      }
    } catch (e) {
      // Ignore logging errors
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    try {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        const responseError = error?.response?.data?.message;
        console.warn('[API Error]', responseError || errorMessage);
      }

      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    } catch (e) {
      // Ignore logging errors
    }
    return Promise.reject(error);
  }
);
