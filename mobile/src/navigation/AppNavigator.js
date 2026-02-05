import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SalesDashboardScreen from '../screens/SalesDashboardScreen';
import GenericListScreen from '../screens/GenericListScreen';
import DocumentScreen from '../screens/DocumentScreen';
import { getToken } from '../services/auth';

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
            console.error('Auth check error:', e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                <ActivityIndicator size="large" color="#1976D2" />
            </View>
        );
    }

    return (
        <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTintColor: '#1976D2',
                headerTitleStyle: { fontWeight: 'bold' },
                cardStyle: { backgroundColor: '#F5F5F5' },
            }}
        >
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
            <Stack.Screen
                name="SalesDashboard"
                component={SalesDashboardScreen}
                options={{ title: 'Sales & Distribution' }}
            />
            <Stack.Screen
                name="GenericList"
                component={GenericListScreen}
                options={({ route }) => ({ title: route.params?.title || 'List' })}
            />
            <Stack.Screen
                name="Document"
                component={DocumentScreen}
                options={{ title: 'Document Details' }}
            />
        </Stack.Navigator>
    );
}
