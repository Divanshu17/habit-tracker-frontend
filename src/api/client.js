import axios from 'axios';

// Determine API URL based on environment
let API_URL;

if (import.meta.env.DEV) {
  // Development: use localhost
  API_URL = 'http://localhost:5000';
} else {
  // Production: use Render backend
  API_URL = 'https://habit-tracker-backend-17.onrender.com';
}

console.log('Environment:', import.meta.env.MODE);
console.log('API URL:', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
