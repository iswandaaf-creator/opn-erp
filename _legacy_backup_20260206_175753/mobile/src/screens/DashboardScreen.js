import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, StatusBar } from 'react-native';
import { Layout, Text, Avatar, Button, Card, Spinner, Icon } from '@ui-kitten/components';
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

    // Get current date
    const today = new Date();
    const dateString = today.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Get role color
    const getRoleColor = (role) => {
        const colorMap = {
            'owner': 'danger',
            'admin': 'primary',
            'superadmin': 'warning',
            'manager': 'success',
            'staff': 'basic',
        };
        return colorMap[role?.toLowerCase()] || 'basic';
    };

    return (
        <Layout style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#3366FF" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Avatar
                        size='giant'
                        source={{ uri: `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D47A1&color=fff` }}
                    />
                    <View style={styles.userTextContainer}>
                        <Text category='h6' style={styles.userName}>
                            {getGreeting()}, {user ? user.name : 'User'}
                        </Text>
                        <Text category='c1' style={styles.dateText}>
                            {dateString}
                        </Text>
                        <Button
                            size='tiny'
                            status={getRoleColor(user?.role)}
                            style={styles.roleButton}
                        >
                            {user?.role?.toUpperCase() || 'USER'}
                        </Button>
                    </View>
                </View>
                <View style={styles.headerActions}>
                    <Button
                        size='small'
                        appearance='ghost'
                        status='control'
                        onPress={() => navigation.navigate('ChatList')}
                    >
                        💬
                    </Button>
                    <Button
                        size='small'
                        appearance='ghost'
                        status='control'
                        onPress={handleLogout}
                    >
                        🚪
                    </Button>
                </View>
            </View>

            {/* Role-Based Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchStats}
                        colors={['#3366FF']}
                    />
                }
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Spinner size='giant' />
                    </View>
                ) : (
                    renderDashboardContent()
                )}
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#3366FF',
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
        flex: 1,
    },
    userTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    userName: {
        color: '#FFFFFF',
    },
    dateText: {
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    roleButton: {
        marginTop: 8,
        alignSelf: 'flex-start',
        borderRadius: 20,
    },
    headerActions: {
        flexDirection: 'row',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
});
