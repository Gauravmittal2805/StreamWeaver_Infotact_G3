import axios from 'axios';

// Base API instance configured for StreamWeaver
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 300000, // 5 min timeout for large uploads
  headers: {
    'Accept': 'application/json',
  },
});

// Response interceptor for consistent error mapping
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred.';
    let code = 'UNKNOWN_ERROR';

    if (error.response) {
      // Server responded with a status code outside 2xx
      message = error.response.data?.message || error.response.data?.error || `Server responded with status ${error.response.status}`;
      code = error.response.data?.code || `HTTP_${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received (backend down / network error)
      message = 'Unable to connect to StreamWeaver server. Please ensure backend is running.';
      code = 'BACKEND_UNAVAILABLE';
    } else {
      // Setup error
      message = error.message;
      code = 'CLIENT_ERROR';
    }

    return Promise.reject({
      message,
      code,
      originalError: error,
    });
  }
);

export default api;
