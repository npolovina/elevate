import axios from 'axios';

// Determine the API base URL from environment or default to localhost
const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create an instance of axios with default config
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add longer timeout for slow connections
  timeout: 10000, // 10 seconds
});

// Log the API base URL for debugging
console.log('API Base URL:', apiBaseUrl);

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // Log outgoing requests for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // You could add auth tokens here if needed
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    // We removed the originalRequest variable since it's not being used
    
    if (error.response) {
      // Handle specific error statuses
      console.error(`API Error (${error.response.status}):`, error.response.data);
      
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error('Unauthorized access');
          break;
        case 404:
          // Handle not found
          console.error('Resource not found');
          break;
        case 500:
          // Handle server error
          console.error('Server error');
          break;
        default:
          console.error(`Error with status code: ${error.response.status}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server', error.request);
      // Check if we're in development environment
      if (process.env.NODE_ENV === 'development') {
        console.warn('In development mode - check if backend server is running on:', apiBaseUrl);
      }
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request', error.message);
    }
    
    // Enhanced error object with more context
    const enhancedError = {
      ...error,
      isApiError: true,
      message: error.message || 'Unknown API error',
      status: error.response?.status || 0,
    };
    
    return Promise.reject(enhancedError);
  }
);

export default api;