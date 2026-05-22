import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create Axios client with default configurations
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach headers or perform pre-flight edits
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Example: Read token from localStorage and attach to Authorization header
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development environment
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format errors and handle global cases (e.g. 401s)
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] Successful response from ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data;
    
    // Log error globally
    console.error('[API Error]', {
      status,
      message: error.message,
      data,
    });

    if (status === 401) {
      // Handle unauthorized access (e.g. token expired, clear state)
      localStorage.removeItem('token');
      // optionally redirect to login or trigger store action
    }

    // Return a readable error message
    const customError = {
      message: (data as { message?: string })?.message || error.message || 'An unexpected error occurred',
      status: status || 500,
      originalError: error,
    };

    return Promise.reject(customError);
  }
);

export default api;
