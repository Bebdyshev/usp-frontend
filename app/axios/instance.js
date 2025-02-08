import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      window.location.href = '/signin'; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
