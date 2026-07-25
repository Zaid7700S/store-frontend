import axios from "axios";

// Fallback to your live Render backend URL if env variable isn't set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://store-backend-ilsn.onrender.com";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh on 401
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const accessToken = localStorage.getItem('accessToken');

                // Explicitly send request to the backend API base URL
                const response = await axios.post(`${API_BASE_URL}/api/Users/refresh-token`, {
                    AccessToken: accessToken,
                    RefreshToken: refreshToken,
                });

                // Handle potential camelCase or PascalCase properties from C# JSON responses
                const newAccessToken = response.data.accessToken || response.data.AccessToken;
                const newRefreshToken = response.data.refreshToken || response.data.RefreshToken;

                if (!newAccessToken) {
                    throw new Error("No token returned from refresh endpoint.");
                }

                localStorage.setItem('accessToken', newAccessToken);
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                }

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                console.error("Session expired. Please log in again.", refreshError);
                
                // Clear state on failure
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // Redirect user to login page
                window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;