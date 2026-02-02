import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace with your computer's local IP address if testing on physical device
// For Android Emulator, use 'http://10.0.2.2:3000'
// For iOS Simulator, use 'http://localhost:3000'
const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
