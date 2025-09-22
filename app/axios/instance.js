import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } 
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors globally
    if (error.response && error.response.status === 401) {
      // Check if we're not already on the login page
      if (typeof window !== 'undefined' && 
          !window.location.pathname.includes('/signin') && 
          !window.location.pathname.includes('/signup')) {
        
        // Clear token
        localStorage.removeItem('access_token');
        
        // Redirect to login page
        window.location.href = '/signin';
        
        return Promise.reject({
          ...error,
          message: 'Your session has expired. Please log in again.'
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
