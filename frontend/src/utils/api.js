import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000, // 10 second timeout
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Network error - backend not reachable
        if (!error.response) {
            const networkError = new Error(
                'Cannot connect to server. Please check:\n' +
                '1. Backend server is running\n' +
                '2. API URL is correct in .env file\n' +
                '3. You are on the same network (for cross-device access)'
            );
            networkError.isNetworkError = true;
            return Promise.reject(networkError);
        }

        // Timeout error
        if (error.code === 'ECONNABORTED') {
            const timeoutError = new Error('Request timeout. Server might be slow or unreachable.');
            timeoutError.isTimeout = true;
            return Promise.reject(timeoutError);
        }

        // Return the original error for other cases
        return Promise.reject(error);
    }
);

export default api;
