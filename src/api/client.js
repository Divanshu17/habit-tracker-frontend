import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn('VITE_API_URL not set, using default:', 'https://habit-tracker-backend-17.onrender.com');
}

const apiClient = axios.create({
  baseURL: API_URL || 'https://habit-tracker-backend-17.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log API URL in development
if (import.meta.env.DEV) {
  console.log('API URL:', apiClient.defaults.baseURL);
}

export default apiClient;
