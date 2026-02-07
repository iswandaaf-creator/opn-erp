import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://fat-freida-kukikuki-e5bb1b61.koyeb.app', // Fallback to Prod
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user?.token || user?.access_token) {
                    config.headers.Authorization = `Bearer ${user.token || user.access_token}`;
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
