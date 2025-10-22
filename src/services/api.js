import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../utils/constants';
import storage from '../utils/storage';

/**
 * Create Axios instance with base configuration
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

/**
 * Request Interceptor - Add auth token to requests
 */
api.interceptors.request.use(
  (config) => {
    const token = storage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Handle token refresh and errors
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = storage.getRefreshToken();

      if (!refreshToken) {
        // No refresh token, logout user
        storage.clearAll();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh token
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.REFRESH}`,
          { refreshToken }
        );

        const { accessToken } = response.data.data;
        storage.setAccessToken(accessToken);

        // Update default header
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        isRefreshing = false;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Refresh failed, logout user
        storage.clearAll();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Enhanced error handling for CORS and network issues
    if (!error.response) {
      // Network error or CORS issue
      if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
        console.error('🚫 Network/CORS Error:', {
          message: error.message,
          config: {
            baseURL: error.config?.baseURL,
            url: error.config?.url,
            method: error.config?.method
          }
        });
        
        // Create a more user-friendly error message
        const corsError = new Error('Unable to connect to the server. This might be a network issue or CORS configuration problem.');
        corsError.name = 'NetworkError';
        corsError.originalError = error;
        return Promise.reject(corsError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Health check utility to test API connectivity
 */
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000,
    });
    return { healthy: true, status: response.status };
  } catch (error) {
    console.error('API Health Check Failed:', error.message);
    return { 
      healthy: false, 
      error: error.message,
      isNetworkError: !error.response,
      isCorsError: error.message.includes('CORS')
    };
  }
};

export default api;
