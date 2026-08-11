import axios from 'axios';

import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  // If you want to use the live backend in development, use it directly here:
  return 'https://app.bimalinstitute.com/api/v1'; 
};

// const API_BASE_URL = getBaseUrl();


export const API_BASE_URL = getBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

import { useAuthStore } from '../store/useAuthStore';

// Example Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Retrieve the actual token from the auth store
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Example Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login or refresh token)
      console.log('Unauthorized access - please login again.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

export const AuthService = {
  login: (data: any) => apiClient.post('/auth/login', data),
  sendLoginOtp: (data: any) => apiClient.post('/auth/login/send-otp', data),
  verifyLoginOtp: (data: any) => apiClient.post('/auth/login/verify', data),
  verifyOTP: (data: any) => apiClient.post('/auth/register/verify', data), // Update this if needed to match register
  register: (data: any) => apiClient.post('/auth/register/send-otp', data), // Update this if needed
};
