import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Spinner, Layout } from '@ui-kitten/components';
import { getToken } from '../services/auth';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SalesDashboardScreen from '../screens/SalesDashboardScreen';
import GenericListScreen from '../screens/GenericListScreen';
import DocumentScreen from '../screens/DocumentScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import GroupChatScreen from '../screens/GroupChatScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    const [initialRoute, setInitialRoute] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await getToken();
                setInitialRoute(token ? 'Dashboard' : 'Login');
            } catch (e) {
                setInitialRoute('Login');
            }
        };
        checkAuth();
    }, []);

    if (!initialRoute) {
        return (
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner size='giant' />
            </Layout>
        );
    }

    return (
        <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
                headerStyle: { backgroundColor: '#3366FF' },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: { fontWeight: 'bold' },
                cardStyle: { backgroundColor: '#F7F9FC' },
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
                options={{ title: 'Sales' }}
            />
            <Stack.Screen
                name="GenericList"
                component={GenericListScreen}
                options={({ route }) => ({ title: route.params?.title || 'List' })}
            />
            <Stack.Screen
                name="Document"
                component={DocumentScreen}
                options={{ title: 'Details' }}
            />
            {/* Chat Screens */}
            <Stack.Screen
                name="ChatList"
                component={ChatListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="GroupChat"
                component={GroupChatScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CreateGroup"
                component={CreateGroupScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
