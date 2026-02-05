import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, StatusBar } from 'react-native';
import { Text, Card, IconButton, Avatar, Chip, ProgressBar } from 'react-native-paper';
import api from '../services/api';
import { logout, getUser } from '../services/auth';

// Role-based dashboard imports
import OwnerDashboardContent from './dashboards/OwnerDashboard';
import ManagerDashboardContent from './dashboards/ManagerDashboard';
import StaffDashboardContent from './dashboards/StaffDashboard';

export default function DashboardScreen({ navigation }) {
    const [stats, setStats] = useState({ orders: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const currentUser = await getUser();
            setUser(currentUser);

            const res = await api.get('/orders');
            if (Array.isArray(res.data)) {
                let orders = res.data;

                if (currentUser && currentUser.role !== 'admin' && currentUser.role !== 'owner') {
                    orders = orders.filter(order =>
                        order.userId === currentUser.id || order.salesPersonId === currentUser.id
                    );
                }

                const orderCount = orders.length;
                const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
                setStats({ orders: orderCount, revenue: totalRevenue });
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigation.replace('Login');
    };

    // Render role-based dashboard content
    const renderDashboardContent = () => {
        const role = user?.role?.toLowerCase() || 'staff';

        switch (role) {
            case 'owner':
            case 'admin':
            case 'superadmin':
                return <OwnerDashboardContent stats={stats} navigation={navigation} />;
            case 'manager':
                return <ManagerDashboardContent stats={stats} navigation={navigation} />;
            case 'staff':
            case 'cashier':
            case 'kitchen':
            case 'inventory':
            default:
                return <StaffDashboardContent stats={stats} navigation={navigation} />;
        }
    };

    // Get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Get role display name
    const getRoleDisplayName = (role) => {
        const roleMap = {
            'owner': 'Owner',
            'admin': 'Admin',
            'superadmin': 'Super Admin',
            'manager': 'Manager',
            'staff': 'Staff',
            'cashier': 'Cashier',
            'kitchen': 'Kitchen',
            'inventory': 'Inventory',
        };
        return roleMap[role?.toLowerCase()] || 'User';
    };

    // Get role color
    const getRoleColor = (role) => {
        const colorMap = {
            'owner': '#D32F2F',
            'admin': '#1976D2',
            'superadmin': '#7B1FA2',
            'manager': '#388E3C',
            'staff': '#616161',
            'cashier': '#00796B',
            'kitchen': '#F57C00',
            'inventory': '#5D4037',
        };
        return colorMap[role?.toLowerCase()] || '#616161';
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1976D2" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Avatar.Text
                        size={48}
                        label={user ? user.name?.substring(0, 2).toUpperCase() : 'U'}
                        style={[styles.avatar, { backgroundColor: getRoleColor(user?.role) }]}
                    />
                    <View style={styles.userTextContainer}>
                        <Text variant="titleMedium" style={styles.userName}>
                            {getGreeting()}, {user ? user.name : 'User'}
                        </Text>
                        <View style={styles.roleContainer}>
                            <Chip
                                style={[styles.roleChip, { backgroundColor: getRoleColor(user?.role) }]}
                                textStyle={styles.roleChipText}
                                compact
                            >
                                {getRoleDisplayName(user?.role)}
                            </Chip>
                            <Text variant="bodySmall" style={styles.dateText}>
                                {new Date().toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </View>
                <IconButton
                    icon="logout"
                    iconColor="#FFFFFF"
                    onPress={handleLogout}
                    size={24}
                />
            </View>

            {/* Role-Based Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchStats}
                        colors={['#1976D2']}
                    />
                }
            >
                {renderDashboardContent()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        backgroundColor: '#1976D2',
        paddingTop: 48,
        paddingBottom: 20,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: '#0D47A1',
    },
    userTextContainer: {
        marginLeft: 12,
    },
    userName: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    roleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    roleChip: {
        height: 24,
        marginRight: 8,
    },
    roleChipText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    dateText: {
        color: 'rgba(255,255,255,0.8)',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
});
