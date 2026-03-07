import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4001/api/vault',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
  
// Request interceptor
api.interceptors.request.use(
  (config) => {
    // If sending FormData, remove Content-Type header to let browser set it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    // For blob requests, also remove Content-Type to avoid issues
    if (config.responseType === 'blob') {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect for blob requests - let the component handle the error
    if (error.config?.responseType === 'blob') {
      return Promise.reject(error);
    }
    if (error.response?.status === 401) {
      // Only redirect to /auth for genuine authentication failures (expired/missing JWT).
      // Skip redirect if already on /auth to avoid infinite loops.
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/auth/');
      const alreadyOnAuth = window.location.pathname === '/auth';

      if (!isAuthEndpoint && !alreadyOnAuth) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
