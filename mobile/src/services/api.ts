import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Load token from storage on initialization
AsyncStorage.getItem('auth-storage').then((value) => {
  if (value) {
    try {
      const parsed = JSON.parse(value);
      if (parsed.state?.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${parsed.state.token}`;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth-storage');
      // Navigation will be handled by the app state
    }
    return Promise.reject(error);
  }
);

export default api;


