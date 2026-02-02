import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import { getToken } from '../services/auth';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

export default function AppNavigator() {
    const [loading, setLoading] = useState(true);
    const [initialRoute, setInitialRoute] = useState('Login');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await getToken();
            if (token) {
                setInitialRoute('Dashboard');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
