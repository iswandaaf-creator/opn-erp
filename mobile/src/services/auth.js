import api from './api';
import * as SecureStore from 'expo-secure-store';

export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.access_token) {
            await SecureStore.setItemAsync('token', response.data.access_token);
            await SecureStore.setItemAsync('user', JSON.stringify(response.data.user || {}));
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
};

export const getToken = async () => {
    return await SecureStore.getItemAsync('token');
};
